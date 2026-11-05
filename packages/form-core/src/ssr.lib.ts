import { batch } from '@tanstack/store'
import { defaultInternalBaseFieldMeta } from './FieldApi/fieldState.lib'
import { visitAllFormFields } from './FieldApi/fieldTraversal.lib'
import { evaluate } from './utils.lib'
import { runServerValidators } from './pipeline/serverValidation.lib'
import { ValidationResultCollector } from './pipeline/utils.lib'
import { devtools } from './devtoolsBridge.lib'
import type { FormErrorMeta } from './FormApi/formState.lib'
import type { AnyInternalFormApi, InternalFormApi } from './FormApi/FormApi.lib'
import type { AnyInternalFieldApi } from './FieldApi/FieldApi.lib'
import type {
  ServerFormState,
  ServerValidateResult,
} from './FormApi/formServerState.public'
import type { FormOptions } from './FormApi/formOptions.public'

function createInitialFormErrorMeta(): FormErrorMeta {
  return {
    validationSourceErrors: null,
  }
}

function resetFieldMetaForServerState(form: AnyInternalFormApi) {
  visitAllFormFields(form._fieldRootNode, (field) => {
    field._defaultValueCache = null

    field._listenerInstances?.forEach((instance) => instance.resetRuntime())
    field._validatorInstances?.forEach((instance) => instance.resetRuntime())

    const metaAtom = field._atoms.meta
    if (metaAtom && metaAtom.get() !== defaultInternalBaseFieldMeta) {
      metaAtom.set(defaultInternalBaseFieldMeta)
      devtools().updateField?.(field)
    }
  })
}

function resetToServerState<TFormData>(
  form: InternalFormApi<TFormData>,
  serverState: ServerFormState<TFormData>,
  defaultValues: TFormData,
): void {
  const values = serverState.values ?? defaultValues
  const shouldUpdateDefaultValues = !evaluate(
    values,
    form._options.defaultValues,
  )

  form._listenerInstances?.forEach((instance) => instance.resetRuntime())
  form._validatorInstances?.forEach((instance) => instance.resetRuntime())
  form._onSubmitSource.resetRuntime()
  form._defaultValueCache = null

  if (shouldUpdateDefaultValues) {
    form._options = {
      ...form._options,
      defaultValues: values,
    }
  }

  batch(() => {
    resetFieldMetaForServerState(form)
    if (shouldUpdateDefaultValues) {
      form._atoms.defaultValuesVersion.set((version) => version + 1)
    }
    form._atoms.values.set(values)
    form._atoms.meta.isDirty.set(false)
    form._atoms.meta.touchedFieldCount.set(0)
    form._atoms.meta.formErrors.set(createInitialFormErrorMeta())
    form._atoms.meta.errorFields.set(new Set<AnyInternalFieldApi>())
    form._atoms.meta.fieldValidationCount.set(0)
    form._atoms.meta.validationCount.set(0)
    form._atoms.meta.isSubmitting.set(false)
    form._atoms.meta.isSubmitSuccessful.set(false)
    form._atoms.meta.submissionAttempts.set(serverState.submissionAttempts)

    for (const result of serverState.validationResults) {
      const validatorInstance =
        form._validatorInstances?.[result.validatorIndex]
      if (!validatorInstance) continue

      form._processValidationResult({ ...result, validatorInstance }, 'server')
    }
  })
}

export function applyServerState<TFormData>(
  form: InternalFormApi<TFormData>,
  serverState: ServerFormState<TFormData> | null,
  defaultValues: TFormData,
): void {
  if (serverState === form._lastServerState) return

  form._lastServerState = serverState

  if (!serverState) {
    form._clearFormValidationSource('server')
    return
  }

  resetToServerState(form, serverState, defaultValues)
}

export async function validateServerValues<
  TFormData,
  const TValidatorConfig extends unknown[],
  TValidators,
  TSubmitReturn,
>(
  options: FormOptions<
    TFormData,
    TValidatorConfig,
    TValidators,
    TSubmitReturn,
    unknown
  >,
  values: TFormData,
): Promise<ServerValidateResult<TFormData, TValidators>> {
  const validators = options.validators
  const validatorCount = validators?.length ?? 0
  const collector = new ValidationResultCollector()
  const run = runServerValidators({
    validators,
    value: values,
    onDeferredResults: collector.collect,
  })
  collector.collect(run.syncResults)
  await run.pending

  if (collector.hasErrors()) {
    return {
      success: false,
      serverState: {
        values,
        validationResults: collector
          .getResults()
          .map(({ instance, value }) => ({
            validatorIndex: instance.index,
            ...value,
          })),
        submissionAttempts: 1,
      },
    }
  }

  return {
    success: true,
    values,
    validatorOutputs: collector.getOutputs(validatorCount) as any,
  }
}

import { batch } from '@tanstack/store'
import { createOutput } from './validationOutput.lib'
import { defaultInternalBaseFieldMeta } from './FieldApi/fieldState.lib'
import { visitAllFormFields } from './FieldApi/fieldTraversal.lib'
import { evaluate } from './utils.lib'
import { runValidatorPipeline } from './validation'
import { createErrorMapFactory } from './createErrorMap.lib'
import { devtools } from './devtoolsBridge.lib'
import { reconcileValidatorInstances } from './ValidatorInstance.lib'
import type { FormErrorMeta } from './FormApi/formState.lib'
import type { AnyInternalFormApi, InternalFormApi } from './FormApi/FormApi.lib'
import type { AnyInternalFieldApi } from './FieldApi/FieldApi.lib'
import type { FormValidationResult } from './validation/state.public'
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
  const pipeline = options.validators

  if (!pipeline || pipeline.length === 0) {
    return {
      success: true,
      values,
      validatorOutputs: [] as never,
    }
  }

  const validatorInstances = reconcileValidatorInstances({
    definitions: pipeline,
    instances: null,
    owner: options,
    scope: 'form',
  })

  try {
    const pipelineResult = await runValidatorPipeline<
      FormValidationResult<TFormData>
    >({
      pipeline: validatorInstances ?? [],
      context: {
        scope: 'server',
        event: 'server',
        formApi: undefined,
      },
      hasFailedBefore: false,
      getContext: (ctx) => ({
        event: 'server',
        signal: ctx.signal,
        formApi: undefined,
        value: values,
        createErrorMap: createErrorMapFactory(values),
        createOutput,
      }),
      scope: 'form',
    })

    if (pipelineResult.thrownError !== null) {
      throw pipelineResult.thrownError
    }

    const validatorOutputs =
      validatorInstances?.map((instance) => {
        const result = pipelineResult.results.find(
          (r) => r.validatorInstance === instance,
        )
        return result?.hasOutput ? result.output : undefined
      }) ?? []

    const validationResults = pipelineResult.results.map((result) => ({
      validatorIndex:
        validatorInstances?.indexOf(result.validatorInstance) ?? -1,
      result: result.result,
      output: result.output,
      hasOutput: result.hasOutput,
    }))

    if (pipelineResult.hasErrors) {
      return {
        success: false,
        serverState: {
          values,
          validationResults,
          submissionAttempts: 1,
        },
      }
    }

    return {
      success: true,
      values,
      validatorOutputs: validatorOutputs as never,
    }
  } finally {
    validatorInstances?.forEach((instance) => instance.dispose())
  }
}

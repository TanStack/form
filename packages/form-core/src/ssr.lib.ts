import { batch } from '@tanstack/store'
import { defaultInternalBaseFieldMeta } from './FieldApi/fieldState.lib'
import { visitAllFormFields } from './FieldApi/fieldTraversal.lib'
import { parseStandardSchemaIssues } from './standardSchema.lib'
import { cancelPipelineCache, createPipelineCache, evaluate } from './utils.lib'
import { runValidatorPipeline } from './validation'
import { createErrorMap } from './validation.public'
import { devtools } from './devtoolsBridge.lib'
import { reconcileValidatorInstances } from './ValidatorInstance.lib'
import type { FormOptions } from './FormApi/FormApi.public'
import type { FormErrorMeta } from './FormApi/formState.lib'
import type { InternalFormApi } from './FormApi/FormApi.lib'
import type { AnyInternalFieldApi } from './FieldApi/FieldApi.lib'
import type {
  FormValidateResultFromErrorTypes,
  FormValidators,
  ToServerFormErrorTypes,
} from './validation.public'
import type { ServerFormState, ServerValidateResult } from './ssr.public'

type ServerFormValidateResult<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> = FormValidateResultFromErrorTypes<
  TFormData,
  ToServerFormErrorTypes<TFormValidators>
>

function createInitialFormErrorMeta(): FormErrorMeta {
  return {
    validationSourceErrors: null,
  }
}

function resetFieldMetaForServerState(form: InternalFormApi<any, any, any>) {
  visitAllFormFields(form._fieldRootNode, (field) => {
    field._defaultValueCache = null

    if (field._pipelineCache) {
      cancelPipelineCache(field._pipelineCache)
      field._pipelineCache = null
    }
    field._validatorInstances?.forEach((instance) => instance.resetRuntime())

    const metaAtom = field._atoms.meta
    if (metaAtom && metaAtom.get() !== defaultInternalBaseFieldMeta) {
      metaAtom.set(defaultInternalBaseFieldMeta)
      devtools().updateField?.(field)
    }
  })
}

function resetToServerState<TFormData>(
  form: InternalFormApi<TFormData, any, any>,
  serverState: ServerFormState<TFormData, any>,
  defaultValues: TFormData,
): void {
  const values = serverState.values ?? defaultValues
  const shouldUpdateDefaultValues = !evaluate(
    values,
    form._options.defaultValues,
  )

  cancelPipelineCache(form._pipelineCache)
  form._pipelineCache = createPipelineCache()
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
  form: InternalFormApi<TFormData, any, any>,
  serverState: ServerFormState<TFormData, any> | null,
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
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  values: TFormData,
): Promise<ServerValidateResult<TFormData, TFormValidators>> {
  const pipeline = options.validators
  const validatorInstances = reconcileValidatorInstances({
    definitions: pipeline,
    instances: null,
    owner: options,
    scope: 'form',
  })

  if (!pipeline || pipeline.length === 0) {
    return {
      success: true,
      values,
      schemaOutputs: [] as never,
    }
  }

  try {
    const pipelineResult = await runValidatorPipeline<
      ServerFormValidateResult<TFormData, TFormValidators>
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
        createErrorMap,
        parseIssues: (issues) =>
          parseStandardSchemaIssues(issues, values, 'form'),
      }),
      scope: 'form',
    })

    if (pipelineResult.thrownError !== null) {
      throw pipelineResult.thrownError
    }

    const schemaOutputs =
      validatorInstances?.map((instance) => {
        const result = pipelineResult.results.find(
          (r) => r.validatorInstance === instance,
        )
        return result?.hasSchemaResult ? result.schemaResult : undefined
      }) ?? []

    const validationResults = pipelineResult.results.map((result) => ({
      validatorIndex:
        validatorInstances?.indexOf(result.validatorInstance) ?? -1,
      result: result.result,
      schemaResult: result.schemaResult,
      hasSchemaResult: result.hasSchemaResult,
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
      schemaOutputs: schemaOutputs as never,
    }
  } finally {
    validatorInstances?.forEach((instance) => instance.dispose())
  }
}

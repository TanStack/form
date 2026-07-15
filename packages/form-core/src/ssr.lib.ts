import { batch } from '@tanstack/store'
import { defaultInternalBaseFieldMeta } from './FieldApi/fieldState.lib'
import { visitAllFormFields } from './FieldApi/fieldTraversal.lib'
import { parseStandardSchemaIssues } from './standardSchema.lib'
import { cancelPipelineCache, createPipelineCache, evaluate } from './utils.lib'
import { runValidatorPipeline } from './validation.lib'
import { createErrorMap } from './validation.public'
import { devtools } from './devtoolsBridge.lib'
import type { FormOptions } from './FormApi/FormApi.public'
import type { FormErrorMeta } from './FormApi/formState.lib'
import type { InternalFormApi } from './FormApi/FormApi.lib'
import type { AnyInternalFieldApi } from './FieldApi/FieldApi.lib'
import type { FormValidateResult, FormValidators } from './validation.public'
import type {
  ServerFormState,
  ServerValidateFrameworkPlugin,
  ServerValidateResult,
} from './ssr.public'

type ServerValidateHelperResult<
  TFramework extends ServerValidateFrameworkPlugin,
> = Omit<TFramework, 'id'> & {
  initialServerFormState: ServerFormState<any, any>
}

function createInitialFormErrorMeta(validatorCount: number): FormErrorMeta {
  return {
    errors: Array.from({ length: validatorCount }, () => []),
    errorSourceEvents: Array.from({ length: validatorCount }, () => null),
  }
}

function createInitialFieldErrors(
  validatorCount: number,
): Array<Set<AnyInternalFieldApi>> {
  return Array.from(
    { length: validatorCount },
    () => new Set<AnyInternalFieldApi>(),
  )
}

function resetFieldMetaForServerState(form: InternalFormApi<any, any, any>) {
  visitAllFormFields(form._fieldRootNode, (field) => {
    field._defaultValueCache = null

    if (field._pipelineCache) {
      cancelPipelineCache(field._pipelineCache)
      field._pipelineCache = null
    }

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
  const validatorCount = form.options.validators?.length ?? 0
  const values = serverState.values ?? defaultValues
  const shouldUpdateDefaultValues = !evaluate(
    values,
    form._options.defaultValues,
  )

  cancelPipelineCache(form._pipelineCache)
  form._pipelineCache = createPipelineCache()
  form._schemaOutputs = []
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
    form._atoms.meta.formErrors.set(createInitialFormErrorMeta(validatorCount))
    form._atoms.meta.fieldErrors.set(createInitialFieldErrors(validatorCount))
    form._atoms.meta.errorFields.set(new Set<AnyInternalFieldApi>())
    form._atoms.meta.fieldValidationCount.set(0)
    form._atoms.meta.validationCount.set(0)
    form._atoms.meta.isSubmitting.set(false)
    form._atoms.meta.isSubmitSuccessful.set(false)
    form._atoms.meta.submissionAttempts.set(serverState.submissionAttempts)

    for (const result of serverState.validationResults) {
      form._processValidationResult(result, 'server')
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

export const initialServerFormState: ServerFormState<any, any> = {
  values: undefined,
  validationResults: [],
  submissionAttempts: 0,
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
  const schemaOutputs: Array<unknown> = Array.from(
    { length: pipeline?.length ?? 0 },
    () => undefined,
  )

  if (!pipeline || pipeline.length === 0) {
    return {
      success: true,
      values,
      schemaOutputs: schemaOutputs as never,
    }
  }

  const pipelineResult = await runValidatorPipeline<
    FormValidateResult<TFormData>
  >({
    pipeline,
    cache: createPipelineCache(),
    context: {
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

  for (const result of pipelineResult.results) {
    if (result.hasSchemaResult) {
      schemaOutputs[result.validatorIndex] = result.schemaResult
    }
  }

  if (pipelineResult.hasErrors) {
    return {
      success: false,
      serverState: {
        values,
        validationResults: pipelineResult.results,
        submissionAttempts: 1,
      },
    }
  }

  return {
    success: true,
    values,
    schemaOutputs: schemaOutputs as never,
  }
}

export function serverValidateHelper<
  const TFramework extends ServerValidateFrameworkPlugin,
>(options: { framework: TFramework }): ServerValidateHelperResult<TFramework> {
  const { id: _unused, ...framework } = options.framework

  return {
    initialServerFormState,
    ...framework,
  }
}

import { createErrorMap } from '../validation.public'
import {
  isStandardSchema,
  parseStandardSchema,
  parseStandardSchemaIssues,
} from '../standardSchema.lib'
import { isPromiseLike } from '../utils.lib'
import { isErrorResult } from './errors.lib'
import { createValidatorAbortContext, parseFieldIssues } from './execution.lib'
import type { PipelineCache } from '../utils.lib'
import type {
  FieldValidateResult,
  FieldValidator,
  FormGroupValidateResult,
  FormGroupValidator,
  FormValidateResult,
  FormValidator,
} from '../validation.public'
import type { InternalFormApi } from '../FormApi/FormApi.lib'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'
import type { AnyInternalFormGroupApi } from '../FormGroupApi/FormGroupApi.lib'
import type {
  AnyPipelineValidator,
  AnyValidatorContext,
  ValidateResult,
} from './execution.lib'
import type { PipelineResult } from './pipeline.lib'

type MountValidationExecutionResult<in out TResult extends ValidateResult> = {
  result: TResult
  schemaResult: any | null
  hasSchemaResult: boolean
}

interface FormMountValidatorPipelineArgs {
  pipeline: ReadonlyArray<FormValidator<any>>
  formApi: InternalFormApi<any, any, any>
  onResult?: (result: PipelineResult<FormValidateResult<any>>) => void
}

export interface FormMountValidatorPipelineResult {
  didRun: boolean
  asyncPromise: Promise<void> | null
}

interface MountValidatorPipelineArgs<in out TResult extends ValidateResult> {
  pipeline: ReadonlyArray<AnyPipelineValidator>
  cache: PipelineCache<TResult>
  getContext: (signal: AbortSignal) => AnyValidatorContext
  scope: 'field' | 'form'
  onResult?: (result: PipelineResult<TResult>) => void
}

function createEmptyMountValidationResult<
  TResult extends ValidateResult,
>(): MountValidationExecutionResult<TResult> {
  return {
    result: null as TResult,
    schemaResult: null,
    hasSchemaResult: false,
  }
}

function processMountValidationExecutionResult<TResult extends ValidateResult>(
  validatorIndex: number,
  executionResult: MountValidationExecutionResult<TResult>,
  onResult?: (result: PipelineResult<TResult>) => void,
): boolean {
  const result: PipelineResult<TResult> = {
    validatorIndex,
    result: executionResult.result,
    schemaResult: executionResult.schemaResult,
    hasSchemaResult: executionResult.hasSchemaResult,
  }

  onResult?.(result)

  return isErrorResult(executionResult.result)
}

function executeMountValidator<TResult extends ValidateResult>(
  cache: PipelineCache<TResult>,
  getContext: MountValidatorPipelineArgs<TResult>['getContext'],
  scope: 'field' | 'form',
  validator: AnyPipelineValidator,
  validatorIndex: number,
):
  | MountValidationExecutionResult<TResult>
  | PromiseLike<MountValidationExecutionResult<TResult>> {
  const { signal, cleanup } = createValidatorAbortContext(
    cache,
    validatorIndex,
    { cancelDebouncer: true },
  )

  const context = getContext(signal)

  try {
    if (isStandardSchema(validator.run)) {
      return parseStandardSchema(validator.run, context.value, scope)
        .then((result) => {
          if (signal.aborted) {
            return createEmptyMountValidationResult<TResult>()
          }

          return result
        })
        .finally(cleanup) as unknown as PromiseLike<
        MountValidationExecutionResult<TResult>
      >
    }

    const result = validator.run(context)

    if (isPromiseLike(result)) {
      return Promise.resolve(result)
        .then((asyncResult): MountValidationExecutionResult<TResult> => {
          if (signal.aborted) {
            return createEmptyMountValidationResult<TResult>()
          }

          return {
            result: asyncResult as TResult,
            schemaResult: null,
            hasSchemaResult: false,
          }
        })
        .finally(cleanup)
    }

    cleanup()
    return {
      result: result as TResult,
      schemaResult: null,
      hasSchemaResult: false,
    }
  } catch (error) {
    cleanup()
    console.error(error)
    return createEmptyMountValidationResult<TResult>()
  }
}

async function continueMountValidationFromAsyncResult<
  TResult extends ValidateResult,
>(
  pipeline: ReadonlyArray<AnyPipelineValidator>,
  cache: PipelineCache<TResult>,
  getContext: MountValidatorPipelineArgs<TResult>['getContext'],
  scope: 'field' | 'form',
  startIndex: number,
  firstResult: PromiseLike<MountValidationExecutionResult<TResult>>,
  hasFailedBefore: boolean,
  onResult?: (result: PipelineResult<TResult>) => void,
): Promise<void> {
  let hasFailed = hasFailedBefore

  const firstExecutionResult = await firstResult
  if (
    processMountValidationExecutionResult(
      startIndex,
      firstExecutionResult,
      onResult,
    )
  ) {
    hasFailed = true
  }

  for (let i = startIndex + 1; i < pipeline.length; i++) {
    const validator = pipeline[i]!
    if (validator.runOnMount !== true) continue

    if (validator.bailIfInvalid && hasFailed) break

    const result = executeMountValidator<TResult>(
      cache,
      getContext,
      scope,
      validator,
      i,
    )
    const executionResult = isPromiseLike(result) ? await result : result

    if (processMountValidationExecutionResult(i, executionResult, onResult)) {
      hasFailed = true
    }
  }
}

function runMountValidatorPipeline<TResult extends ValidateResult>({
  pipeline,
  cache,
  getContext,
  scope,
  onResult,
}: MountValidatorPipelineArgs<TResult>): FormMountValidatorPipelineResult {
  if (pipeline.length === 0)
    return {
      didRun: false,
      asyncPromise: null,
    }

  if (!pipeline.some((validator) => validator.runOnMount === true))
    return {
      didRun: false,
      asyncPromise: null,
    }

  let hasFailed = false

  for (let i = 0; i < pipeline.length; i++) {
    const validator = pipeline[i]!
    if (validator.runOnMount !== true) continue

    if (validator.bailIfInvalid && hasFailed) {
      return {
        didRun: true,
        asyncPromise: null,
      }
    }

    const result = executeMountValidator<TResult>(
      cache,
      getContext,
      scope,
      validator,
      i,
    )

    if (isPromiseLike(result)) {
      return {
        didRun: true,
        asyncPromise: continueMountValidationFromAsyncResult(
          pipeline,
          cache,
          getContext,
          scope,
          i,
          result,
          hasFailed,
          onResult,
        ),
      }
    }

    if (processMountValidationExecutionResult(i, result, onResult)) {
      hasFailed = true
    }
  }

  return {
    didRun: true,
    asyncPromise: null,
  }
}

export function runFormMountValidatorPipeline({
  pipeline,
  formApi,
  onResult,
}: FormMountValidatorPipelineArgs): FormMountValidatorPipelineResult {
  return runMountValidatorPipeline<FormValidateResult<any>>({
    pipeline,
    cache: formApi._pipelineCache,
    getContext: (signal) => ({
      event: 'mount' as never,
      signal,
      formApi,
      value: formApi.state.values,
      createErrorMap,
      parseIssues: (issues) =>
        parseStandardSchemaIssues(issues, formApi.state.values, 'form'),
    }),
    scope: 'form',
    onResult,
  })
}

interface FieldMountValidatorPipelineArgs {
  pipeline: ReadonlyArray<FieldValidator<any, any, any>>
  fieldApi: AnyInternalFieldApi
  onResult?: (result: PipelineResult<FieldValidateResult>) => void
}

export function runFieldMountValidatorPipeline({
  pipeline,
  fieldApi,
  onResult,
}: FieldMountValidatorPipelineArgs): FormMountValidatorPipelineResult {
  return runMountValidatorPipeline<FieldValidateResult>({
    pipeline,
    cache: fieldApi._getOrCreatePipelineCache(),
    getContext: (signal) => ({
      event: 'mount' as never,
      signal,
      formApi: fieldApi.form as never,
      fieldApi: fieldApi as never,
      value: fieldApi.value,
      parseIssues: parseFieldIssues,
    }),
    scope: 'field',
    onResult,
  })
}

// ===== GROUP MOUNT VALIDATION =====

interface GroupMountValidatorPipelineArgs {
  pipeline: ReadonlyArray<FormGroupValidator<any>>
  groupApi: AnyInternalFormGroupApi
  onResult?: (result: PipelineResult<FormGroupValidateResult<any>>) => void
}

export function runGroupMountValidatorPipeline({
  pipeline,
  groupApi,
  onResult,
}: GroupMountValidatorPipelineArgs): FormMountValidatorPipelineResult {
  return runMountValidatorPipeline<FormGroupValidateResult<any>>({
    pipeline,
    cache: groupApi._pipelineCache,
    getContext: (signal) => ({
      event: 'mount' as never,
      signal,
      formApi: groupApi.form as never,
      groupApi: groupApi as never,
      triggerFieldApi: undefined,
      value: groupApi.value,
      createErrorMap,
      parseIssues: (issues) =>
        parseStandardSchemaIssues(issues, groupApi.value, 'form'),
    }),
    scope: 'form',
    onResult,
  })
}

import { createErrorMap } from '../validation.public'
import {
  isStandardSchema,
  parseStandardSchema,
  parseStandardSchemaIssues,
} from '../standardSchema.lib'
import { isPromiseLike } from '../utils.lib'
import { isErrorResult } from './errors.lib'
import { createValidatorAbortContext, parseFieldIssues } from './execution.lib'
import type { AnyInternalValidatorInstance } from '../ValidatorInstance.lib'
import type { InternalFormApi } from '../FormApi/FormApi.lib'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'
import type { AnyInternalFormGroupApi } from '../FormGroupApi/FormGroupApi.lib'
import type {
  FieldValidateResult,
  FormGroupValidateResult,
  FormValidateResult,
} from '../validation.public'
import type { AnyValidatorContext, ValidateResult } from './execution.lib'
import type { PipelineResult } from './pipeline.lib'

type MountValidationExecutionResult<in out TResult extends ValidateResult> = {
  result: TResult
  schemaResult: any | null
  hasSchemaResult: boolean
}

interface FormMountValidatorPipelineArgs {
  pipeline: ReadonlyArray<AnyInternalValidatorInstance>
  formApi: InternalFormApi<any, any, any>
  onResult?: (result: PipelineResult<FormValidateResult<any>>) => void
}

export interface FormMountValidatorPipelineResult {
  didRun: boolean
  asyncPromise: Promise<void> | null
}

interface MountValidatorPipelineArgs<in out TResult extends ValidateResult> {
  pipeline: ReadonlyArray<AnyInternalValidatorInstance>
  getContext: (signal: AbortSignal) => AnyValidatorContext
  scope: 'field' | 'form'
  onResult?: (result: PipelineResult<TResult>) => void
}

/**
 * Creates the neutral result used when mount validation is aborted or throws.
 */
function createEmptyMountValidationResult<
  TResult extends ValidateResult,
>(): MountValidationExecutionResult<TResult> {
  return {
    result: null as TResult,
    schemaResult: null,
    hasSchemaResult: false,
  }
}

/**
 * Publishes one mount execution result and reports whether it contains errors.
 *
 * Mount schema outputs remain on the immediate result and are not persisted on
 * the validator instance.
 */
function processMountValidationExecutionResult<TResult extends ValidateResult>(
  validatorInstance: AnyInternalValidatorInstance,
  executionResult: MountValidationExecutionResult<TResult>,
  onResult?: (result: PipelineResult<TResult>) => void,
): boolean {
  const result: PipelineResult<TResult> = {
    validatorInstance,
    result: executionResult.result,
    schemaResult: executionResult.schemaResult,
    hasSchemaResult: executionResult.hasSchemaResult,
  }

  onResult?.(result)

  return isErrorResult(executionResult.result)
}

/**
 * Executes one mount validator immediately without trigger debounce.
 *
 * Aborted async results and thrown validators become neutral mount results;
 * thrown errors are logged after execution resources are released.
 */
function executeMountValidator<TResult extends ValidateResult>(
  getContext: MountValidatorPipelineArgs<TResult>['getContext'],
  scope: 'field' | 'form',
  validatorInstance: AnyInternalValidatorInstance,
):
  | MountValidationExecutionResult<TResult>
  | PromiseLike<MountValidationExecutionResult<TResult>> {
  const validator = validatorInstance.definition
  const { signal, cleanup } = createValidatorAbortContext(validatorInstance, {
    cancelDebouncer: true,
  })

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
        .catch((error) => {
          console.error(error)
          return createEmptyMountValidationResult<TResult>()
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
        .catch((error) => {
          console.error(error)
          return createEmptyMountValidationResult<TResult>()
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

/**
 * Continues mount validation sequentially after the first asynchronous result.
 *
 * Later validators still honor `runOnMount` and `bailIfInvalid` in configured
 * order.
 */
async function continueMountValidationFromAsyncResult<
  TResult extends ValidateResult,
>(
  pipeline: ReadonlyArray<AnyInternalValidatorInstance>,
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
      pipeline[startIndex]!,
      firstExecutionResult,
      onResult,
    )
  ) {
    hasFailed = true
  }

  for (let i = startIndex + 1; i < pipeline.length; i++) {
    const validatorInstance = pipeline[i]!
    const validator = validatorInstance.definition
    if (validator.runOnMount !== true) continue

    if (validator.bailIfInvalid && hasFailed) break

    const result = executeMountValidator<TResult>(
      getContext,
      scope,
      validatorInstance,
    )
    const executionResult = isPromiseLike(result) ? await result : result

    if (
      processMountValidationExecutionResult(
        validatorInstance,
        executionResult,
        onResult,
      )
    ) {
      hasFailed = true
    }
  }
}

/**
 * Starts all eligible synchronous mount work and exposes async continuation.
 *
 * The pipeline returns synchronously until it encounters its first promise;
 * remaining eligible validators then continue through `asyncPromise`.
 */
function runMountValidatorPipeline<TResult extends ValidateResult>({
  pipeline,
  getContext,
  scope,
  onResult,
}: MountValidatorPipelineArgs<TResult>): FormMountValidatorPipelineResult {
  if (pipeline.length === 0)
    return {
      didRun: false,
      asyncPromise: null,
    }

  if (
    !pipeline.some(
      (validatorInstance) => validatorInstance.definition.runOnMount === true,
    )
  )
    return {
      didRun: false,
      asyncPromise: null,
    }

  let hasFailed = false

  for (let i = 0; i < pipeline.length; i++) {
    const validatorInstance = pipeline[i]!
    const validator = validatorInstance.definition
    if (validator.runOnMount !== true) continue

    if (validator.bailIfInvalid && hasFailed) {
      return {
        didRun: true,
        asyncPromise: null,
      }
    }

    const result = executeMountValidator<TResult>(
      getContext,
      scope,
      validatorInstance,
    )

    if (isPromiseLike(result)) {
      return {
        didRun: true,
        asyncPromise: continueMountValidationFromAsyncResult(
          pipeline,
          getContext,
          scope,
          i,
          result,
          hasFailed,
          onResult,
        ),
      }
    }

    if (
      processMountValidationExecutionResult(validatorInstance, result, onResult)
    ) {
      hasFailed = true
    }
  }

  return {
    didRun: true,
    asyncPromise: null,
  }
}

/** Runs mount validation with form-scoped values and routed issue parsing. */
export function runFormMountValidatorPipeline({
  pipeline,
  formApi,
  onResult,
}: FormMountValidatorPipelineArgs): FormMountValidatorPipelineResult {
  return runMountValidatorPipeline<FormValidateResult<any>>({
    pipeline,
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
  pipeline: ReadonlyArray<AnyInternalValidatorInstance>
  fieldApi: AnyInternalFieldApi
  onResult?: (result: PipelineResult<FieldValidateResult>) => void
}

/** Runs mount validation with the field's current value and issue parser. */
export function runFieldMountValidatorPipeline({
  pipeline,
  fieldApi,
  onResult,
}: FieldMountValidatorPipelineArgs): FormMountValidatorPipelineResult {
  return runMountValidatorPipeline<FieldValidateResult>({
    pipeline,
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
  pipeline: ReadonlyArray<AnyInternalValidatorInstance>
  groupApi: AnyInternalFormGroupApi
  onResult?: (result: PipelineResult<FormGroupValidateResult<any>>) => void
}

/** Runs mount validation with group-scoped values and routed issue parsing. */
export function runGroupMountValidatorPipeline({
  pipeline,
  groupApi,
  onResult,
}: GroupMountValidatorPipelineArgs): FormMountValidatorPipelineResult {
  return runMountValidatorPipeline<FormGroupValidateResult<any>>({
    pipeline,
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

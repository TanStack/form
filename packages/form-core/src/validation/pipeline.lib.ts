import { createErrorMap } from '../validation.public'
import { parseStandardSchemaIssues } from '../standardSchema.lib'
import { isNotNil } from '../utils.lib'
import { isErrorResult } from './errors.lib'
import {
  ABORTED_CALL,
  THROWN_ERROR,
  executeValidator,
  isFieldValidateContext,
  isServerValidateContext,
  parseFieldIssues,
  runMaybeDebouncedValidator,
  shouldRunValidator,
} from './execution.lib'
import type { AnyInternalValidatorInstance } from '../ValidatorInstance.lib'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'
import type {
  FieldValidateResult,
  FormValidateResult,
} from '../validation.public'
import type {
  AbortedCall,
  AnyValidatorContext,
  FieldInputContext,
  FormInputContext,
  InputContext,
  ThrownError,
  ValidateContext,
  ValidateResult,
  ValidatorExecutionResult,
} from './execution.lib'

export interface PipelineResult<in out T> {
  validatorInstance: AnyInternalValidatorInstance
  result: T
  schemaResult: any | null
  hasSchemaResult?: boolean
}

interface PendingPipelineResult<in out T> {
  validatorInstance: AnyInternalValidatorInstance
  result: T
}

interface ValidatorPipelineArgs<in out TResult extends ValidateResult> {
  context: InputContext
  pipeline: ReadonlyArray<AnyInternalValidatorInstance>
  hasFailedBefore: boolean
  getContext: (inputContext: ValidateContext) => AnyValidatorContext
  scope: 'field' | 'form'
  validatorInstancesToRun?: ReadonlySet<AnyInternalValidatorInstance> | null
  onResult?: (result: PipelineResult<TResult>) => void
}

type PendingPromises<TResult> = Array<
  Promise<
    PendingPipelineResult<
      ValidatorExecutionResult<TResult> | AbortedCall | ThrownError
    >
  >
>

/**
 * Accepts a batch of pending results into the pipeline's instance-keyed map.
 *
 * Aborted and thrown results are excluded. Submit schema output is committed
 * before `onResult` observes the accepted result.
 */
async function flushPendingResults<TResult extends ValidateResult>(
  pending: PendingPromises<TResult>,
  results: Map<AnyInternalValidatorInstance, PipelineResult<TResult>>,
  shouldCommitSchemaOutput: boolean,
  onResult?: (result: PipelineResult<TResult>) => void,
): Promise<{ hasErrors: boolean; thrownError: unknown | null }> {
  let hasErrors = false
  let thrownError: unknown | null = null

  await Promise.all(
    pending.map(async (promise) => {
      const result = await promise

      const executionResult = result.result

      if (executionResult === ABORTED_CALL) {
        return
      }

      // Check if this is a thrown error from a validator
      if (
        isNotNil(executionResult) &&
        typeof executionResult === 'object' &&
        THROWN_ERROR in executionResult
      ) {
        thrownError = executionResult.error
        return
      }

      if (isErrorResult(executionResult.result)) {
        hasErrors = true
      }

      const publicResult: PipelineResult<TResult> = {
        validatorInstance: result.validatorInstance,
        result: executionResult.result,
        schemaResult: executionResult.schemaResult,
        hasSchemaResult: executionResult.hasSchemaResult,
      }

      if (shouldCommitSchemaOutput) {
        result.validatorInstance.setSchemaOutput(executionResult)
      }
      results.set(result.validatorInstance, publicResult)
      onResult?.(publicResult)
    }),
  )

  return { hasErrors, thrownError }
}

/**
 * Runs eligible validator instances while preserving configured result order.
 *
 * Pending validators are flushed before `bailIfInvalid` decisions. Form and
 * group submit pipelines first cancel prior executions and clear prior schema
 * outputs so skipped validators cannot expose stale submit data.
 */
export async function runValidatorPipeline<TResult extends ValidateResult>({
  pipeline,
  context,
  hasFailedBefore = false,
  getContext,
  onResult,
  scope,
  validatorInstancesToRun = null,
}: ValidatorPipelineArgs<TResult>): Promise<{
  results: Array<PipelineResult<TResult>>
  hasErrors: boolean
  thrownError: unknown | null
}> {
  let pending: PendingPromises<TResult> = []
  const results = new Map<
    AnyInternalValidatorInstance,
    PipelineResult<TResult>
  >()
  const shouldCommitSchemaOutput =
    context.event === 'submit' && context.scope !== 'field'

  if (shouldCommitSchemaOutput) {
    pipeline.forEach((validatorInstance) => {
      validatorInstance.cancelExecution()
      validatorInstance.clearSchemaOutput()
    })
  }

  let hasErrors = hasFailedBefore
  let thrownError: unknown | null = null

  const flush = async (): Promise<void> => {
    const { hasErrors: didError, thrownError: flushedThrownError } =
      await flushPendingResults(
        pending,
        results,
        shouldCommitSchemaOutput,
        onResult,
      )

    pending = []
    hasErrors ||= didError
    if (flushedThrownError !== null) {
      thrownError = flushedThrownError
    }
  }

  for (const validatorInstance of pipeline) {
    const validator = validatorInstance.definition

    if (
      validatorInstancesToRun &&
      !validatorInstancesToRun.has(validatorInstance)
    ) {
      continue
    }

    if (!shouldRunValidator(validator, context)) {
      continue
    }

    if (validator.bailIfInvalid) {
      await flush()

      if (hasErrors || thrownError !== null) {
        break
      }
    }

    const promise = runMaybeDebouncedValidator<TResult>({
      validatorInstance,
      context,
      onExecute: (ctx) => {
        return executeValidator<TResult>(validator, getContext(ctx), scope)
      },
    }).then<
      PendingPipelineResult<
        ValidatorExecutionResult<TResult> | AbortedCall | ThrownError
      >
    >((result) => ({
      validatorInstance,
      result,
    }))

    pending.push(promise)
  }

  await flush()

  return {
    results: pipeline.flatMap((validatorInstance) => {
      const result = results.get(validatorInstance)
      return result ? [result] : []
    }),
    hasErrors,
    thrownError,
  }
}

interface FormValidatorPipelineArgs {
  pipeline: ReadonlyArray<AnyInternalValidatorInstance>
  context: FormInputContext
  /**
   * @private
   * Whether previous pipelines have reported an error or not.
   */
  hasFailedBefore: boolean
  onResult?: (result: PipelineResult<FormValidateResult<any>>) => void
}

export interface FormValidatorPipelineResult {
  results: Array<PipelineResult<FormValidateResult<any>>>
  hasErrors: boolean
  thrownError: unknown | null
}

/** Runs the shared pipeline with form-scoped values and issue parsing. */
export function runFormValidatorPipeline({
  pipeline,
  context,
  onResult,
  hasFailedBefore,
}: FormValidatorPipelineArgs): Promise<FormValidatorPipelineResult> {
  return runValidatorPipeline<FormValidateResult<any>>({
    pipeline,
    context,
    onResult,
    hasFailedBefore,
    getContext: (ctx) => {
      if (isServerValidateContext(ctx)) {
        throw new Error('Server validation cannot run through client pipeline')
      }

      const formValidationContext = {
        event: ctx.event,
        formApi: ctx.formApi,
        signal: ctx.signal,
        value: ctx.formApi.state.values,
        createErrorMap,
        parseIssues: (
          issues: Parameters<typeof parseStandardSchemaIssues>[0],
        ) =>
          parseStandardSchemaIssues(issues, ctx.formApi.state.values, 'form'),
      }

      if (!isFieldValidateContext(ctx)) {
        return {
          ...formValidationContext,
          triggerFieldApi: ctx.triggerFieldApi,
        }
      }

      return {
        ...formValidationContext,
        fieldApi: ctx.fieldApi,
      }
    },
    scope: 'form',
  })
}

interface FieldValidatorPipelineArgs {
  pipeline: ReadonlyArray<AnyInternalValidatorInstance>
  context: FieldInputContext
  onResult?: (result: PipelineResult<FieldValidateResult>) => void
  /**
   * @private
   * When an incoming watched field notifies, we should only run validators
   * that are actually interested in it.
   */
  validatorInstancesToRun?: ReadonlySet<AnyInternalValidatorInstance> | null
}

export interface FieldValidatorPipelineResult {
  results: Array<PipelineResult<FieldValidateResult>>
  hasErrors: boolean
  thrownError: unknown | null
}

/**
 * Runs the shared pipeline with field-scoped values and issue parsing.
 *
 * Killed fields resolve to an empty result without executing validators.
 */
export function runFieldValidatorPipeline({
  pipeline,
  context,
  onResult,
  validatorInstancesToRun = null,
}: FieldValidatorPipelineArgs): Promise<FieldValidatorPipelineResult> {
  const fieldApi = context.fieldApi as AnyInternalFieldApi

  if (fieldApi._isKilled)
    return Promise.resolve({
      results: [],
      hasErrors: false,
      thrownError: null,
    })

  return runValidatorPipeline<FieldValidateResult>({
    pipeline,
    context,
    onResult,
    // No use case for configuring this outside of field pipeline yet
    hasFailedBefore: false,
    getContext: (ctx) => {
      if (isServerValidateContext(ctx)) {
        throw new Error('Server validation cannot run through field pipeline')
      }

      return {
        event: context.event,
        formApi: context.formApi,
        signal: ctx.signal,
        fieldApi: context.fieldApi,
        value: context.fieldApi.value,
        parseIssues: parseFieldIssues,
      }
    },
    scope: 'field',
    validatorInstancesToRun,
  })
}

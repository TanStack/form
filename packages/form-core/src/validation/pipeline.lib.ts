import { createOutput } from '../validationOutput.lib'
import { createErrorMap } from '../validation.public'
import { parseStandardSchemaIssues } from '../standardSchema.lib'
import { isNotNil, isPromiseLike } from '../utils.lib'
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
  ValidatorRunResult,
} from './execution.lib'

export interface PipelineResult<in out T> {
  validatorInstance: AnyInternalValidatorInstance
  result: T
  output: any | null
  hasOutput?: boolean
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

interface AcceptedResults<in out TResult extends ValidateResult> {
  results: Map<AnyInternalValidatorInstance, PipelineResult<TResult>>
  shouldCommitOutput: boolean
  onResult?: (result: PipelineResult<TResult>) => void
}

/**
 * Accepts one settled result into the pipeline's instance-keyed map.
 *
 * Aborted results are dropped and thrown results are reported. Submit output
 * is committed before `onResult` observes the accepted result.
 */
function acceptResult<TResult extends ValidateResult>(
  validatorInstance: AnyInternalValidatorInstance,
  executionResult: ValidatorRunResult<TResult>,
  { results, shouldCommitOutput, onResult }: AcceptedResults<TResult>,
): { hasErrors: boolean; thrownError: unknown | null } {
  if (executionResult === ABORTED_CALL) {
    return { hasErrors: false, thrownError: null }
  }

  if (
    isNotNil(executionResult) &&
    typeof executionResult === 'object' &&
    THROWN_ERROR in executionResult
  ) {
    return { hasErrors: false, thrownError: executionResult.error }
  }

  const publicResult: PipelineResult<TResult> = {
    validatorInstance,
    result: executionResult.result,
    output: executionResult.output,
    hasOutput: executionResult.hasOutput,
  }

  if (shouldCommitOutput) {
    validatorInstance.setOutput(executionResult)
  }
  results.set(validatorInstance, publicResult)
  onResult?.(publicResult)

  return { hasErrors: isErrorResult(executionResult.result), thrownError: null }
}

/**
 * Accepts a batch of pending results as each one settles.
 */
async function flushPendingResults<TResult extends ValidateResult>(
  pending: PendingPromises<TResult>,
  accepted: AcceptedResults<TResult>,
): Promise<{ hasErrors: boolean; thrownError: unknown | null }> {
  let hasErrors = false
  let thrownError: unknown | null = null

  await Promise.all(
    pending.map(async (promise) => {
      const { validatorInstance, result } = await promise
      const outcome = acceptResult(validatorInstance, result, accepted)
      hasErrors ||= outcome.hasErrors
      if (outcome.thrownError !== null) {
        thrownError = outcome.thrownError
      }
    }),
  )

  return { hasErrors, thrownError }
}

export interface ValidatorPipelineResult<in out TResult> {
  results: Array<PipelineResult<TResult>>
  hasErrors: boolean
  thrownError: unknown | null
}

/**
 * Runs eligible validator instances while preserving configured result order.
 *
 * Validators that return synchronously are applied immediately, so a pipeline
 * made only of synchronous, undebounced validators settles synchronously and
 * its results land in the same update as the event that triggered it. The
 * pipeline becomes asynchronous only once a validator returns a promise or is
 * debounced. Pending validators are flushed before `bailIfInvalid` decisions.
 * Form and group submit pipelines first cancel prior executions and clear
 * prior schema outputs so skipped validators cannot expose stale submit data.
 */
export function runValidatorPipelineMaybeSync<TResult extends ValidateResult>({
  pipeline,
  context,
  hasFailedBefore = false,
  getContext,
  onResult,
  scope,
  validatorInstancesToRun = null,
}: ValidatorPipelineArgs<TResult>):
  ValidatorPipelineResult<TResult> | Promise<ValidatorPipelineResult<TResult>> {
  let pending: PendingPromises<TResult> = []
  const results = new Map<
    AnyInternalValidatorInstance,
    PipelineResult<TResult>
  >()
  const shouldCommitOutput =
    context.event === 'submit' && context.scope !== 'field'
  const accepted: AcceptedResults<TResult> = {
    results,
    shouldCommitOutput,
    onResult,
  }

  if (shouldCommitOutput) {
    pipeline.forEach((validatorInstance) => {
      validatorInstance.cancelExecution()
      validatorInstance.clearOutput()
    })
  }

  let hasErrors = hasFailedBefore
  let thrownError: unknown | null = null

  const record = (outcome: {
    hasErrors: boolean
    thrownError: unknown | null
  }) => {
    hasErrors ||= outcome.hasErrors
    if (outcome.thrownError !== null) {
      thrownError = outcome.thrownError
    }
  }

  const flush = async (): Promise<void> => {
    const flushing = pending
    pending = []
    record(await flushPendingResults(flushing, accepted))
  }

  const finish = (): ValidatorPipelineResult<TResult> => ({
    results: pipeline.flatMap((validatorInstance) => {
      const result = results.get(validatorInstance)
      return result ? [result] : []
    }),
    hasErrors,
    thrownError,
  })

  const runFrom = (
    start: number,
  ):
    | ValidatorPipelineResult<TResult>
    | Promise<ValidatorPipelineResult<TResult>> => {
    for (let index = start; index < pipeline.length; index++) {
      const validatorInstance = pipeline[index]!
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
        if (pending.length > 0) {
          return flush().then(() => runFrom(index))
        }

        if (hasErrors || thrownError !== null) {
          break
        }
      }

      const outcome = runMaybeDebouncedValidator<TResult>({
        validatorInstance,
        context,
        onExecute: (ctx) => {
          return executeValidator<TResult>(validator, getContext(ctx), scope)
        },
      })

      if (isPromiseLike(outcome)) {
        pending.push(
          Promise.resolve(outcome).then((result) => ({
            validatorInstance,
            result,
          })),
        )
      } else {
        record(acceptResult(validatorInstance, outcome, accepted))
      }
    }

    if (pending.length > 0) {
      return flush().then(finish)
    }

    return finish()
  }

  return runFrom(0)
}

/**
 * Settles a maybe-sync run through a promise, so a synchronous throw becomes a
 * rejection as it would from an async function.
 */
function settleAsPromise<T>(run: () => T | Promise<T>): Promise<T> {
  try {
    return Promise.resolve(run())
  } catch (error) {
    return Promise.reject(error)
  }
}

/** Runs the shared pipeline and always settles through a promise. */
export function runValidatorPipeline<TResult extends ValidateResult>(
  args: ValidatorPipelineArgs<TResult>,
): Promise<ValidatorPipelineResult<TResult>> {
  return settleAsPromise(() => runValidatorPipelineMaybeSync(args))
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

/**
 * Runs the shared pipeline with form-scoped values and issue parsing.
 *
 * Settles synchronously when every validator that runs is synchronous.
 */
export function runFormValidatorPipelineMaybeSync({
  pipeline,
  context,
  onResult,
  hasFailedBefore,
}: FormValidatorPipelineArgs):
  FormValidatorPipelineResult | Promise<FormValidatorPipelineResult> {
  return runValidatorPipelineMaybeSync<FormValidateResult<any>>({
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
        createOutput,
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

/** Runs the form pipeline and always settles through a promise. */
export function runFormValidatorPipeline(
  args: FormValidatorPipelineArgs,
): Promise<FormValidatorPipelineResult> {
  return settleAsPromise(() => runFormValidatorPipelineMaybeSync(args))
}

/**
 * Runs the shared pipeline with field-scoped values and issue parsing.
 *
 * Settles synchronously when every validator that runs is synchronous.
 * Killed fields resolve to an empty result without executing validators.
 */
export function runFieldValidatorPipelineMaybeSync({
  pipeline,
  context,
  onResult,
  validatorInstancesToRun = null,
}: FieldValidatorPipelineArgs):
  FieldValidatorPipelineResult | Promise<FieldValidatorPipelineResult> {
  const fieldApi = context.fieldApi as AnyInternalFieldApi

  if (fieldApi._isKilled)
    return {
      results: [],
      hasErrors: false,
      thrownError: null,
    }

  return runValidatorPipelineMaybeSync<FieldValidateResult>({
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

/** Runs the field pipeline and always settles through a promise. */
export function runFieldValidatorPipeline(
  args: FieldValidatorPipelineArgs,
): Promise<FieldValidatorPipelineResult> {
  return settleAsPromise(() => runFieldValidatorPipelineMaybeSync(args))
}

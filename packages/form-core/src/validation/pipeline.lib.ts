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
import type { PipelineCache } from '../utils.lib'
import type {
  FieldValidateResult,
  FieldValidator,
  FormValidateResult,
  FormValidator,
} from '../validation.public'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'
import type {
  AbortedCall,
  AnyPipelineValidator,
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
  validatorIndex: number
  result: T
  schemaResult: any | null
  hasSchemaResult?: boolean
}

interface PendingPipelineResult<in out T> {
  validatorIndex: number
  result: T
}

interface ValidatorPipelineArgs<in out TResult extends ValidateResult> {
  context: InputContext
  cache: PipelineCache<TResult>
  pipeline: ReadonlyArray<AnyPipelineValidator>
  hasFailedBefore: boolean
  getContext: (inputContext: ValidateContext) => AnyValidatorContext
  scope: 'field' | 'form'
  validatorIndecesToRun?: Array<number> | null
  onResult?: (result: PipelineResult<TResult>) => void
}

type PendingPromises<TResult> = Array<
  Promise<
    PendingPipelineResult<
      ValidatorExecutionResult<TResult> | AbortedCall | ThrownError
    >
  >
>

async function flushPendingResults<TResult extends ValidateResult>(
  pending: PendingPromises<TResult>,
  results: Array<PipelineResult<TResult>>,
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
        validatorIndex: result.validatorIndex,
        result: executionResult.result,
        schemaResult: executionResult.schemaResult,
        hasSchemaResult: executionResult.hasSchemaResult,
      }

      results[result.validatorIndex] = publicResult
      onResult?.(publicResult)
    }),
  )

  return { hasErrors, thrownError }
}

export async function runValidatorPipeline<TResult extends ValidateResult>({
  pipeline,
  context,
  cache,
  hasFailedBefore = false,
  getContext,
  onResult,
  scope,
  validatorIndecesToRun = null,
}: ValidatorPipelineArgs<TResult>): Promise<{
  results: Array<PipelineResult<TResult>>
  hasErrors: boolean
  thrownError: unknown | null
}> {
  let pending: PendingPromises<TResult> = []
  const results: Array<PipelineResult<TResult>> = []

  let hasErrors = hasFailedBefore
  let thrownError: unknown | null = null

  const flush = async (): Promise<void> => {
    const { hasErrors: didError, thrownError: flushedThrownError } =
      await flushPendingResults(pending, results, onResult)

    pending = []
    hasErrors ||= didError
    if (flushedThrownError !== null) {
      thrownError = flushedThrownError
    }
  }

  for (let i = 0; i < pipeline.length; i++) {
    const validator = pipeline[i]!

    if (validatorIndecesToRun && !validatorIndecesToRun.includes(i)) {
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
      validator,
      context,
      validatorIndex: i,
      cache,
      onExecute: (ctx) => {
        return executeValidator<TResult>(validator, getContext(ctx), scope)
      },
    }).then<
      PendingPipelineResult<
        ValidatorExecutionResult<TResult> | AbortedCall | ThrownError
      >
    >((result) => ({
      validatorIndex: i,
      result,
    }))

    pending.push(promise)
  }

  await flush()

  return {
    // Shouldn't happen, but in case we have sparse arrays
    results: results.filter(Boolean),
    hasErrors,
    thrownError,
  }
}

interface FormValidatorPipelineArgs {
  pipeline: ReadonlyArray<FormValidator<any>>
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

export function runFormValidatorPipeline({
  pipeline,
  context,
  onResult,
  hasFailedBefore,
}: FormValidatorPipelineArgs): Promise<FormValidatorPipelineResult> {
  const cache = context.formApi._pipelineCache

  return runValidatorPipeline<FormValidateResult<any>>({
    pipeline,
    context,
    onResult,
    cache,
    hasFailedBefore,
    getContext: (ctx) => {
      if (isServerValidateContext(ctx)) {
        throw new Error('Server validation cannot run through client pipeline')
      }

      if (!isFieldValidateContext(ctx)) {
        return {
          event: ctx.event,
          triggerFieldApi: ctx.triggerFieldApi,
          formApi: ctx.formApi,
          signal: ctx.signal,
          value: ctx.formApi.state.values,
          createErrorMap,
          parseIssues: (issues) =>
            parseStandardSchemaIssues(issues, ctx.formApi.state.values, 'form'),
        }
      }
      return {
        event: ctx.event,
        fieldApi: ctx.fieldApi,
        formApi: ctx.formApi,
        signal: ctx.signal,
        value: ctx.formApi.state.values,
        createErrorMap,
        parseIssues: (issues) =>
          parseStandardSchemaIssues(issues, ctx.formApi.state.values, 'form'),
      }
    },
    scope: 'form',
  })
}

interface FieldValidatorPipelineArgs {
  pipeline: Array<FieldValidator<any, any, any>>
  context: FieldInputContext
  onResult?: (result: PipelineResult<FieldValidateResult>) => void
  /**
   * @private
   * When an incoming watched field notifies, we should only run validators
   * that are actually interested in it.
   */
  validatorIndecesToRun?: Array<number> | null
}

export interface FieldValidatorPipelineResult {
  results: Array<PipelineResult<FieldValidateResult>>
  hasErrors: boolean
  thrownError: unknown | null
}

export function runFieldValidatorPipeline({
  pipeline,
  context,
  onResult,
  validatorIndecesToRun = null,
}: FieldValidatorPipelineArgs): Promise<FieldValidatorPipelineResult> {
  const fieldApi = context.fieldApi as AnyInternalFieldApi

  if (fieldApi._isKilled)
    return Promise.resolve({
      results: [],
      hasErrors: false,
      thrownError: null,
    })

  const cache = fieldApi._getOrCreatePipelineCache()

  return runValidatorPipeline<FieldValidateResult>({
    pipeline,
    context,
    onResult,
    cache,
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
    validatorIndecesToRun,
  })
}

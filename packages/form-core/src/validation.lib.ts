import { LiteDebouncer } from '@tanstack/pacer-lite'
import { isStandardSchema, parseStandardSchema } from './standardSchema.lib'
import { isNil, isNotNil, normalizeToArray } from './utils'
import type {
  ErrorWithMessage,
  FieldValidateResult,
  FieldValidator,
  FieldValidatorContext,
  FormValidateResult,
  FormValidator,
  FormValidatorContext,
  ValidationDebounceFn,
  ValidationErrorInput,
  ValidationPredicateFn,
  ValidationTriggerOption,
  Validator,
} from './validation.public'
import type { InternalFormApi } from './FormApi.lib'
import type { AnyInternalFieldApi } from './FieldApi.lib'

type FormValidateContext = Omit<FormValidatorContext<any>, 'value'>
type FieldValidateContext = Omit<FieldValidatorContext<any, any>, 'value'>
type FormInputContext = Omit<FormValidateContext, 'signal'>
type FieldInputContext = Omit<FieldValidateContext, 'signal'>

type InputContext = FormInputContext | FieldInputContext
export type ValidateContext = FormValidateContext | FieldValidateContext
type ValidateResult = FormValidateResult | FieldValidateResult

function isFormContext(ctx: InputContext): ctx is FormInputContext {
  return 'triggerFieldApi' in ctx
}

function getContextValue(context: InputContext) {
  return isFormContext(context)
    ? context.formApi.state.values
    : context.fieldApi.value
}

const ABORTED_CALL = Symbol('ABORTED_CALL')
const THROWN_ERROR = Symbol('THROWN_ERROR')

type AbortedCall = typeof ABORTED_CALL
type ThrownError = { [THROWN_ERROR]: true; error: unknown }

/**
 * @private
 * Check if a validation result is considered an error.
 */
export function isErrorResult<
  T extends FormValidateResult | FieldValidateResult,
>(value: T): value is Exclude<T, null | undefined | false> {
  if (isNil(value) || value === false) return false
  return true
}

export function normalizeValidationError(
  value: ValidationErrorInput | null | undefined,
): Array<ErrorWithMessage> {
  return normalizeToArray(value).map((error) =>
    typeof error === 'string' ? { message: error } : error,
  )
}

/**
 * Check if a validation result is a ValidationAggregateError.
 * If it is, return an object with formError and fieldErrors.
 * Otherwise, return null.
 */
export function isAggregateError(value: FormValidateResult): {
  formError: ValidationErrorInput | null
  fieldErrors: Record<string, ValidationErrorInput>
} | null {
  if (!isErrorResult(value)) return null

  const aggregateError = value

  // A ValidationAggregateError must be an object with at least one of form or fields
  if (typeof aggregateError === 'object' && !Array.isArray(aggregateError)) {
    if ('fields' in aggregateError) {
      return {
        formError: aggregateError.form ?? null,
        fieldErrors: aggregateError.fields,
      }
    }
  }

  return null
}

export interface PipelineResult<T> {
  validatorIndex: number
  result: T
  schemaResult: any | null
}

interface ValidatorExecutionResult<TResult> {
  result: TResult
  schemaResult: any | null
}

interface PendingDebouncedCall<TResult extends ValidateResult> {
  context: ValidateContext
  resolve: (
    value: ValidatorExecutionResult<TResult> | AbortedCall | ThrownError,
  ) => void
  reject: (error: unknown) => void
}

type ValidationDebouncer<TResult extends ValidateResult> = LiteDebouncer<
  (call: PendingDebouncedCall<TResult>) => void
>

interface PendingPipelineResult<T> {
  validatorIndex: number
  result: T
}

export interface ValidatorPipelineCache<TResult extends ValidateResult> {
  listenersDebouncers: Map<number, ValidationDebouncer<TResult>>
  validatorDebouncers: Map<number, ValidationDebouncer<TResult>>
  validatorAbortControllers: Map<number, AbortController>
}

export function createValidatorPipelineCache(): ValidatorPipelineCache<any> {
  return {
    listenersDebouncers: new Map(),
    validatorDebouncers: new Map(),
    validatorAbortControllers: new Map(),
  }
}

function getEnabledState(
  booleanOrFn: boolean | ValidationPredicateFn<any>,
  context: InputContext,
): boolean {
  if (typeof booleanOrFn === 'boolean') return booleanOrFn

  return booleanOrFn({
    triggerFieldApi: isFormContext(context)
      ? context.triggerFieldApi
      : context.fieldApi,
    formApi: context.formApi,
    value: getContextValue(context),
  })
}

function getDebounceMs(
  numberOrFn: number | ValidationDebounceFn<any>,
  context: InputContext,
): number {
  if (typeof numberOrFn === 'number') return numberOrFn

  return numberOrFn({
    triggerFieldApi: isFormContext(context)
      ? context.triggerFieldApi
      : context.fieldApi,
    formApi: context.formApi,
    value: getContextValue(context),
  })
}

function isValidationSignalEnabled(
  signal: ValidationTriggerOption<any>,
  context: InputContext,
): boolean {
  if (typeof signal === 'string') {
    return signal === context.event
  }

  if (signal.trigger !== context.event) {
    return false
  }

  const { when: enabled = true } = signal

  return getEnabledState(enabled, context)
}

function shouldRunValidator(
  validator: Validator<any, any, any>,
  context: InputContext,
): boolean {
  const { runOnSubmit = true } = validator

  if (context.event === 'submit') {
    return getEnabledState(runOnSubmit, context)
  }

  return (validator.triggers ?? []).some((signal) =>
    isValidationSignalEnabled(signal, context),
  )
}

async function executeValidator<TResult extends ValidateResult>(
  validator: Validator<any, any, any>,
  context: FormValidatorContext<any> | FieldValidatorContext<any, any>,
  scope: 'field' | 'form',
): Promise<ValidatorExecutionResult<TResult>> {
  if (isStandardSchema(validator.run)) {
    return parseStandardSchema(validator.run, context.value, scope) as never
  }

  return {
    result: await validator.run(context),
    schemaResult: null,
  }
}

interface ValidatorPipelineArgs<TResult extends ValidateResult> {
  context: InputContext
  cache: ValidatorPipelineCache<TResult>
  pipeline: ReadonlyArray<FormValidator<any> | FieldValidator<any, any>>
  hasFailedBefore: boolean
  getContext: (
    inputContext: ValidateContext,
  ) => FieldValidatorContext<any, any> | FormValidatorContext<any>
  scope: 'field' | 'form'
  onResult?: (result: PipelineResult<TResult>) => void
}

interface RunMaybeDebouncedValidatorArgs<TResult extends ValidateResult> {
  validator: Validator<any, any, any>
  context: InputContext
  validatorIndex: number
  cache: ValidatorPipelineCache<TResult>
  onExecute: (
    inputContext: ValidateContext,
  ) => Promise<ValidatorExecutionResult<TResult>>
}

function clearAbortController<TResult extends ValidateResult>(
  cache: ValidatorPipelineCache<TResult>,
  cacheKey: number,
  abortController: AbortController,
): void {
  if (cache.validatorAbortControllers.get(cacheKey) === abortController) {
    cache.validatorAbortControllers.delete(cacheKey)
  }
}

function createAbortPromise(signal: AbortSignal): {
  promise: Promise<AbortedCall>
  cleanup: () => void
} {
  let onAbort = () => {}

  const promise = new Promise<AbortedCall>((resolve) => {
    if (signal.aborted) {
      resolve(ABORTED_CALL)
      return
    }

    onAbort = () => {
      signal.removeEventListener('abort', onAbort)
      resolve(ABORTED_CALL)
    }

    signal.addEventListener('abort', onAbort)
  })

  return {
    promise,
    cleanup: () => {
      signal.removeEventListener('abort', onAbort)
    },
  }
}

async function executeWithAbort<TResult extends ValidateResult>(
  context: ValidateContext,
  onExecute: (
    inputContext: ValidateContext,
  ) => Promise<ValidatorExecutionResult<TResult>>,
): Promise<ValidatorExecutionResult<TResult> | AbortedCall> {
  if (context.signal.aborted) {
    return ABORTED_CALL
  }

  const { promise: abortPromise, cleanup } = createAbortPromise(context.signal)

  try {
    return await Promise.race([
      Promise.resolve(onExecute(context)),
      abortPromise,
    ])
  } finally {
    cleanup()
  }
}

function getValidatorDebounceMs(
  validator: Validator<any, any, any>,
  context: InputContext,
): number {
  if (context.event === 'submit') return 0

  const { triggerDebounceMs = 0 } = validator

  return getDebounceMs(triggerDebounceMs, context)
}

function abortPreviousValidatorRun<TResult extends ValidateResult>(
  cache: ValidatorPipelineCache<TResult>,
  cacheKey: number,
): void {
  // AbortControllers are scoped to the validator instead of the whole pipeline.
  // Mostly because different validators can have different debounces and they
  // can be triggered by unrelated validation signals
  cache.validatorAbortControllers.get(cacheKey)?.abort()
}

function getOrCreateDebouncer<TResult extends ValidateResult>(
  cache: ValidatorPipelineCache<TResult>,
  cacheKey: number,
  fn: (call: PendingDebouncedCall<TResult>) => void,
  wait: number,
): ValidationDebouncer<TResult> {
  let debouncer = cache.validatorDebouncers.get(cacheKey)

  if (!debouncer) {
    debouncer = new LiteDebouncer(fn, {
      wait,
    })

    cache.validatorDebouncers.set(cacheKey, debouncer)
  } else {
    debouncer.fn = fn
    debouncer.options.wait = wait
  }

  return debouncer
}

function runMaybeDebouncedValidator<TResult extends ValidateResult>({
  validator,
  context,
  validatorIndex,
  cache,
  onExecute,
}: RunMaybeDebouncedValidatorArgs<TResult>): Promise<
  ValidatorExecutionResult<TResult> | AbortedCall | ThrownError
> {
  const cacheKey = validatorIndex
  const debounceMs = getValidatorDebounceMs(validator, context)

  abortPreviousValidatorRun(cache, cacheKey)

  const abortController = new AbortController()
  const signal = abortController.signal

  cache.validatorAbortControllers.set(cacheKey, abortController)

  const validationContext: ValidateContext = {
    ...context,
    signal,
  }

  const clearCurrentController = () => {
    clearAbortController(cache, cacheKey, abortController)
  }

  return new Promise<
    ValidatorExecutionResult<TResult> | AbortedCall | ThrownError
  >((resolve) => {
    let settled = false

    const settle = (
      value: ValidatorExecutionResult<TResult> | AbortedCall | ThrownError,
    ) => {
      if (settled) return

      settled = true
      cleanupAbortListener()
      clearCurrentController()
      resolve(value)
    }

    const fail = (error: unknown) => {
      if (settled) return

      console.error('Validator threw an error:', error)
      settle({ [THROWN_ERROR]: true, error })
    }

    const onAbort = () => {
      cache.validatorDebouncers.get(cacheKey)?.cancel()
      settle(ABORTED_CALL)
    }

    const cleanupAbortListener = () => {
      signal.removeEventListener('abort', onAbort)
    }

    signal.addEventListener('abort', onAbort, { once: true })

    const run = (ctx: ValidateContext) => {
      executeWithAbort(ctx, onExecute).then(settle, fail)
    }

    if (debounceMs <= 0) {
      cache.validatorDebouncers.get(cacheKey)?.cancel()
      run(validationContext)
      return
    }

    const debouncer = getOrCreateDebouncer(
      cache,
      cacheKey,
      (call) => {
        executeWithAbort(call.context, onExecute).then(
          call.resolve,
          (error) => {
            console.error('Validator threw an error:', error)
            const thrownError: ThrownError = { [THROWN_ERROR]: true, error }
            call.resolve(thrownError)
          },
        )
      },
      debounceMs,
    )

    debouncer.maybeExecute({
      context: validationContext,
      resolve: settle,
      reject: () => {
        // This should not be called anymore since we handle errors in the debouncer callback
      },
    })
  })
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
      }

      results[result.validatorIndex] = publicResult
      onResult?.(publicResult)
    }),
  )

  return { hasErrors, thrownError }
}

async function runValidatorPipeline<TResult extends ValidateResult>({
  pipeline,
  context,
  cache,
  hasFailedBefore = false,
  getContext,
  onResult,
  scope,
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
  onResult?: (result: PipelineResult<FormValidateResult>) => void
}

export interface FormValidatorPipelineResult {
  results: Array<PipelineResult<FormValidateResult>>
  hasErrors: boolean
  thrownError: unknown | null
}

export function runFormValidatorPipeline({
  pipeline,
  context,
  onResult,
  hasFailedBefore,
}: FormValidatorPipelineArgs): Promise<FormValidatorPipelineResult> {
  const cache = (context.formApi as InternalFormApi<any, any>)
    ._validatorPipelineCache

  return runValidatorPipeline<FormValidateResult>({
    pipeline,
    context,
    onResult,
    cache,
    hasFailedBefore,
    getContext: (ctx) => {
      if (isFormContext(ctx)) {
        return {
          event: ctx.event,
          triggerFieldApi: ctx.triggerFieldApi,
          formApi: ctx.formApi,
          signal: ctx.signal,
          value: ctx.formApi.state.values,
        }
      }
      return {
        event: ctx.event,
        fieldApi: ctx.fieldApi,
        formApi: ctx.formApi,
        signal: ctx.signal,
        value: ctx.formApi.state.values,
      }
    },
    scope: 'form',
  })
}

interface FieldValidatorPipelineArgs {
  pipeline: Array<FieldValidator<any, any>>
  context: FieldInputContext
  onResult?: (result: PipelineResult<FieldValidateResult>) => void
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
}: FieldValidatorPipelineArgs): Promise<FieldValidatorPipelineResult> {
  const cache = (
    context.fieldApi as AnyInternalFieldApi
  )._getOrCreateValidatorCache()

  return runValidatorPipeline<FieldValidateResult>({
    pipeline,
    context,
    onResult,
    cache,
    // No use case for configuring this outside of field pipeline yet
    hasFailedBefore: false,
    getContext: (ctx) => ({
      event: ctx.event,
      formApi: ctx.formApi,
      signal: ctx.signal,
      fieldApi: context.fieldApi,
      value: context.fieldApi.value,
    }),
    scope: 'field',
  })
}

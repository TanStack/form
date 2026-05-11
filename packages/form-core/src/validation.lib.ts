import { LiteDebouncer } from '@tanstack/pacer-lite'
import { isStandardSchema, parseStandardSchema } from './standardSchema.lib'
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
import { normalizeToArray } from './utils'
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

type AbortedCall = typeof ABORTED_CALL

/**
 * @private
 * Check if a validation result is considered an error.
 */
export function isErrorResult<T extends FormValidateResult | FieldValidateResult>(
  value: T,
): value is Exclude<T, null | undefined | false> {
  if (value === null || value === undefined || value === false) return false
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
  if (
    typeof aggregateError === 'object' &&
    aggregateError !== null &&
    !Array.isArray(aggregateError)
  ) {
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
}

interface PendingDebouncedCall<TResult> {
  context: ValidateContext
  resolve: (value: TResult | AbortedCall) => void
  reject: (error: unknown) => void
}

type ValidationDebouncer<TResult> = LiteDebouncer<
  (call: PendingDebouncedCall<TResult>) => void
>

export interface ValidatorPipelineCache<TResult> {
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

function executeValidator<TResult extends ValidateResult>(
  validator: Validator<any, any, any>,
  context: FormValidatorContext<any> | FieldValidatorContext<any, any>,
  scope: 'field' | 'form',
): TResult | Promise<TResult> {
  if (isStandardSchema(validator.run)) {
    return parseStandardSchema(validator.run, context.value, scope) as never
  }

  return validator.run(context) as never
}

interface ValidatorPipelineArgs<TResult extends ValidateResult> {
  context: InputContext
  cache: ValidatorPipelineCache<TResult>
  pipeline: Array<FormValidator<any> | FieldValidator<any, any>>
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
  onExecute: (inputContext: ValidateContext) => Promise<TResult> | TResult
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
  onExecute: (inputContext: ValidateContext) => Promise<TResult> | TResult,
): Promise<TResult | AbortedCall> {
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
}: RunMaybeDebouncedValidatorArgs<TResult>): Promise<TResult | AbortedCall> {
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

  return new Promise<TResult | AbortedCall>((resolve, reject) => {
    let settled = false

    const settle = (value: TResult | AbortedCall) => {
      if (settled) return

      settled = true
      cleanupAbortListener()
      clearCurrentController()
      resolve(value)
    }

    const fail = (error: unknown) => {
      if (settled) return

      settled = true
      cleanupAbortListener()
      clearCurrentController()
      reject(error)
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
          call.reject,
        )
      },
      debounceMs,
    )

    debouncer.maybeExecute({
      context: validationContext,
      resolve: settle,
      reject: fail,
    })
  })
}

async function flushPendingResults<TResult extends ValidateResult>(
  pending: Array<Promise<PipelineResult<TResult | AbortedCall>>>,
  results: Array<PipelineResult<TResult>>,
  onResult?: (result: PipelineResult<TResult>) => void,
): Promise<boolean> {
  let hasErrors = false

  await Promise.all(
    pending.map(async (promise) => {
      const result = await promise

      if (result.result === ABORTED_CALL) {
        return
      }

      if (isErrorResult(result.result)) {
        hasErrors = true
      }

      const publicResult: PipelineResult<TResult> = {
        validatorIndex: result.validatorIndex,
        result: result.result,
      }

      results[result.validatorIndex] = publicResult
      onResult?.(publicResult)
    }),
  )

  return hasErrors
}

async function runValidatorPipeline<TResult extends ValidateResult>({
  pipeline,
  context,
  cache,
  getContext,
  onResult,
  scope,
}: ValidatorPipelineArgs<TResult>): Promise<Array<PipelineResult<TResult>>> {
  let pending: Array<Promise<PipelineResult<TResult | AbortedCall>>> = []
  const results: Array<PipelineResult<TResult>> = []

  let hasErrors = false as boolean

  const flush = async (): Promise<boolean> => {
    const didError = await flushPendingResults(pending, results, onResult)

    pending = []
    hasErrors ||= didError

    return didError
  }

  for (let i = 0; i < pipeline.length; i++) {
    const validator = pipeline[i]!

    if (!shouldRunValidator(validator, context)) {
      continue
    }

    if (validator.runOnlyIfValid) {
      await flush()

      if (hasErrors) {
        continue
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
    }).then<PipelineResult<TResult | AbortedCall>>((result) => ({
      validatorIndex: i,
      result,
    }))

    pending.push(promise)
  }

  await flush()

  // Shouldn't happen, but in case we have sparse arrays
  return results.filter(Boolean)
}

interface FormValidatorPipelineArgs {
  pipeline: Array<FormValidator<any>>
  context: FormInputContext
  onResult?: (result: PipelineResult<FormValidateResult>) => void
}

export function runFormValidatorPipeline({
  pipeline,
  context,
  onResult,
}: FormValidatorPipelineArgs): Promise<
  Array<PipelineResult<FormValidateResult>>
> {
  const cache = (context.formApi as InternalFormApi<any, any>)
    ._validatorPipelineCache

  return runValidatorPipeline<FormValidateResult>({
    pipeline,
    context,
    onResult,
    cache,
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

export function runFieldValidatorPipeline({
  pipeline,
  context,
  onResult,
}: FieldValidatorPipelineArgs): Promise<
  Array<PipelineResult<FieldValidateResult>>
> {
  const cache = (
    context.fieldApi as AnyInternalFieldApi
  )._getOrCreateValidatorCache()

  return runValidatorPipeline<FieldValidateResult>({
    pipeline,
    context,
    onResult,
    cache,
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

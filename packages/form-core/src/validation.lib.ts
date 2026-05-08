import { LiteDebouncer } from '@tanstack/pacer-lite'
import { isStandardSchema, parseStandardSchema } from './standardSchema.lib'
import type {
  FieldValidateResult,
  FieldValidator,
  FieldValidatorContext,
  FormValidateResult,
  FormValidationError,
  FormValidator,
  FormValidatorContext,
  ValidationPredicateFn,
  ValidationTriggerOption,
  Validator,
} from './validation.public'
import type { InternalFormApi } from './FormApi.lib'
import type { AnyInternalFieldApi, InternalFieldApi } from './FieldApi.lib'

type FormValidateContext = Omit<FormValidatorContext<any>, 'value'>
type FieldValidateContext = Omit<FieldValidatorContext<any, any>, 'value'>
type FormInputContext = Omit<FormValidateContext, 'signal'>
type FieldInputContext = Omit<FieldValidateContext, 'signal'>

type InputContext = FormInputContext | FieldInputContext
type ValidateContext = FormValidateContext | FieldValidateContext
type ValidateResult = FormValidateResult | FieldValidateResult

function isFormContext(ctx: InputContext): ctx is FormInputContext {
  return 'triggerFieldApi' in ctx
}

const ABORTED_CALL = Symbol('ABORTED_CALL')

type AbortedCall = typeof ABORTED_CALL

/**
 * @private
 * Check if a validation result is considered an error.
 */
export function isErrorResult<T extends FormValidationError>(
  value: FormValidateResult | FieldValidateResult,
): value is T {
  if (value === null || value === undefined || value === false) return false
  return true
}

/**
 * Check if a validation result is a ValidationAggregateError.
 * If it is, return an object with formError and fieldErrors.
 * Otherwise, return null.
 */
export function isAggregateError(value: FormValidateResult): {
  formError: FormValidationError | null
  fieldErrors: Record<string, FormValidationError>
} | null {
  if (!isErrorResult<FormValidationError>(value)) return null

  const aggregateError = value

  // A ValidationAggregateError must be an object with at least one of form or fields
  if (!Array.isArray(aggregateError)) {
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
  debouncers: Map<number, ValidationDebouncer<TResult>>
  abortControllers: Map<number, AbortController>
}

export function createValidatorPipelineCache(): ValidatorPipelineCache<any> {
  return {
    debouncers: new Map(),
    abortControllers: new Map(),
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
    value: context.formApi.state.values,
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
  validator: Validator<any, any>,
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
  validator: Validator<any, any>,
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
  validator: Validator<any, any>
  context: InputContext
  validatorIndex: number
  cache: ValidatorPipelineCache<TResult>
  onExecute: (inputContext: ValidateContext) => Promise<TResult> | TResult
}

function createAbortPromise(signal: AbortSignal): {
  promise: Promise<null>
  cleanup: () => void
} {
  let onAbort = () => {}

  const promise = new Promise<null>((resolve) => {
    if (signal.aborted) {
      resolve(null)
      return
    }

    onAbort = () => {
      signal.removeEventListener('abort', onAbort)
      resolve(null)
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

function getOrCreateDebouncer<TResult extends ValidateResult>(
  cache: ValidatorPipelineCache<TResult>,
  cacheKey: number,
  fn: (call: PendingDebouncedCall<TResult>) => void,
  wait: number,
): ValidationDebouncer<TResult> {
  let debouncer = cache.debouncers.get(cacheKey)

  if (!debouncer) {
    debouncer = new LiteDebouncer(fn, {
      wait,
    })

    cache.debouncers.set(cacheKey, debouncer)
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
  const debounceMs =
    context.event === 'submit' ? 0 : (validator.triggerDebounceMs ?? 0)

  // AbortControllers are scoped to the validator instead of the whole pipeline.
  // Mostly because different validators can have different debounces and they
  // can be triggered by unrelated validation signals
  cache.abortControllers.get(cacheKey)?.abort()

  const abortController = new AbortController()
  const signal = abortController.signal

  cache.abortControllers.set(cacheKey, abortController)

  const validationContext: ValidateContext = {
    ...context,
    signal,
  }

  const cleanupController = () => {
    cache.abortControllers.delete(cacheKey)
  }

  const run = async (ctx: ValidateContext): Promise<TResult | AbortedCall> => {
    if (ctx.signal.aborted) {
      return ABORTED_CALL
    }

    const { promise: abortPromise, cleanup } = createAbortPromise(ctx.signal)

    try {
      return (await Promise.race([
        Promise.resolve(onExecute(ctx)),
        abortPromise,
      ])) as never
    } finally {
      cleanup()
      cleanupController()
    }
  }

  return new Promise<TResult | AbortedCall>((resolve, reject) => {
    const cleanup = () => {
      signal.removeEventListener('abort', onAbort)
      cleanupController()
    }

    const onAbort = () => {
      cache.debouncers.get(cacheKey)?.cancel()
      cleanup()
      resolve(ABORTED_CALL)
    }

    signal.addEventListener('abort', onAbort)

    if (debounceMs <= 0) {
      cache.debouncers.get(cacheKey)?.cancel()

      run(validationContext).then(
        (result) => {
          cleanup()
          resolve(result)
        },
        (error) => {
          cleanup()
          reject(error)
        },
      )

      return
    }

    const debouncer = getOrCreateDebouncer(
      cache,
      cacheKey,
      (call) => {
        run(call.context).then(call.resolve, call.reject)
      },
      debounceMs,
    )

    debouncer.maybeExecute({
      context: validationContext,
      resolve: (result) => {
        cleanup()
        resolve(result)
      },
      reject: (error) => {
        cleanup()
        reject(error)
      },
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

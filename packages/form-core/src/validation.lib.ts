import { LiteDebouncer } from '@tanstack/pacer-lite'
import type {
  FieldValidateResult,
  FieldValidator,
  FieldValidatorContext,
  FormValidateResult,
  FormValidationError,
  FormValidator,
  FormValidatorContext,
  ValidationEnabledFn,
  ValidationSignalOption,
} from './validation.public'
import type { InternalFormApi } from './FormApi.lib'
import type { InternalFieldApi } from './FieldApi.lib'

export interface BaseValidator<TFormData> {
  /**
   * If `true`, this validator will only run when all previous validators have passed.
   * If `false`, validators run regardless of earlier validation results.
   *
   * @default false
   */
  runOnlyIfValid?: boolean
  /**
   * TODO docs
   *
   * Whether this validator should be called during a submission attempt.
   *
   * @default true
   */
  runOnSubmit?: boolean | ValidationEnabledFn<TFormData>
  /**
   * The debounce time in milliseconds for validation signals (change, blur).
   * Does not affect submit events, which always execute immediately.
   *
   * @default 0
   */
  signalDebounceMs?: number
  signals?: Array<ValidationSignalOption<TFormData>>
}

type FormValidateContext = Omit<FormValidatorContext<any>, 'value'>
type FieldValidateContext = Omit<FieldValidatorContext<any, any>, 'value'>
type FormInputContext = Omit<FormValidateContext, 'signal'>
type FieldInputContext = Omit<FieldValidateContext, 'signal'>

type InputContext = FieldInputContext | FormInputContext

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
    // Check if it has the form or fields properties (or both)
    if ('fields' in aggregateError) {
      return {
        formError: aggregateError.form ?? null,
        fieldErrors: aggregateError.fields,
      }
    }
  }

  return null
}

const ABORTED_CALL = { isAborted: true }

export interface PipelineResult<T> {
  validatorIndex: number
  result: T
}

export interface ValidatorPipelineCache {
  debouncers: Map<number, LiteDebouncer<any>>
  abortControllers: Map<number, AbortController>
}

export function createValidatorPipelineCache(): ValidatorPipelineCache {
  return {
    debouncers: new Map(),
    abortControllers: new Map(),
  }
}

interface DebouncedValidationCall {
  context: FormValidateContext
  resolve: (result: FormValidateResult | undefined) => void
  reject: (error: unknown) => void
}

function getEnabledState(
  booleanOrFn: boolean | ValidationEnabledFn<any>,
  context: FormInputContext,
): boolean {
  if (typeof booleanOrFn === 'boolean') return booleanOrFn
  return booleanOrFn({
    fieldApi: context.fieldApi,
    formApi: context.formApi,
    value: context.formApi.state.values,
  })
}

function isValidationSignalEnabled(
  signal: ValidationSignalOption<any>,
  context: FormInputContext,
): boolean {
  if (typeof signal === 'string') {
    return signal === context.event
  }
  if (signal.signal !== context.event) {
    return false
  }

  const { enabled = true } = signal

  return getEnabledState(enabled, context)
}

function getFirstEnabledValidationSignal(
  validator: BaseValidator<any>,
  context: FormInputContext,
): ValidationSignalOption<any> | 'submit' | null {
  const { runOnSubmit = true } = validator
  const signals = validator.signals ?? []

  if (context.event === 'submit') {
    if (getEnabledState(runOnSubmit, context)) {
      return 'submit'
    }
    return null
  }

  for (const signal of signals) {
    if (isValidationSignalEnabled(signal, context)) {
      return signal
    }
  }

  return null
}

interface ValidatorPipelineArgs {
  context: InputContext
  cache: ValidatorPipelineCache
  pipeline: Array<FormValidator<any> | FieldValidator<any, any>>
  getContext: (
    inputContext: FieldValidateContext | FormValidateContext,
  ) => FieldValidatorContext<any, any> | FormValidatorContext<any>
  onResult?: (result: PipelineResult<FormValidateResult>) => void
}

function runMaybeDebouncedValidator(
  validator: BaseValidator<any>,
  context: InputContext,
  validatorIndex: number,
  cache: ValidatorPipelineCache,
  onExecute: (
    inputContext: FormValidateContext | FieldValidateContext,
  ) => Promise<FormValidateResult> | FormValidateResult,
): Promise<FormValidateResult> {
  const debounceMs =
    context.event === 'submit' ? 0 : (validator.signalDebounceMs ?? 0)
  const cacheKey = validatorIndex
  const existingDebouncer = cache.debouncers.get(cacheKey)

  // AbortControllers are scoped to the validator instead of the pipeline.
  // Mostly because different validators can have different debounces and they
  // can be triggered by unrelated validation signals
  cache.abortControllers.get(cacheKey)?.abort()

  const abortController = new AbortController()
  const signal = abortController.signal
  cache.abortControllers.set(cacheKey, abortController)

  const run = async (
    validationContext: FormValidateContext | FieldValidateContext,
  ): Promise<FormValidateResult> => {
    if (validationContext.signal.aborted) {
      return null
    }
    const validatePromise = onExecute({
      event: context.event,
      fieldApi: context.fieldApi,
      formApi: context.formApi,
      signal: validationContext.signal,
    })
    // Race the validation against the signal being aborted
    let onAbort = () => {}
    const abortPromise = new Promise<FormValidateResult>((resolve) => {
      if (validationContext.signal.aborted) {
        resolve(null)
        return
      }
      onAbort = () => {
        validationContext.signal.removeEventListener('abort', onAbort)
        resolve(null)
      }
      validationContext.signal.addEventListener('abort', onAbort)
    })
    try {
      return await Promise.race([validatePromise, abortPromise])
    } finally {
      validationContext.signal.removeEventListener('abort', onAbort)
      cache.abortControllers.delete(cacheKey)
    }
  }

  const internalContext: FormValidateContext = {
    ...context,
    signal,
  }

  return new Promise<FormValidateResult>((resolve, reject) => {
    const onAbort = () => {
      existingDebouncer?.cancel()
      cache.abortControllers.delete(cacheKey)
      resolve(ABORTED_CALL as never)
    }
    signal.addEventListener('abort', onAbort)

    const cleanup = () => {
      signal.removeEventListener('abort', onAbort)
      cache.abortControllers.delete(cacheKey)
    }

    if (debounceMs <= 0) {
      existingDebouncer?.cancel()
      run(internalContext).then(
        (result) => {
          cleanup()
          resolve(result)
        },
        (error) => {
          cleanup()
          reject(error)
        },
      )
    } else {
      let debouncer = existingDebouncer

      if (!debouncer) {
        debouncer = new LiteDebouncer(
          async (call: DebouncedValidationCall) => {
            try {
              call.resolve(await run(call.context))
            } catch (error) {
              call.reject(error)
            }
          },
          {
            wait: debounceMs,
            leading: false,
            trailing: true,
          },
        )

        cache.debouncers.set(cacheKey, debouncer)
      }

      debouncer.maybeExecute({
        context: internalContext,
        resolve: (result: any) => {
          cleanup()
          resolve(result)
        },
        reject: (error: any) => {
          cleanup()
          reject(error)
        },
      })
    }
  })
}

async function runValidatorPipeline({
  pipeline,
  context,
  cache,
  getContext,
  onResult,
}: ValidatorPipelineArgs): Promise<Array<PipelineResult<FormValidateResult>>> {
  let pendingPromises: Array<Promise<PipelineResult<FormValidateResult>>> = []
  const results: Array<PipelineResult<FormValidateResult>> = []
  let hasErrors = false

  const applyPendingPromises = async (): Promise<boolean> => {
    let hasErroredPromises = false
    const newPending: Array<Promise<void>> = []

    for (const promise of pendingPromises) {
      newPending.push(
        promise.then((result) => {
          // @ts-expect-error ABORTED_CALL is a special case, but we
          // don't want to change all the typing just for it
          if (result.result === ABORTED_CALL) return
          if (isErrorResult(result.result)) {
            hasErroredPromises = true
          }
          results.push(result)
          // We want to make sure that slow validators or debounced ones
          // don't slow down early incoming finishes.
          onResult?.(result)
        }),
      )
    }

    pendingPromises = []
    await Promise.all(newPending)
    return hasErroredPromises
  }

  for (let i = 0; i < pipeline.length; i++) {
    const validator = pipeline[i]!

    const { runOnlyIfValid } = validator
    const firstEnabledSignal = getFirstEnabledValidationSignal(
      validator,
      context,
    )

    if (firstEnabledSignal === null) {
      continue
    }

    if (runOnlyIfValid) {
      if (hasErrors) {
        continue
      } else if (await applyPendingPromises()) {
        hasErrors = true
        continue
      }
    }

    const promise = runMaybeDebouncedValidator(
      validator,
      context,
      i,
      cache,
      (ctx) => validator.validate(getContext(ctx) as never),
    ).then<PipelineResult<FormValidateResult>>((result) => ({
      validatorIndex: i,
      result,
    }))

    pendingPromises.push(promise)
  }

  await applyPendingPromises()

  return results
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
  return runValidatorPipeline({
    pipeline,
    context,
    onResult,
    cache,
    getContext: (ctx) => ({
      event: ctx.event,
      fieldApi: ctx.fieldApi,
      formApi: ctx.formApi,
      signal: ctx.signal,
      value: ctx.formApi.state.values,
    }),
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
    context.fieldApi as InternalFieldApi<any, any>
  )._getOrCreateValidatorCache()

  return runValidatorPipeline({
    pipeline,
    context,
    onResult: onResult as never,
    cache,
    getContext: (ctx) => ({
      event: ctx.event,
      formApi: ctx.formApi,
      signal: ctx.signal,
      fieldApi: context.fieldApi,
      value: context.fieldApi.value,
    }),
  }) as never
}

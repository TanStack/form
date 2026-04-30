import { LiteDebouncer } from '@tanstack/pacer-lite/lite-debouncer'
import type {
  FormValidateResult,
  FormValidator,
  FormValidatorContext,
  FormValidatorErrorScope,
  ValidationEnabledFn,
  ValidationSignalOption,
} from './validation.public'
import type { InternalFormApi } from './FormApi.lib'

export function isErrorResult(
  value: FormValidateResult,
): value is Exclude<FormValidateResult, null | undefined | false> {
  if (value === null || value === undefined || value === false) return false
  return true
}

type ValidateContext = Omit<FormValidatorContext<any>, 'value'>
type InputContext = Omit<ValidateContext, 'signal'>

export interface PipelineResult {
  validatorIndex: number
  errorScope: FormValidatorErrorScope
  result: FormValidateResult
}

type ValidatorCacheKey = `form:${number}`

export interface ValidatorPipelineCache {
  debouncers: Map<ValidatorCacheKey, LiteDebouncer<any>>
  abortControllers: Map<ValidatorCacheKey, AbortController>
}

export function createValidatorPipelineCache(): ValidatorPipelineCache {
  return {
    debouncers: new Map(),
    abortControllers: new Map(),
  }
}

interface DebouncedValidationCall {
  context: ValidateContext
  resolve: (result: FormValidateResult | undefined) => void
  reject: (error: unknown) => void
}

function getEnabledState(
  booleanOrFn: boolean | ValidationEnabledFn<any>,
  context: InputContext,
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
  context: InputContext,
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
  validator: FormValidator<any>,
  context: InputContext,
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

function getDebouncerKey(validatorIndex: number): ValidatorCacheKey {
  return `form:${validatorIndex}`
}

function runMaybeDebouncedValidator(
  validator: FormValidator<any>,
  context: InputContext,
  validatorIndex: number,
  cache: ValidatorPipelineCache,
): Promise<FormValidateResult> {
  const debounceMs =
    context.event === 'submit' ? 0 : (validator.signalDebounceMs ?? 0)
  const cacheKey = getDebouncerKey(validatorIndex)

  const existingDebouncer = cache.debouncers.get(cacheKey)

  // AbortControllers are scoped to the validator instead of the pipeline.
  // Mostly because different validators can have different debounces and they
  // can be triggered by unrelated validation signals
  cache.abortControllers.get(cacheKey)?.abort()

  const abortController = new AbortController()
  const signal = abortController.signal
  cache.abortControllers.set(cacheKey, abortController)

  const run = async (
    validationContext: ValidateContext,
  ): Promise<FormValidateResult> => {
    if (validationContext.signal.aborted) {
      return null
    }
    const validatePromise = validator.validate({
      ...validationContext,
      value: validationContext.formApi.state.values,
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

  const internalContext: ValidateContext = {
    ...context,
    signal,
  }

  if (debounceMs <= 0) {
    existingDebouncer?.cancel()
    return run(internalContext)
  }

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

  return new Promise<FormValidateResult>((resolve, reject) => {
    const onAbort = () => {
      debouncer.cancel()
      cache.abortControllers.delete(cacheKey)
      resolve(null)
    }
    signal.addEventListener('abort', onAbort)
    debouncer.maybeExecute({
      context: internalContext,
      resolve: (result: any) => {
        signal.removeEventListener('abort', onAbort)
        cache.abortControllers.delete(cacheKey)
        resolve(result)
      },
      reject: (error: any) => {
        signal.removeEventListener('abort', onAbort)
        cache.abortControllers.delete(cacheKey)
        reject(error)
      },
    })
  })
}

export async function runFormValidatorPipeline(
  pipeline: Array<FormValidator<any>>,
  context: InputContext,
): Promise<Array<PipelineResult>> {
  let pendingPromises: Array<Promise<PipelineResult>> = []
  const results: Array<PipelineResult> = []
  const cache = (context.formApi as InternalFormApi<any, any>)
    ._validatorPipelineCache
  let hasErrors = false

  const applyPendingPromises = async (): Promise<boolean> => {
    let hasErroredPromises = false

    const promiseResults = await Promise.all(pendingPromises)
    pendingPromises = []

    for (const result of promiseResults) {
      if (isErrorResult(result.result)) {
        hasErroredPromises = true
      }

      results.push(result)
    }

    return hasErroredPromises
  }

  for (let i = 0; i < pipeline.length; i++) {
    const validator = pipeline[i]!

    const { errorScope = 'all', runOnlyIfValid } = validator
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
    ).then((result) => ({
      validatorIndex: i,
      errorScope,
      result,
    }))

    pendingPromises.push(promise)
  }

  await applyPendingPromises()

  return results
}

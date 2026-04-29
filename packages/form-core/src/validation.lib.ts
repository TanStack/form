import { LiteDebouncer } from '@tanstack/pacer-lite/lite-debouncer'
import type {
  FormValidateResult,
  FormValidator,
  FormValidatorContext,
  ValidationEnabledFn,
  ValidationSignalOption,
} from './validation.public'

export function isErrorResult(
  value: FormValidateResult,
): value is Exclude<FormValidateResult, null | undefined | false> {
  if (value === null || value === undefined || value === false) return false
  return true
}

type ValidateContext = Omit<FormValidatorContext<any>, 'value'>

export interface PipelineResult {
  validatorIndex: number
  errorScope: NonNullable<FormValidator<any>['errorScope']>
  result: FormValidateResult
}

export interface ValidatorPipelineCache {
  debouncers: Map<string, LiteDebouncer<any>>
}

export function createValidatorPipelineCache(): ValidatorPipelineCache {
  return {
    debouncers: new Map(),
  }
}

interface DebouncedValidationCall {
  context: ValidateContext
  resolve: (result: FormValidateResult | undefined) => void
  reject: (error: unknown) => void
}

function getEnabledState(
  booleanOrFn: boolean | ValidationEnabledFn<any>,
  context: ValidateContext,
): boolean {
  if (typeof booleanOrFn === 'boolean') return booleanOrFn
  return booleanOrFn({
    fieldApi: context.fieldApi,
    formApi: context.formApi,
    value: context.formApi.state.values,
  })
}

function isSignalEnabled(
  signal: ValidationSignalOption<any>,
  context: ValidateContext,
): boolean {
  if (typeof signal === 'string') {
    return signal === context.event
  }

  const { enabled = true } = signal

  return getEnabledState(enabled, context)
}

function getFirstEnabledSignal(
  validator: FormValidator<any>,
  context: ValidateContext,
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
    if (isSignalEnabled(signal, context)) {
      return signal
    }
  }

  return null
}

function getDebouncerKey(validatorIndex: number): string {
  return `form:${validatorIndex}`
}

function runMaybeDebouncedValidator(
  validator: FormValidator<any>,
  context: ValidateContext,
  validatorIndex: number,
  cache: ValidatorPipelineCache,
): Promise<FormValidateResult> {
  const run = async (
    validationContext: ValidateContext,
  ): Promise<FormValidateResult> => {
    return validator.validate({
      ...validationContext,
      value: validationContext.formApi.state.values,
    })
  }

  const debounceMs =
    context.event === 'submit' ? 0 : (validator.signalDebounceMs ?? 0)
  const debouncerKey = getDebouncerKey(validatorIndex)

  // Cancel any pending debounce for this key
  const existingDebouncer = cache.debouncers.get(debouncerKey)

  if (debounceMs <= 0) {
    existingDebouncer?.cancel()
    return run(context)
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

    cache.debouncers.set(debouncerKey, debouncer)
  }

  return new Promise<FormValidateResult>((resolve, reject) => {
    debouncer.maybeExecute({
      context,
      resolve,
      reject,
    })
  })
}

export async function runFormValidatorPipeline(
  pipeline: Array<FormValidator<any>>,
  context: ValidateContext,
  cache: ValidatorPipelineCache = createValidatorPipelineCache(),
): Promise<Array<PipelineResult>> {
  let pendingPromises: Array<Promise<PipelineResult>> = []
  const results: Array<PipelineResult> = []
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
    const firstEnabledSignal = getFirstEnabledSignal(validator, context)

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

    // Submit always executes immediately (debounceMs = 0)
    // Non-submit events use validator.signalDebounceMs (defaults to 0)
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

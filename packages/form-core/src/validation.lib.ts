import { LiteDebouncer } from '@tanstack/pacer-lite/lite-debouncer'
import { normalizeToArray } from './utils'
import type {
  FormValidateResult,
  FormValidator,
  FormValidatorContext,
  ValidationSignalOption,
} from './validation.public'

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
  context: FormValidatorContext<any>
  resolve: (result: FormValidateResult | undefined) => void
  reject: (error: unknown) => void
}

function isSignalEnabled(
  signal: ValidationSignalOption<any>,
  context: FormValidatorContext<any>,
): boolean {
  if (typeof signal === 'string') {
    return signal === context.event
  }

  const { enabled = true } = signal

  if (typeof enabled === 'boolean') {
    return enabled
  }

  return enabled({
    fieldApi: context.fieldApi,
    formApi: context.formApi,
    value: context.value,
  })
}

function getFirstEnabledSignal(
  validator: FormValidator<any>,
  context: FormValidatorContext<any>,
): ValidationSignalOption<any> | null {
  const { runOnSubmit = true } = validator
  const signals = normalizeToArray(validator.signals)

  if (context.event === 'submit' && !runOnSubmit) {
    return null
  }

  for (const signal of signals) {
    if (isSignalEnabled(signal, context)) {
      return signal
    }
  }

  return null
}

function getSignalDebounceMs(signal: ValidationSignalOption<any>): number {
  const debounceMs = typeof signal === 'object' ? signal.debounceMs : undefined
  return debounceMs ?? 0
}

function getDebouncerKey(
  context: FormValidatorContext<any>,
  validatorIndex: number,
): string {
  return `${context.event}:${validatorIndex}:${context.fieldApi?.name ?? 'form'}`
}

function runMaybeDebouncedValidator(
  validator: FormValidator<any>,
  context: FormValidatorContext<any>,
  validatorIndex: number,
  debounceMs: number,
  cache: ValidatorPipelineCache,
): Promise<FormValidateResult | undefined> {
  const run = async (
    validationContext: FormValidatorContext<any>,
  ): Promise<FormValidateResult | undefined> => {
    return validator.validate(validationContext)
  }

  if (debounceMs <= 0) {
    return run(context)
  }

  const debouncerKey = getDebouncerKey(context, validatorIndex)

  let debouncer = cache.debouncers.get(debouncerKey)

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
  context: FormValidatorContext<any>,
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
      if (result.result !== null && result.result !== undefined) {
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

    const debounceMs = getSignalDebounceMs(firstEnabledSignal)

    const promise = runMaybeDebouncedValidator(
      validator,
      context,
      i,
      debounceMs,
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

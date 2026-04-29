import { normalizeToArray } from './utils'
import type {
  FormValidateResult,
  FormValidator,
  FormValidatorContext,
  ValidationSignalOption,
} from './validation.public'
// TODO catch thrown errors
// TODO return errorScope

export interface PipelineResult {
  validatorIndex: number
  errorScope: NonNullable<FormValidator<any>['errorScope']>
  result: FormValidateResult
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

export async function runFormValidatorPipeline(
  pipeline: Array<FormValidator<any>>,
  context: FormValidatorContext<any>,
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

    const { errorScope = 'all', validate, runOnlyIfValid } = validator
    const firstEnabledSignal = getFirstEnabledSignal(validator, context)
    if (firstEnabledSignal === null) {
      continue
    }

    if (typeof firstEnabledSignal === 'object') {
      // TODO add debouncing
      firstEnabledSignal.debounceMs
    }

    if (runOnlyIfValid) {
      if (hasErrors) {
        continue
      } else if (await applyPendingPromises()) {
        hasErrors = true
        continue
      }
    }

    const maybePromise = validate(context)
    if (maybePromise instanceof Promise) {
      pendingPromises.push(
        maybePromise.then((result) => ({
          validatorIndex: i,
          errorScope,
          result,
        })),
      )
    } else if (maybePromise !== null && maybePromise !== undefined) {
      hasErrors = true
      results.push({ validatorIndex: i, errorScope, result: maybePromise })
    }
  }

  await applyPendingPromises()

  return results
}

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

function isValidatorDisabled(
  validator: FormValidator<any>,
  context: FormValidatorContext<any>,
): boolean {
  const { runOnSubmit = true } = validator
  const signals = normalizeToArray(validator.signals)

  if (context.event === 'submit' && !runOnSubmit) {
    return true
  }

  const isSignalDisabled = (signal: ValidationSignalOption<any>) =>
    !isSignalEnabled(signal, context)

  return signals.every(isSignalDisabled)
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

  // TODO catch thrown errors
  // TODO return errorScope

  for (let i = 0; i < pipeline.length; i++) {
    const validator = pipeline[i]!

    const { errorScope = 'all', validate, runOnlyIfValid } = validator
    if (isValidatorDisabled(validator, context)) {
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

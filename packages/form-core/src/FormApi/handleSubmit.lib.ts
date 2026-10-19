import { batch } from '@tanstack/store'
import {
  isErrorResult,
  isValidationErrorMap,
  parseValidationResult,
} from '../validation'
import { createErrorMapFactory } from '../createErrorMap.lib'
import { parseIssuesFactory } from '../validation/parseIssues.lib'
import type { InternalFormApi } from './FormApi.lib'
import type { ValidationErrorInput } from '../validation.public'
import type {
  FormValidationFailure,
  FormValidationResult,
} from '../validation/state.public'
import type {
  CreateValidationErrorFn,
  FormSubmitContext,
  OnSubmitError,
} from './formSubmit.public'

export const submitErrorSymbol = Symbol('Submit error')

function isSubmitError<TFormData>(
  value: unknown,
): value is OnSubmitError<FormValidationFailure<TFormData>> {
  return (
    typeof value === 'object' && value !== null && submitErrorSymbol in value
  )
}

const createValidationError: CreateValidationErrorFn = <
  TError extends FormValidationFailure<any>,
>(
  error: TError,
): OnSubmitError<TError> => {
  return createSubmitError(error)
}

function createSubmitError<TError extends FormValidationFailure<any>>(
  error: TError,
): OnSubmitError<TError> {
  return { [submitErrorSymbol]: error }
}

function withSubmitError<TFunction extends (...args: any) => unknown>(
  callback: TFunction,
): any {
  return (...args: any[]) => {
    const obj = callback(...args)
    Object.defineProperty(obj, submitErrorSymbol, { value: obj })
    return obj
  }
}

export async function runSubmissionProcess<TFormData>(
  form: InternalFormApi<TFormData>,
): Promise<Array<FormValidationFailure<TFormData>>> {
  const submitResetVersion = form._atoms.resetVersion.get()
  const hasResettedFormDuringSubmit = () =>
    form._atoms.resetVersion.get() !== submitResetVersion

  batch(() => {
    form._atoms.meta.submissionAttempts.set((prev) => prev + 1)
    form._atoms.meta.isSubmitting.set(true)
  })

  const submissionData = {
    hasFailed: false,
    submitError:
      null satisfies FormValidationResult<TFormData> as FormValidationResult<TFormData>,
  }

  const fields = form._fieldRootNode._touchAllFieldsAndCollectSubmitValidators()

  const fieldValidatorResults = await Promise.all(
    fields.map((field) =>
      field._runFieldValidation('submit', { onResult: false }),
    ),
  )

  if (hasResettedFormDuringSubmit()) {
    return []
  }

  const fieldResults: Array<ValidationErrorInput> = []

  batch(() => {
    for (let i = 0; i < fieldValidatorResults.length; i++) {
      const field = fields[i]!
      const pipelineResult = fieldValidatorResults[i]!

      if (pipelineResult.thrownError !== null) {
        submissionData.hasFailed = true
      }

      for (const result of pipelineResult.results) {
        if (isErrorResult(result.result)) {
          submissionData.hasFailed = true
          fieldResults.push(result.result)
        }
        field._processValidationResult(result, 'submit')
      }
    }
  })

  // TODO maybe some users don't want form validation to run if field validation failed.
  // Configurable option with opt-out wouldn't hurt.
  // Also keep in mind this would apply to handleChange too.
  const formPipelineResult = await form._runFormValidation('submit', {
    hasFailedBefore: submissionData.hasFailed,
  })

  if (hasResettedFormDuringSubmit()) {
    return []
  }

  if (formPipelineResult.thrownError !== null || formPipelineResult.hasErrors) {
    submissionData.hasFailed = true
  }

  const errorResults = formPipelineResult.results
    .map(({ result }) => result)
    .filter(isErrorResult)
    .concat(fieldResults)

  const cleanup = () => {
    if (hasResettedFormDuringSubmit()) {
      return
    }

    batch(() => {
      form._atoms.meta.isSubmitting.set(false)
      form._atoms.meta.isSubmitSuccessful.set(!submissionData.hasFailed)
    })
  }

  const finishInvalidSubmission = async (
    value: TFormData,
  ): Promise<Array<FormValidationFailure<TFormData>>> => {
    try {
      await form._options.onSubmitInvalid?.({
        value,
        formApi: form as never,
      })
    } finally {
      cleanup()
    }

    if (hasResettedFormDuringSubmit()) {
      return []
    }

    // TODO ew. Resolve this differently, this is really bad.
    return errorResults.flatMap<FormValidationFailure<TFormData>>((error) => {
      const { self, subfields } = parseValidationResult(error)
      if (isValidationErrorMap(error)) {
        return [{ ...error, form: self ?? undefined, fields: subfields ?? {} }]
      }
      return self ?? []
    })
  }

  if (submissionData.hasFailed) {
    return finishInvalidSubmission(form.state.values)
  }

  const validatorOutputs = form._validatorInstances?.map((v) => v.output) ?? []
  const value = form.state.values

  try {
    const maybeError = await form._options.onSubmit?.({
      formApi: form as never,
      validatorOutputs,
      value,
      createValidationError,
      createErrorMap: withSubmitError(createErrorMapFactory(value)),
      parseIssues: withSubmitError(parseIssuesFactory(value)),
    } satisfies FormSubmitContext<TFormData, any> as any)

    if (hasResettedFormDuringSubmit()) {
      return []
    }

    // Store onSubmit errors separately from installed validator instances.
    if (isSubmitError<TFormData>(maybeError)) {
      const error = maybeError[submitErrorSymbol]
      form._processSubmitValidationResult(error, 'submit')
      submissionData.submitError = error
    } else {
      form._processSubmitValidationResult(null, 'submit')
    }
  } catch (e) {
    if (hasResettedFormDuringSubmit()) {
      return []
    }

    console.error(e)
    submissionData.hasFailed = true
  }

  batch(() => {
    if (isErrorResult(submissionData.submitError)) {
      submissionData.hasFailed = true
      errorResults.push(submissionData.submitError)
    }
  })

  if (submissionData.hasFailed) {
    return finishInvalidSubmission(value)
  }

  cleanup()
  return errorResults
}

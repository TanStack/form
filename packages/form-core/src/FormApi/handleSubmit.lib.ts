import { batch } from '@tanstack/store'
import { isErrorResult } from '../validation.lib'
import { parseStandardSchemaIssues } from '../standardSchema.lib'
import { isNotNil } from '../utils.lib'
import type { InternalFormApi } from './FormApi.lib'
import type {
  FormValidateResult,
  FormValidationError,
  ValidationErrorInput,
} from '../validation.public'
import type {
  CreateValidationErrorFn,
  OnSubmitError,
  ParseSubmitIssuesFn,
} from './FormApi.public'

const SUBMIT_ERROR = Symbol('SUBMIT_ERROR')

function isSubmitError<TFormData>(
  value: unknown,
): value is FormValidationError<TFormData> {
  return isNotNil(value) && Boolean((value as any)[SUBMIT_ERROR])
}

const createValidationError: CreateValidationErrorFn<any> = <
  TError extends FormValidationError<any>,
>(
  error: TError,
): OnSubmitError<TError> => {
  return createSubmitError(error)
}

function createSubmitError<TError extends FormValidationError<any>>(
  error: TError,
): OnSubmitError<TError> {
  let output: OnSubmitError<TError>
  if (typeof error === 'string') {
    // strings can't retain symbols, so we gotta normalize early
    output = { message: error } as any
  } else {
    output = error as any
  }
  const runtimeOutput = output as any
  runtimeOutput[SUBMIT_ERROR] = true

  return output
}

function createParseIssues<TFormData>(
  value: TFormData,
): ParseSubmitIssuesFn<TFormData> {
  return (issues) => {
    return createSubmitError(parseStandardSchemaIssues(issues, value, 'form'))
  }
}

export async function runSubmissionProcess<TFormData>(
  form: InternalFormApi<TFormData, any, any>,
): Promise<Array<FormValidationError<TFormData>>> {
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
      null satisfies FormValidateResult<TFormData> as FormValidateResult<TFormData>,
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

  if (submissionData.hasFailed) {
    cleanup()
    return errorResults
  }

  const schemaOutputs: any = Array.from(
    { length: form.options.validators?.length ?? 0 },
    (_, i) => {
      return form._schemaOutputs[i]
    },
  )

  try {
    const maybeError = await form._options.onSubmit?.({
      formApi: form as never,
      schemaOutputs,
      value: form.state.values,
      createValidationError,
      parseIssues: createParseIssues(form.state.values),
    })

    if (hasResettedFormDuringSubmit()) {
      return []
    }

    // Attach onSubmit errors at the end of the validators array
    if (isSubmitError<TFormData>(maybeError)) {
      form._processValidationResult(
        {
          validatorIndex: form.options.validators?.length ?? 0,
          result: maybeError,
          schemaResult: null,
        },
        'submit',
      )
      submissionData.submitError = maybeError
    } else {
      form._processValidationResult(
        {
          validatorIndex: form.options.validators?.length ?? 0,
          result: null,
          schemaResult: null,
        },
        'submit',
      )
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

      form._processValidationResult(
        {
          validatorIndex: form.options.validators?.length ?? 0,
          result: submissionData.submitError,
          schemaResult: null,
        },
        'submit',
      )
    }
    // Cleanup regardless of error result or not
    cleanup()
  })

  return errorResults
}

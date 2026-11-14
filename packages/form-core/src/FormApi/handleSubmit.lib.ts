import { batch } from '@tanstack/store'
import {
  getValidationErrors,
  isErrorResult,
} from '../validation/results/errors.lib'
import { createErrorMap } from '../validation/results/createErrorMap.lib'
import { parseIssuesFactory } from '../validation/results/parseIssues.lib'
import { SubmissionAttempt } from '../submissionAttempt.lib'
import type { SubmissionOutcome } from '../submissionAttempt.lib'
import type { FormSubmitContext, OnSubmitError } from './formSubmit.public'
import type {
  FormValidationFailure,
  FormValidationResult,
  FormattedValidationError,
} from '../validation/results/results.public'
import type { InternalFormApi } from './FormApi.lib'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'

export const submitErrorSymbol = Symbol('Submit error')

function isSubmitError<TFormData>(
  value: unknown,
): value is OnSubmitError<FormValidationFailure<TFormData>> {
  return (
    typeof value === 'object' && value !== null && submitErrorSymbol in value
  )
}

function createValidationError<TError extends FormValidationFailure<any>>(
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

interface FormSubmissionValidation<TFormData> {
  hasFailed: boolean
  errors: Array<FormattedValidationError<TFormData>>
  validatorOutputs: Array<unknown>
}

async function validateFormSubmission<TFormData>(
  form: InternalFormApi<TFormData>,
  submission: SubmissionAttempt<FormattedValidationError<TFormData>>,
): Promise<FormSubmissionValidation<TFormData>> {
  const validation: FormSubmissionValidation<TFormData> = {
    hasFailed: false,
    errors: [],
    validatorOutputs: [],
  }

  if (!submission.isActive()) return validation
  form._notifyFormListener('submit', null)
  if (!submission.isActive()) return validation

  for (const field of submission.notificationFields) {
    if (!submission.isActive()) return validation
    field._handleEvent(
      {
        causeValidation: false,
        markAsBlurred: false,
        markAsDirty: false,
        markAsTouched: true,
        notifyParentFields: false,
      },
      'submit',
    )
  }

  const fieldValidatorResults: Array<
    ReturnType<AnyInternalFieldApi['_runFieldValidation']> | undefined
  > = []
  const fieldOutcomes = await Promise.allSettled(
    Array.from(submission.fields.keys(), async (field, index) => {
      if (!submission.isActive()) return null
      const run = field._runFieldValidation('submit', {
        catchErrors: false,
        onResult: false,
        submission,
      })
      fieldValidatorResults[index] = run
      await run?.pending
      return run
    }),
  )

  if (!submission.isActive()) return validation

  const fieldResults: Array<FormattedValidationError<TFormData>> = []

  batch(() => {
    let fieldIndex = 0
    for (const field of submission.fields.keys()) {
      const pipelineResult = fieldValidatorResults[fieldIndex]
      fieldIndex++
      if (!pipelineResult) continue

      for (const result of pipelineResult.collector.getResults()) {
        if (!submission.isActive()) return
        if (isErrorResult(result.value.result)) {
          validation.hasFailed = true
          fieldResults.push(
            ...getValidationErrors<TFormData>(result.value.result),
          )
        }
        field._processValidationResult(result, 'submit')
      }
    }
  })

  if (!submission.isActive()) return validation

  for (const outcome of fieldOutcomes) {
    if (outcome.status === 'rejected') throw outcome.reason
  }

  // Maybe some users don't want form validation to run if field validation failed.
  // Configurable option with opt-out wouldn't hurt, but wait for demand.
  // Also keep in mind this would apply to handleChange too.
  const formRun = form._runFormValidation('submit', {
    catchErrors: false,
    hasFailedBefore: validation.hasFailed,
    submission,
  })
  await formRun?.pending

  if (!submission.isActive() || !formRun) return validation

  if (formRun.collector.hasErrors()) {
    validation.hasFailed = true
  }

  validation.errors = formRun.collector
    .getResults()
    .flatMap(({ value }) => getValidationErrors<TFormData>(value.result))
    .concat(fieldResults)

  if (!validation.hasFailed) {
    validation.validatorOutputs = formRun.collector.getOutputs(
      formRun.validatorCount,
    )
  }
  return validation
}

async function runFormSubmissionCallbacks<TFormData>(
  form: InternalFormApi<TFormData>,
  submission: SubmissionAttempt<FormattedValidationError<TFormData>>,
  validation: FormSubmissionValidation<TFormData>,
): Promise<SubmissionOutcome<FormattedValidationError<TFormData>>> {
  const submissionData = {
    hasFailed: validation.hasFailed,
    submitError:
      null satisfies FormValidationResult<TFormData> as FormValidationResult<TFormData>,
  }
  const errorResults = validation.errors
  const earlyExit = { errors: [], successful: false }

  const finishInvalidSubmission = async (
    value: TFormData,
  ): Promise<SubmissionOutcome<FormattedValidationError<TFormData>>> => {
    if (!submission.isActive()) return earlyExit

    await form._options.onSubmitInvalid?.({
      value,
      formApi: form,
    })

    if (!submission.isActive()) return earlyExit

    return { errors: errorResults, successful: false }
  }

  if (submissionData.hasFailed) {
    return await finishInvalidSubmission(submission.value)
  }

  const value = submission.value

  try {
    const maybeError = await form._options.onSubmit?.({
      formApi: form as never,
      validatorOutputs: validation.validatorOutputs,
      value,
      createValidationError,
      createErrorMap: withSubmitError(createErrorMap),
      parseIssues: withSubmitError(parseIssuesFactory(value, 'field')),
    } satisfies FormSubmitContext<TFormData, any> as any)

    if (!submission.isActive()) return earlyExit

    // Store onSubmit errors separately from installed validator instances.
    if (isSubmitError<TFormData>(maybeError)) {
      const error = maybeError[submitErrorSymbol]
      if (submission.canApplyValidationResults())
        form._applyValidationResult(form._onSubmitSource, error, 'submit')
      submissionData.submitError = error
    } else {
      if (submission.canApplyValidationResults())
        form._applyValidationResult(form._onSubmitSource, null, 'submit')
    }
  } catch (e) {
    if (!submission.isActive()) return earlyExit

    console.error(e)
    submissionData.hasFailed = true
  }

  if (!submission.isActive()) return earlyExit

  batch(() => {
    if (isErrorResult(submissionData.submitError)) {
      submissionData.hasFailed = true
      errorResults.push(...getValidationErrors(submissionData.submitError))
    }
  })

  if (submissionData.hasFailed) {
    return await finishInvalidSubmission(value)
  }

  return { errors: errorResults, successful: true }
}

export function handleFormSubmit<TFormData>(form: InternalFormApi<TFormData>) {
  const values = form._atoms.values.get()
  const submission = new SubmissionAttempt<FormattedValidationError<TFormData>>(
    {
      values,
      value: values,
      node: form._fieldRootNode,
      validators: form._validatorInstances,
      owner: {
        submissions: form._submissions,
        submissionAttempts: form._atoms.meta.submissionAttempts,
        isSubmitting: form._atoms.meta.isSubmitting,
        isSubmitSuccessful: form._atoms.meta.isSubmitSuccessful,
      },
    },
  )
  submission.start({
    validate: () => validateFormSubmission(form, submission),
    callbacks: (validation) =>
      runFormSubmissionCallbacks(form, submission, validation),
  })
  return submission.promise
}

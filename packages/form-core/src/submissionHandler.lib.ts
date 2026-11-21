import { batch, createAtom } from '@tanstack/store'
import { SubmissionAttempt } from './submissionAttempt.lib'
import { getBy } from './utils.lib'
import { createErrorMap } from './validation/results/createErrorMap.lib'
import { parseIssuesFactory } from './validation/results/parseIssues.lib'
import {
  getValidationErrors,
  isErrorResult,
} from './validation/results/errors.lib'
import {
  createValidationError,
  isSubmitError,
  submitErrorSymbol,
  withSubmitError,
} from './submissionError.lib'
import type { SubmissionInput } from './submissionAttempt.lib'
import type {
  AnyInternalFieldApi,
  InternalFieldValidatorInstance,
} from './FieldApi/FieldApi.lib'
import type {
  InternalFormApi,
  InternalFormValidatorInstance,
} from './FormApi/FormApi.lib'
import type {
  FormSubmitContext,
  SubmitInvalidContext,
} from './FormApi/formSubmit.public'
import type {
  InternalFormGroupApi,
  InternalGroupValidatorInstance,
} from './FormGroupApi/FormGroupApi.lib'
import type { DeepKeys, DeepValue } from './deep-keys.public'
import type { AnyValidatorInstance } from './pipeline/validation/ValidatorInstance.lib'
import type { ClientValidationRun } from './pipeline/validation/clientValidation.lib'
import type {
  FormGroupValidators,
  ToFormGroupOutputs,
} from './pipeline/validation/validation.public'
import type { Awaitable } from './types.public'
import type { ScopedErrorTypes } from './validation/state.public'
import type {
  FormValidationResult,
  FormattedValidationError,
} from './validation/results/results.public'
import type { Atom, ReadonlyAtom } from '@tanstack/store'

type SubmissionContext<TValue> = Omit<
  FormSubmitContext<TValue, Array<unknown>>,
  'formApi'
>

type FieldRuns = Array<
  ClientValidationRun<InternalFieldValidatorInstance> | undefined
>

export interface SubmissionStateAtoms {
  isSubmitting: ReadonlyAtom<boolean>
  isSubmitSuccessful: ReadonlyAtom<boolean>
  submissionAttempts: ReadonlyAtom<number>
}

export type FormSubmissionHandler<TFormData> = SubmissionHandler<
  TFormData,
  InternalFormValidatorInstance
>

export type FormGroupSubmissionHandler<TGroupValue> = SubmissionHandler<
  TGroupValue,
  InternalGroupValidatorInstance
>

/**
 * Connects shared submission handling to form or group validation, callbacks,
 * and error state.
 */
interface SubmissionHandlerAdapter<
  TValue,
  TInstance extends AnyValidatorInstance,
> {
  capture: () => SubmissionInput
  /** Updates owner-specific state in the same batch as attempt registration. */
  onStart?: () => void
  /** Notifies submit listeners before field submit events and validation. */
  notifySubmit?: () => void
  /**
   * Starts form or group submit validation after field validation.
   * `hasFailed` indicates whether field validation produced errors.
   */
  runValidation: (
    submission: SubmissionAttempt<FormattedValidationError<TValue>>,
    hasFailed: boolean,
  ) => ClientValidationRun<TInstance> | undefined
  /**
   * Invokes the configured `onSubmit` callback of the form or form group.
   *
   * You do not need to parse the result, simply forward it.
   */
  onSubmit: (context: SubmissionContext<TValue>) => unknown
  /**
   * Invokes the form or group's `onSubmitInvalid` callback.
   *
   * The returned promise is awaited to settle or rethrow.
   */
  onSubmitInvalid: (
    context: SubmitInvalidContext & { value: TValue },
  ) => Awaitable<void>
  /**
   * Applies the submit error to form or group state, or clears prior submit
   * errors for `null`.
   * Called only while the attempt can still apply validation results.
   */
  applySubmitError: (
    error: FormValidationResult<TValue>,
    submission: SubmissionAttempt<FormattedValidationError<TValue>>,
  ) => void
}

interface SubmissionValidation<TValue> {
  hasFailed: boolean
  errors: Array<FormattedValidationError<TValue>>
  validatorOutputs: Array<unknown>
  exception?: { error: unknown }
}

interface SubmissionOutcome<TError> {
  /** Errors returned to the caller when the attempt completes. */
  errors: Array<TError>
  /** Whether submission succeeded; an empty `errors` array can still mean failure. */
  successful: boolean
}

class SubmissionHandler<TValue, TInstance extends AnyValidatorInstance> {
  private currentSubmission: SubmissionAttempt<
    FormattedValidationError<TValue>
  > | null = null
  private readonly adapter: SubmissionHandlerAdapter<TValue, TInstance>
  private readonly isSubmitting: Atom<boolean>
  private readonly isSubmitSuccessful: Atom<boolean>
  private readonly submissionAttempts: Atom<number>
  readonly atoms: SubmissionStateAtoms

  private readonly finishSubmission: (
    submission: SubmissionAttempt<FormattedValidationError<TValue>>,
    successful: boolean,
  ) => void

  constructor(
    adapter: SubmissionHandlerAdapter<TValue, TInstance>,
    initialSubmissionAttempts = 0,
  ) {
    this.adapter = adapter
    this.submissionAttempts = createAtom(initialSubmissionAttempts)
    this.isSubmitSuccessful = createAtom(false)
    this.isSubmitting = createAtom(false)

    this.atoms = {
      isSubmitting: this.isSubmitting,
      isSubmitSuccessful: this.isSubmitSuccessful,
      submissionAttempts: this.submissionAttempts,
    }

    this.finishSubmission = (submission, successful) => {
      if (this.currentSubmission !== submission) return
      this.currentSubmission = null
      batch(() => {
        this.isSubmitting.set(false)
        this.isSubmitSuccessful.set(successful)
      })
    }
  }

  handleSubmit() {
    const submission = new SubmissionAttempt<FormattedValidationError<TValue>>(
      this.adapter.capture(),
      this.finishSubmission,
    )
    void this.runSubmission(submission).catch((error) => submission.fail(error))
    return submission.promise
  }

  private async runSubmission(
    submission: SubmissionAttempt<FormattedValidationError<TValue>>,
  ): Promise<void> {
    batch(() => {
      const previous = this.currentSubmission
      this.currentSubmission = submission
      previous?.invalidate()
      this.submissionAttempts.set((attempts) => attempts + 1)
      this.isSubmitting.set(true)
      this.adapter.onStart?.()
    })
    if (!submission.isActive()) return
    const validation = await this.validateSubmission(submission)
    if (!submission.beginCallbacks()) return

    const outcome = await this.runSubmissionCallbacks(submission, validation)
    submission.complete(outcome.errors, outcome.successful)
  }

  private async validateSubmission(
    submission: SubmissionAttempt<FormattedValidationError<TValue>>,
  ): Promise<SubmissionValidation<TValue>> {
    const validation: SubmissionValidation<TValue> = {
      hasFailed: false,
      errors: [],
      validatorOutputs: [],
    }

    this.adapter.notifySubmit?.()
    if (!submission.isActive()) return validation

    for (const field of submission.fieldsToNotify) {
      if (!submission.isActive()) return validation
      if (field._isKilled) continue

      field._notifyListener({ trigger: 'submit', seenFields: new WeakSet() })
    }

    try {
      const fieldRuns: FieldRuns = []
      const fieldOutcomes = await Promise.allSettled(
        Array.from(submission.fieldsToValidate.keys(), async (field, index) => {
          if (!submission.isActive()) return

          const run = field._runFieldValidation('submit', {
            catchErrors: false,
            onResult: false,
            submission,
          })

          fieldRuns[index] = run
          await run?.pending
        }),
      )

      if (!submission.isActive()) return validation

      batch(() => {
        let fieldIndex = 0
        for (const [field, snapshot] of submission.fieldsToValidate) {
          // Remember, fieldRuns.length === submission.fieldsToValidate.size
          const run = fieldRuns[fieldIndex]
          fieldIndex++

          if (!run) continue

          for (const result of run.collector.getResults()) {
            if (!submission.canApplyValidationResults()) return

            if (isErrorResult(result.value.result)) {
              validation.hasFailed = true
              validation.errors.push(
                ...getValidationErrors(result.value.result),
              )
            }
            // A value changed during the submission, which would've cleared the error.
            if (Object.is(field.value, snapshot.value)) {
              field._processValidationResult(result, 'submit')
            }
          }
        }
      })

      if (!submission.isActive()) return validation
      for (const outcome of fieldOutcomes) {
        if (outcome.status === 'rejected') throw outcome.reason
      }

      const run = this.adapter.runValidation(submission, validation.hasFailed)
      try {
        await run?.pending
      } finally {
        if (submission.isActive() && run) {
          validation.hasFailed ||= run.collector.hasErrors()

          validation.errors = run.collector
            .getErrors<TValue>()
            .concat(validation.errors)
        }
      }

      if (!submission.isActive() || !run) return validation

      if (!validation.hasFailed) {
        validation.validatorOutputs = run.collector.getOutputs(
          run.validatorCount,
        )
      }
      return validation
    } catch (error) {
      validation.exception = { error }
      return validation
    }
  }

  private async runSubmissionCallbacks(
    submission: SubmissionAttempt<FormattedValidationError<TValue>>,
    validation: SubmissionValidation<TValue>,
  ): Promise<SubmissionOutcome<FormattedValidationError<TValue>>> {
    const finishInvalidSubmission = async (
      failure: Omit<SubmitInvalidContext, 'preventThrow' | 'signal'>,
    ) => {
      const state = { shouldThrow: failure.reason === 'exception' }

      await this.adapter.onSubmitInvalid({
        ...failure,
        value: submission.value,
        signal: submission.signal,
        preventThrow: () => {
          state.shouldThrow = false
        },
      })

      if (state.shouldThrow) throw failure.error

      return { errors: validation.errors, successful: false }
    }

    if (validation.exception) {
      return await finishInvalidSubmission({
        reason: 'exception',
        source: 'validators',
        error: validation.exception.error,
      })
    }
    if (validation.hasFailed) {
      return await finishInvalidSubmission({
        reason: 'validation',
        source: 'validators',
        error: undefined,
      })
    }

    let submitError: FormValidationResult<TValue> = null
    try {
      const maybeError = await this.adapter.onSubmit({
        value: submission.value,
        signal: submission.signal,
        validatorOutputs: validation.validatorOutputs,
        createValidationError,
        createErrorMap: withSubmitError(createErrorMap),
        parseIssues: withSubmitError(
          parseIssuesFactory(submission.value, 'field'),
        ),
      })

      submitError = isSubmitError<TValue>(maybeError)
        ? maybeError[submitErrorSymbol]
        : null
      if (submission.canApplyValidationResults()) {
        this.adapter.applySubmitError(submitError, submission)
      }
    } catch (error) {
      return await finishInvalidSubmission({
        reason: 'exception',
        source: 'onSubmit',
        error,
      })
    }

    if (isErrorResult(submitError)) {
      validation.hasFailed = true
      validation.errors.push(...getValidationErrors(submitError))
    }

    if (validation.hasFailed) {
      return await finishInvalidSubmission({
        reason: 'validation',
        source: 'onSubmit',
        error: undefined,
      })
    }

    return { errors: validation.errors, successful: true }
  }

  /** Detaches the current attempt and clears flags, preserving the attempt count. */
  invalidate(): void {
    batch(() => {
      const submission = this.currentSubmission
      this.currentSubmission = null
      submission?.invalidate()
      this.isSubmitting.set(false)
      this.isSubmitSuccessful.set(false)
    })
  }

  setSubmissionAttempts(attempts: number): void {
    this.submissionAttempts.set(attempts)
  }
}

export function createFormSubmissionHandler<TFormData>(
  form: InternalFormApi<TFormData>,
  initialSubmissionAttempts: number,
): FormSubmissionHandler<TFormData> {
  return new SubmissionHandler<TFormData, InternalFormValidatorInstance>(
    {
      capture: () => {
        const values = form._atoms.values.get()
        return {
          values,
          value: values,
          node: form._fieldRootNode,
          validators: form._validatorInstances,
        }
      },
      notifySubmit: () => form._notifyFormListener('submit', null),
      runValidation: (submission, hasFailed) =>
        form._runFormValidation('submit', {
          catchErrors: false,
          hasFailedBefore: hasFailed,
          submission,
        }),
      onSubmit: (context) =>
        form._options.onSubmit?.({ ...context, formApi: form as never }),
      onSubmitInvalid: (context) =>
        form._options.onSubmitInvalid?.({ ...context, formApi: form }),
      applySubmitError: (error, submission) =>
        form._applyValidationResult({
          sourceOrIndex: form._onSubmitSource,
          result: error,
          sourceEvent: 'submit',
          submission,
        }),
    },
    initialSubmissionAttempts,
  )
}

export function createGroupSubmissionHandler<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormError extends ScopedErrorTypes,
  TSubmitReturn,
>(
  group: InternalFormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormError,
    TSubmitReturn
  >,
): FormGroupSubmissionHandler<TGroupValue> {
  return new SubmissionHandler<TGroupValue, InternalGroupValidatorInstance>({
    capture: () => {
      const values = group.form.state.values
      return {
        values,
        value: getBy(values, group.name),
        node: group._groupField,
        validators: group._validatorInstances,
      }
    },
    onStart: () =>
      group._groupField._setMeta((meta) =>
        meta.isTouched ? meta : { ...meta, isTouched: true },
      ),
    runValidation: (submission, hasFailed) =>
      group._runGroupValidation('submit', {
        catchErrors: false,
        upstreamInvalid: hasFailed,
        submission,
      }),
    onSubmit: (context) =>
      group._options.onSubmit?.({
        ...context,
        validatorOutputs:
          context.validatorOutputs as ToFormGroupOutputs<TGroupValidators>,
        formApi: group.form,
        groupApi: group as never,
      }),
    onSubmitInvalid: (context) =>
      group._options.onSubmitInvalid?.({
        ...context,
        formApi: group.form,
        groupApi: group as never,
      }),
    applySubmitError: (error, submission) =>
      group._applyValidationResult({
        source: group._onSubmitSource,
        result: error,
        sourceEvent: 'submit',
        submission,
      }),
  })
}

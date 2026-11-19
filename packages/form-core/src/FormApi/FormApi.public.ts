import type { ScopedErrorTypes } from '../validation/state.public'
import type {
  FormattedValidationError,
  ValidationIssue,
} from '../validation/results/results.public'
import type { FormApiFieldMethods } from './FormApiFieldMethods.types.public'
import type { FormApiArrayMethods } from './FormApiArrayMethods.types.public'
import type { ReadonlyAtom } from '@tanstack/store'
import type { DynamicValidatorTriggers } from '../pipeline/events.public'

type FormError<TFormError extends ScopedErrorTypes> =
  TFormError extends ScopedErrorTypes<infer TError extends ValidationIssue, any>
    ? TError
    : never

/**
 * Current form values, validation status, and submission metadata.
 *
 * Read the state through `formApi.state`, or subscribe to `formApi.atom` to
 * observe changes.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormError - Library-managed. Do not specify explicitly.
 */
export interface FormState<
  in out TFormData,
  out TFormError extends ScopedErrorTypes,
> {
  /**
   * The current values of the form.
   */
  values: TFormData
  /**
   * Whether at least one field is touched.
   *
   * - Field changes and blurs mark fields touched by default.
   * - Attempting to submit the form touches all fields.
   * - Resetting the form clears touched state.
   */
  isTouched: boolean
  /**
   * Whether a value update has marked the form dirty.
   *
   * - Field changes mark the form dirty by default.
   * - Returning values to their defaults leaves this `true`.
   * - Resetting the form clears this flag.
   * - Use `isDefaultValue` to compare current values with their defaults.
   */
  isDirty: boolean
  /**
   * Whether the form has not been marked dirty. Equivalent to `!isDirty`.
   *
   * Use `isDefaultValue` to compare current values with their defaults.
   */
  isPristine: boolean
  /**
   * Whether current values deeply equal `formApi.defaultValues`.
   *
   * Returning values to their defaults makes this `true` even when `isDirty`
   * remains `true`.
   */
  isDefaultValue: boolean
  /**
   * Form-level validation issues from form validators and `onSubmit`.
   *
   * - Issues are flattened in validator order, with `onSubmit` issues last.
   * - Field and form group errors are exposed through their APIs and excluded
   *   from this array.
   */
  errors: Array<FormError<TFormError>>
  /**
   * Whether the form, its fields, and its form groups have no stored validation
   * errors. Equivalent to `!isInvalid`.
   *
   * - Validation does not need to have run for this to be `true`.
   * - Field `errorVisibility` does not affect this flag.
   */
  isValid: boolean
  /**
   * Whether the form, a field, or a form group has a stored validation error.
   * Equivalent to `!isValid`.
   *
   * Field `errorVisibility` does not affect this flag.
   */
  isInvalid: boolean
  /**
   * Whether the form has no stored validation errors and no submission is in
   * progress. Equivalent to `isValid && !isSubmitting`.
   *
   * - Defaults to `true`, even when no values have changed. Check `isPristine` separately if submission requires edited values.
   * - Pending validation alone does not make this `false`. Use `isValidating` for that instead.
   *
   * @remarks
   * **Important:** `formApi.handleSubmit()` remains callable when this is `false`.
   * Submission runs all field and form validators by default unless they set `skipOnSubmit`.
   */
  canSubmit: boolean
  /**
   * Whether a form submission is in progress.
   *
   * This includes validation and waiting for `onSubmit` or `onSubmitInvalid`
   * to finish.
   */
  isSubmitting: boolean
  /**
   * Whether the last completed form submission succeeded.
   *
   * Success requires validation to pass and `onSubmit` to finish without
   * validation errors or exceptions.
   *
   * - The previous result remains while a new attempt runs.
   * - Superseded or canceled attempts cannot update this flag.
   * - The flag starts as `false`. Resetting or unmounting the form clears it.
   */
  isSubmitSuccessful: boolean
  /**
   * Whether any form, form group, or field validation is pending.
   *
   * This remains `true` until all pending validation finishes or is canceled.
   * Pending validation alone does not make `canSubmit` `false`.
   */
  isValidating: boolean
  /**
   * Number of form submission attempts recorded, including failed or canceled
   * attempts.
   *
   * - Each `handleSubmit()` call increments the count before validation.
   * - `formApi.reset()` sets the count to `0`.
   * - Form group submissions do not increment this count.
   */
  submissionAttempts: number
}

/**
 * A form API whose form data and error types are erased.
 *
 * Use it for reusable helpers that read shared form state, such as `isDirty`
 * or `isSubmitting`, without depending on a specific form shape.
 *
 * @remarks
 * **Important:** Field paths and values are not checked against a particular
 * form shape.
 */
export type AnyFormApi = FormApi<any, any>

/**
 * Controls whether {@link FormApi.reset | reset} replaces the form's default
 * values when new values are supplied.
 */
export interface FormResetOptions {
  /**
   * Whether the values supplied to `reset` also replace the form's `defaultValues`.
   *
   * When `false`, the form preserves the existing defaults.
   * `isDefaultValue` and later `form.reset()` calls use those existing `defaultValues`.
   *
   * This option has no effect when reset values are omitted.
   *
   * @default true
   */
  updateDefaultValues?: boolean
}

/**
 * Validates the form and calls `onSubmit` when validation succeeds.
 *
 * - A submission attempt touches all fields.
 * - Runs field validators before form validators.
 * - Awaits `onSubmit` or, after a failed attempt, `onSubmitInvalid`.
 * - Each call starts a separate attempt and supersedes the form's pending attempt.
 *   Later edits do not cancel the attempt or replace its captured values.
 * - Exceptions from validation or `onSubmit` reject the promise unless
 *   `onSubmitInvalid` calls `preventThrow()`.
 *
 * @remarks
 * **Important:** An empty error array does not guarantee a successful submission.
 * Supersession, reset, unmount, or server-state replacement aborts the attempt's
 * signal and pending validation. Cancellation before callbacks start resolves
 * with `[]`. Callbacks that already started are still awaited, but their results
 * cannot update form state after cancellation.
 *
 * @returns A promise resolving to a flat array of issues and error maps from
 * field and form validation, plus validation errors returned by `onSubmit`.
 * Strings become issue objects. The array is empty if no errors are produced.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type HandleSubmitFn<in out TFormData> = () => Promise<
  Array<FormattedValidationError<TFormData>>
>

/**
 * Resets form values, field metadata, validation errors, and submission state.
 *
 * - Omitting `values` restores the current `defaultValues`.
 * - Supplying `values` also replaces `defaultValues` unless
 *   `opts.updateDefaultValues` is `false`.
 * - Results from pending validation and submission cannot update the reset state.
 *
 * @remarks
 * **Important:** Reset aborts submission signals but does not wait for callbacks
 * that already started. Their submission promises still settle with the
 * callbacks' results or exceptions.
 *
 * @param values - Replacement values for the entire form.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type ResetFn<in out TFormData> = (
  values?: TFormData,
  opts?: FormResetOptions,
) => void

export interface FormApi<
  in out TFormData,
  // TODO in out?
  TFormError extends ScopedErrorTypes,
>
  extends FormApiFieldMethods<TFormData>, FormApiArrayMethods<TFormData> {
  /**
   * Read-only atom containing reactive `FormState` snapshots.
   *
   * Subscribe to this atom to observe state changes. For an imperative read,
   * use `state`.
   */
  atom: ReadonlyAtom<FormState<TFormData, TFormError>>
  /** Current values, validation status, and submission metadata. */
  readonly state: FormState<TFormData, TFormError>
  /** The current baseline values used by `reset()` and `isDefaultValue`. */
  readonly defaultValues: TFormData
  /**
   * Stable identifier supplied by `FormOptions.formId` or generated at
   * creation.
   *
   * It is preserved across option updates until a new `formId` is supplied.
   */
  readonly formId: string

  /**
   * Runs form-level validators enabled for the specified `'change'` or
   * `'blur'` trigger.
   *
   * Prefer configured validator triggers for change and blur validation, and
   * use `handleSubmit()` for submission validation. Calling this method
   * directly is rarely necessary.
   *
   * Results update form-level errors and any errors routed to fields.
   * Field-level validators are not run by this method.
   *
   * @param signal - The trigger used to select validators.
   * @returns A promise resolving to a flat array of issues and error maps from
   * the validators that ran. Strings become issue objects; error maps retain
   * their field paths.
   */
  validate: (
    signal: DynamicValidatorTriggers,
  ) => Promise<Array<FormattedValidationError<TFormData>>>

  /**
   * Runs submission validation and submits current values when validation
   * succeeds.
   *
   * A submission attempt touches all fields.
   *
   * Field validators run before form validators, and `onSubmit` is awaited only
   * when validation succeeds.
   * Validation error results and errors returned by `onSubmit` through
   * `createValidationError` or `createErrorMap` are stored as error state.
   * `onSubmitInvalid` is awaited after a failed attempt.
   * Exceptions reject after submission state is cleaned up, unless
   * `onSubmitInvalid` calls `preventThrow()`.
   *
   * Each call starts a fresh attempt with its own promise and captured values,
   * superseding the form's pending attempt. Later edits do not cancel it or
   * replace its captured values. Group submissions remain independent.
   *
   * Supersession, reset, unmount, or server-state replacement aborts the attempt's
   * callback signal and pending validation. Cancellation before callbacks start
   * resolves with `[]`. Callbacks already started are still awaited with normal
   * error handling, while their results cannot update form state. Submission
   * state tracks only the current attempt.
   *
   * The returned promise resolves to a flat array of issues and error maps
   * from field and form validation, plus errors returned by `onSubmit` through
   * its validation helpers. Strings become issue objects. The array is empty
   * if no errors are produced.
   */
  handleSubmit: HandleSubmitFn<TFormData>
  /**
   * Reset form values, metadata, validation state, and mounted fields.
   *
   * `reset()` restores the current `defaultValues`.
   *
   * `reset(values)` sets the current values and also updates `defaultValues`
   * to those values. This can apply expected values immediately while fresh
   * data is fetched from the backend.
   *
   * Results from validation or submission work pending at reset are discarded.
   *
   * Pass `{ updateDefaultValues: false }` as the options argument to preserve
   * the existing `defaultValues` when supplying values.
   */
  reset: ResetFn<TFormData>
}

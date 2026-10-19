import type { ReadonlyAtom } from '@tanstack/store'
import type { FormApiArrayMethods } from './FormApiArrayMethods.types.public'
import type { FormApiFieldMethods } from './FormApiFieldMethods.types.public'
import type {
  FormValidationFailure,
  ScopedErrorTypes,
} from '../validation/state.public'
import type { DynamicValidatorTriggers } from '../events.public'

/**
 * A snapshot of current values, validation status, and submission metadata.
 *
 * Read the latest snapshot from `formApi.state` or subscribe to
 * `formApi.atom`.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export interface FormState<
  in out TFormData,
  // TODO in out
  TFormError extends ScopedErrorTypes,
> {
  /**
   * Current values after field edits, resets, or default-value updates.
   */
  values: TFormData
  /**
   * Whether at least one field is currently touched.
   *
   * Field changes mark fields as touched by default, and submission marks all
   * registered fields as touched. Resets clear the touched state.
   */
  isTouched: boolean
  /**
   * Whether a value update has marked state as dirty.
   *
   * This records whether a dirty-marking update has occurred, not whether
   * current values match their defaults. Once `true`, it remains `true` even if
   * values return to their defaults. `formApi.reset()` clears it.
   *
   * * Equivalent to `!isPristine`.
   * * Use `isDefaultValue` to check whether current values match their defaults.
   */
  isDirty: boolean
  /**
   * Whether state has not been marked dirty.
   *
   * This records whether a dirty-marking update has occurred, not whether
   * current values match their defaults. Once `false`, it remains `false` even
   * if values return to their defaults. `formApi.reset()` restores it.
   *
   * * Equivalent to `!isDirty`.
   * * Use `isDefaultValue` to check whether current values match their defaults.
   */
  isPristine: boolean
  /**
   * Whether current values deeply match `formApi.defaultValues`.
   *
   * Unlike `isDirty` and `isPristine`, this compares current values with their
   * defaults rather than tracking whether edits have occurred. Reverting an
   * edit can make it `true` while `isDirty` remains `true`.
   */
  isDefaultValue: boolean
  /**
   * Form-level errors from validators and `onSubmit`.
   *
   * Errors are flattened in validator order, with `onSubmit` errors last.
   * Errors routed to fields are exposed through the corresponding field APIs
   * and are not included here.
   */
  errors: Array<TFormError['selfError']>
  /**
   * Whether validation state contains no form- or field-level errors.
   *
   * * Equivalent to `!isInvalid`.
   * * A field error hidden by `errorVisibility` still makes this `false`.
   */
  isValid: boolean
  /**
   * Whether validation state contains at least one form- or field-level error.
   *
   * This is the exact inverse of `isValid`. Field `errorVisibility` does not
   * affect it.
   *
   * * Equivalent to `!isValid`.
   */
  isInvalid: boolean
  /**
   * Whether no submission is running and validation state has no known errors.
   *
   * This is optimistic: validation does not need to have run, and pending
   * validation alone does not make it `false`. `handleSubmit()` still runs
   * submission validation.
   *
   * * Equivalent to `isValid && !isSubmitting`.
   */
  canSubmit: boolean
  /**
   * Whether a submission attempt is in progress.
   *
   * This includes submission validation and the time spent awaiting `onSubmit`
   * or `onSubmitInvalid`.
   */
  isSubmitting: boolean
  /**
   * Whether the latest completed submission finished without validation errors
   * or an `onSubmit` failure.
   *
   * It starts as `false`, updates when an attempt finishes, and is cleared by
   * `formApi.reset()`.
   */
  isSubmitSuccessful: boolean
  /**
   * Whether any form-, group-, or field-level validation is pending.
   *
   * It remains `true` until all concurrent validation work finishes or is
   * canceled. Pending validation does not by itself make `canSubmit` `false`.
   */
  isValidating: boolean
  /**
   * Number of submission attempts started since the last reset.
   *
   * An attempt is counted before validation begins, whether it succeeds or
   * fails. `formApi.reset()` returns the count to `0`.
   */
  submissionAttempts: number
}

/**
 * A core form API whose value and error types are erased.
 *
 * Use it for reusable helpers that only need operations shared by every form.
 * Field paths and values are not type-checked through this alias, and it does
 * not include component helpers added by a framework adapter.
 */
export type AnyFormApi = FormApi<any, any>

/**
 * Options controlling whether `reset(values)` replaces the default-value
 * baseline.
 *
 * @example
 * ```ts
 * formApi.reset(savedValues, { updateDefaultValues: false })
 * ```
 */
export interface FormResetOptions {
  /**
   * Whether `reset(values)` should also update the form's `defaultValues`
   * baseline.
   *
   * By default, passing values to `reset` treats those values as the new reset
   * baseline. Future `reset()` calls will return to those values, and
   * `state.isDefaultValue` will compare against them.
   *
   * Set this to `false` when you want reset semantics for form state
   * (clearing touched, dirty, validation, submission state, and mounted fields)
   * but want to keep comparing against the previous `defaultValues`.
   *
   * With `updateDefaultValues: false`, `state.isDirty` is reset to `false`,
   * but `state.isDefaultValue` may be `false` if the provided reset values do
   * not deeply equal the preserved defaults.
   *
   * This option is ignored when no reset values are provided.
   *
   * @example
   * ```ts
   * const originalDefaults = formApi.defaultValues
   *
   * formApi.reset(savedDraft, { updateDefaultValues: false })
   * // `savedDraft` is current, but `originalDefaults` remains the baseline.
   *
   * formApi.reset()
   * // Restores `originalDefaults`, not `savedDraft`.
   * ```
   */
  updateDefaultValues?: boolean
}

/**
 * Runs submission validation and submits current values when validation
 * succeeds.
 *
 * Registered fields are marked touched, field validators run before form
 * validators, and `onSubmit` is awaited only when validation succeeds.
 * Validation error results and errors returned by `onSubmit` through
 * `createValidationError` or `createErrorMap` are stored as error state.
 * `onSubmitInvalid` is awaited after a failed attempt.
 *
 * Calls made while an attempt is in progress return the same promise instead
 * of starting another attempt.
 *
 * @returns A promise resolving to the error results produced by field and
 * form validation, plus any validation error returned by `onSubmit` through
 * `createValidationError` or `createErrorMap`. The array is empty if none are
 * produced.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type HandleSubmitFn<in out TFormData> = () => Promise<
  Array<FormValidationFailure<TFormData>>
>

/**
 * Resets form values, metadata, validation state, and mounted fields.
 *
 * Calling without values restores the current `defaultValues`. Supplying
 * values sets the current values and also updates `defaultValues` to those
 * values. This can apply expected values immediately while fresh data is
 * fetched from the backend.
 *
 * Results from validation or submission work pending at reset are discarded.
 *
 * @param values - Values to apply, or omit to restore `defaultValues`.
 * @param opts - Options controlling whether supplied values replace
 * `defaultValues`.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type ResetFn<in out TFormData> = (
  values?: TFormData,
  opts?: FormResetOptions,
) => void

/**
 * Core API for reading and updating state, validating values, and handling
 * submission.
 *
 * Framework adapters compose this interface with framework-specific helpers.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
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
  atom: ReadonlyAtom<FormState<TFormData, ScopedErrorTypes>>
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
   * @returns A promise resolving to each error result from the validators that
   * ran. Unlike `state.errors`, these results are not flattened.
   */
  validate: (
    signal: DynamicValidatorTriggers,
  ) => Promise<Array<FormValidationFailure<TFormData>>>

  /**
   * Runs submission validation and submits current values when validation
   * succeeds.
   *
   * Registered fields are marked touched, field validators run before form
   * validators, and `onSubmit` is awaited only when validation succeeds.
   * Validation error results and errors returned by `onSubmit` through
   * `createValidationError` or `createErrorMap` are stored as error state.
   * `onSubmitInvalid` is awaited after a failed attempt.
   *
   * Calls made while an attempt is in progress return the same promise instead
   * of starting another attempt.
   *
   * The returned promise resolves to the error results produced by field and
   * form validation, plus any validation error returned by `onSubmit` through
   * `createValidationError` or `createErrorMap`. The array is empty if none are
   * produced.
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

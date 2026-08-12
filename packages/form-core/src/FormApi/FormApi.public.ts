import type { ReadonlyAtom } from '@tanstack/store'
import type {
  ConfigurableValidationTrigger,
  ErrorVisibility,
  FormErrorTypes,
  FormErrors,
  FormValidationError,
  FormValidators,
  ParsedStandardSchemaIssues,
  ToFormErrorTypes,
  ToFormSchemaOutputs,
} from '../validation.public'
import type { StandardSchemaV1Issue } from '../standardSchema.public'
import type { FormListeners } from '../listeners.public'
import type { FormApiArrayMethods } from './FormApiArrayMethods.types.public'
import type { FormApiFieldMethods } from './FormApiFieldMethods.types.public'
import type { ServerFormState } from '../ssr.public'

declare const onSubmitErrorBrand: unique symbol

/**
 * A validation error marked for processing as an `onSubmit` failure.
 *
 * Create this value with the `createValidationError` or `parseIssues` helper
 * provided to `onSubmit`, then return it from the callback so its form- and
 * field-level errors are added to validation state.
 *
 * @example
 * ```ts
 * formOptions({
 *   defaultValues: { name: '' },
 *   onSubmit: async ({ value, createValidationError }) => {
 *     const result = await saveUser(value)
 *
 *     if (!result.ok) {
 *       return createValidationError(result.error)
 *     }
 *   },
 * })
 * ```
 *
 * @typeParam TFormValidationError - Library-managed. Do not specify explicitly.
 */
export type OnSubmitError<
  TFormValidationError extends FormValidationError<any>,
> = TFormValidationError & {
  /** Internal brand used to identify submit errors. Do not access directly. */
  [onSubmitErrorBrand]: true
}

/**
 * Marks a validation error for processing as an `onSubmit` failure.
 *
 * Return the result from `onSubmit` to add its form- and field-level errors to
 * validation state.
 *
 * @param error - The form- or field-level validation error to mark.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TError - Library-managed. Do not specify explicitly.
 */
export type CreateValidationErrorFn<in out TFormData> = <
  TError extends FormValidationError<TFormData>,
>(
  error: TError,
) => OnSubmitError<TError>

/**
 * Converts Standard Schema issues into an `onSubmit` validation error.
 *
 * Issue paths are mapped to fields in the submitted value. Return the result
 * from `onSubmit` to add the parsed errors to validation state.
 *
 * @param issues - The Standard Schema issues to convert.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type ParseSubmitIssuesFn<in out TFormData> = (
  issues: ReadonlyArray<StandardSchemaV1Issue>,
) => OnSubmitError<ParsedStandardSchemaIssues<TFormData>>

/**
 * Context passed to `onSubmit` after submission validation succeeds.
 *
 * @example
 * ```ts
 * {
 *   // ...
 *   onSubmit: async ({ value, createValidationError }) => {
 *     const result = await saveUser(value)
 *
 *     if (!result.ok) {
 *       return createValidationError(result.error)
 *     }
 *   },
 * }
 * ```
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TSchemaOutputs - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export interface FormSubmitContext<
  in out TFormData,
  out TSchemaOutputs,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  /** The form values for this submission. */
  value: TFormData
  /** The form API handling this submission. */
  formApi: FormApi<TFormData, TFormErrorTypes>
  /**
   * The submit outputs produced by the form's schema validators, ordered by
   * validator index.
   *
   * @example
   * ```ts
   * {
   *   // ...
   *   onSubmit: async ({ schemaOutputs }) => {
   *     const validatedUser = schemaOutputs[0]
   *     await saveUser(validatedUser)
   *   },
   * }
   * ```
   */
  schemaOutputs: TSchemaOutputs
  /**
   * Creates a validation error that can be returned from `onSubmit`.
   *
   * Return the created error from `onSubmit` to add its form- and field-level
   * errors to validation state.
   *
   * @example
   * ```ts
   * {
   *   // ...
   *   onSubmit: async ({ value, createValidationError }) => {
   *     const result = await saveUser(value)
   *
   *     if (result.status === 409) {
   *       return createValidationError({
   *         form: 'A user with this email already exists',
   *         fields: {},
   *       })
   *     }
   *   },
   * }
   * ```
   */
  createValidationError: CreateValidationErrorFn<TFormData>
  /**
   * Parses Standard Schema issues into an error returnable from `onSubmit`.
   *
   * Issue paths are mapped to fields in the submitted value. Return the parsed
   * error from `onSubmit` to add those errors to validation state.
   *
   * @example
   * ```ts
   * {
   *   // ...
   *   onSubmit: async ({ value, parseIssues }) => {
   *     const result = zodSchema.safeParse(value)
   *
   *     if (!result.success) {
   *       return parseIssues(result.error.issues)
   *     }
   *   },
   * }
   * ```
   */
  parseIssues: ParseSubmitIssuesFn<TFormData>
}

/**
 * Context passed to `onSubmitInvalid` when a submission fails.
 *
 * @example
 * ```ts
 * {
 *   // ...
 *   onSubmitInvalid: () => {
 *     document
 *       .querySelector<HTMLElement>('[aria-invalid="true"]')
 *       ?.focus()
 *   },
 * }
 * ```
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormErrorTypes - Library-managed. Do not specify explicitly.
 */
export interface FormSubmitInvalidContext<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  /** The form values for the failed submission. */
  value: TFormData
  /** The form API handling the failed submission. */
  formApi: FormApi<TFormData, TFormErrorTypes>
}

/**
 * Form options whose data, validator, and submission return types are erased.
 *
 * Use this alias only when reusable code does not need type-safe access to
 * values, validators, or submission results.
 */
export type AnyFormOptions = FormOptions<any, any, any>

/**
 * Configures initial values, validation, listeners, and submission.
 *
 * Pass these options to a framework adapter's form creation API. Use
 * `formOptions` when declaring them separately so data and validator types
 * remain inferred.
 *
 * @example
 * ```ts
 * const profileFormOptions = formOptions({
 *   defaultValues: { name: '' },
 *   onSubmit: async ({ value }) => {
 *     await saveProfile(value)
 *   },
 * })
 * ```
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
 * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
 */
export interface FormOptions<
  in out TFormData,
  in out TFormValidators extends FormValidators<TFormData>,
  in out TSubmitReturn,
> {
  /**
   * A stable identifier for this form.
   *
   * When omitted, an identifier is generated and preserved across option
   * updates until a new `formId` is supplied. Read the supplied or generated
   * identifier from `formApi.formId`.
   */
  formId?: string
  /**
   * Initial values and the source of the inferred data shape.
   *
   * They also define the reset baseline and what `isDefaultValue` compares
   * against.
   *
   * **Async initial values:** The passed value may change over time. While data
   * is loading, pass fallback values containing the complete data shape, then
   * pass the resolved values when they become available.
   *
   * When this option changes, untouched top-level values adopt the new defaults
   * while values under touched top-level fields are preserved.
   */
  defaultValues: TFormData
  /**
   * Controls when fields expose validation errors through public state.
   *
   * This is the default policy for every field. A field can override it with a field-level
   * `errorVisibility` option.
   *
   * When omitted, errors are always exposed.
   *
   * @example
   * ```ts
   * errorVisibility: ({ state, fieldState }) =>
   *   fieldState.meta.isBlurred || state.submissionAttempts > 0,
   * ```
   */
  errorVisibility?: ErrorVisibility<
    TFormData,
    ToFormErrorTypes<TFormValidators, unknown>
  >
  /**
   * An ordered pipeline of form-level validators.
   *
   * Validators run for their configured triggers and, by default, during
   * submission. Keep the array length stable after initialization so
   * validator-indexed errors and schema outputs remain aligned.
   *
   * @example
   * ```ts
   * validators: [
   *   {
   *     triggers: ['change'],
   *     run: ({ value, createErrorMap }) => {
   *       if (value.name) {
   *         return null
   *       }
   *
   *       return createErrorMap({ fields: { name: 'Name is required' } })
   *     },
   *   },
   * ],
   * ```
   */
  validators?: TFormValidators
  /**
   * Listener configurations for change, blur, submit, mount, and reset events.
   *
   * Matching listeners are evaluated in array order. Their return values are
   * ignored, and returned promises are not awaited.
   *
   * @example
   * ```ts
   * listeners: [
   *   {
   *     triggers: ['change'],
   *     triggerDebounceMs: 200,
   *     run: ({ value }) => {
   *       saveDraft(value)
   *     },
   *   },
   * ],
   * ```
   */
  listeners?: FormListeners<
    TFormData,
    ToFormErrorTypes<TFormValidators, unknown>
  >
  /**
   * Server-validation state supplied by a server or SSR adapter during
   * hydration.
   *
   * Pass a failed result's `serverState` through unchanged. Constructing or
   * mutating this state directly is discouraged.
   *
   * @example
   * ```ts
   * serverState: failedResult.serverState,
   * ```
   */
  serverState?: ServerFormState<
    NoInfer<TFormData>,
    NoInfer<TFormValidators>
  > | null
  /**
   * Called after submission validation succeeds.
   *
   * Return an error created with `createValidationError` or `parseIssues` to
   * mark the submission as invalid. A returned promise is awaited before
   * submission finishes. If the callback throws, `onSubmitInvalid` is called.
   *
   * @example
   * ```ts
   * {
   *   // ...
   *   onSubmit: async ({ value }) => {
   *     await saveUser(value)
   *   },
   * }
   * ```
   */
  onSubmit?: (
    context: FormSubmitContext<
      TFormData,
      ToFormSchemaOutputs<TFormValidators>,
      ToFormErrorTypes<TFormValidators, unknown>
    >,
  ) => TSubmitReturn
  /**
   * Called after an invalid submission is detected.
   *
   * This includes validation failures, errors returned from `onSubmit`, and
   * exceptions thrown during validation or submission. A returned promise is
   * awaited before submission finishes.
   *
   * @example
   * ```ts
   * {
   *   // ...
   *   onSubmitInvalid: () => {
   *     document
   *       .querySelector<HTMLElement>('[aria-invalid="true"]')
   *       ?.focus()
   *   },
   * }
   * ```
   */
  onSubmitInvalid?: (
    context: FormSubmitInvalidContext<
      TFormData,
      ToFormErrorTypes<TFormValidators, unknown>
    >,
  ) => void | Promise<void>
}

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
  in out TFormErrorTypes extends FormErrorTypes,
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
  errors: FormErrors<TFormErrorTypes>
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
 * `createValidationError` are stored as error state. `onSubmitInvalid` is
 * awaited after a failed attempt.
 *
 * Calls made while an attempt is in progress return the same promise instead
 * of starting another attempt.
 *
 * @returns A promise resolving to the error results produced by field and
 * form validation, plus any validation error returned by `onSubmit` through
 * `createValidationError`. The array is empty if none are produced.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type HandleSubmitFn<in out TFormData> = () => Promise<
  Array<FormValidationError<TFormData>>
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
  in out TFormErrorTypes extends FormErrorTypes,
>
  extends FormApiFieldMethods<TFormData>, FormApiArrayMethods<TFormData> {
  /**
   * Read-only atom containing reactive `FormState` snapshots.
   *
   * Subscribe to this atom to observe state changes. For an imperative read,
   * use `state`.
   */
  atom: ReadonlyAtom<FormState<TFormData, TFormErrorTypes>>
  /** Current values, validation status, and submission metadata. */
  readonly state: FormState<TFormData, TFormErrorTypes>
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
    signal: ConfigurableValidationTrigger,
  ) => Promise<Array<FormValidationError<TFormData>>>

  /**
   * Runs submission validation and submits current values when validation
   * succeeds.
   *
   * Registered fields are marked touched, field validators run before form
   * validators, and `onSubmit` is awaited only when validation succeeds.
   * Validation error results and errors returned by `onSubmit` through
   * `createValidationError` are stored as error state. `onSubmitInvalid` is
   * awaited after a failed attempt.
   *
   * Calls made while an attempt is in progress return the same promise instead
   * of starting another attempt.
   *
   * The returned promise resolves to the error results produced by field and
   * form validation, plus any validation error returned by `onSubmit` through
   * `createValidationError`. The array is empty if none are produced.
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

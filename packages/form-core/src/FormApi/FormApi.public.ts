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

export type OnSubmitError<
  TFormValidationError extends FormValidationError<any>,
> = TFormValidationError & {
  [onSubmitErrorBrand]: true
}

export type CreateValidationErrorFn<in out TFormData> = <
  TError extends FormValidationError<TFormData>,
>(
  error: TError,
) => OnSubmitError<TError>

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
   * @example
   * ```ts
   * {
   *   // ...
   *   onSubmit: async ({ value, parseIssues }) => {
   *     const result = await saveUser(value)
   *
   *     if (!result.ok) {
   *       return parseIssues(result.issues)
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

export type AnyFormOptions = FormOptions<any, any, any>

export interface FormOptions<
  in out TFormData,
  in out TFormValidators extends FormValidators<TFormData>,
  in out TSubmitReturn,
> {
  formId?: string
  defaultValues: TFormData
  errorVisibility?: ErrorVisibility<
    TFormData,
    ToFormErrorTypes<TFormValidators, unknown>
  >
  validators?: TFormValidators
  listeners?: FormListeners<
    TFormData,
    ToFormErrorTypes<TFormValidators, unknown>
  >
  serverState?: ServerFormState<
    NoInfer<TFormData>,
    NoInfer<TFormValidators>
  > | null
  /**
   * Called after submission validation succeeds.
   *
   * Return an error created with `createValidationError` or `parseIssues` to
   * mark the submission as invalid.
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
   * Called when validation fails, `onSubmit` returns an error, or validation
   * or submission throws. The callback is awaited before submission finishes.
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

export interface FormState<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  /**
   * The current values of the form.
   */
  values: TFormData
  /**
   * Whether the form has been touched.
   */
  isTouched: boolean
  /**
   * Whether the form has been dirtied. The opposite of `isPristine`.
   *
   * TODO add link to persistent dirty model? Or maybe a reference to isDefaultValue?
   */
  isDirty: boolean
  /**
   * Whether the form has not yet been dirtied. The opposite of `isDirty`.
   */
  isPristine: boolean
  /**
   * Whether the current form values are deeply equal to the default values.
   */
  isDefaultValue: boolean
  /**
   * Array of form-level validation errors.
   */
  errors: FormErrors<TFormErrorTypes>
  /**
   * Whether the form currently has no form-level or field-level errors.
   */
  isValid: boolean
  /**
   * Whether the form currently has form-level or field-level errors.
   */
  isInvalid: boolean
  /**
   * Whether the form can currently be submitted.
   *
   * This is an optimistic button affordance: `true` until validation has found
   * errors, then `false` while errors are known or the form is submitting.
   */
  canSubmit: boolean
  /**
   * Whether the form is currently in the process of submitting.
   *
   */
  isSubmitting: boolean
  /**
   * Whether the latest submission completed without validation or submit errors.
   */
  isSubmitSuccessful: boolean
  /**
   * Whether the form, any form group, or any field is currently validating.
   */
  isValidating: boolean
  /**
   * The number of times a submission has been attempted, regardless of its success.
   *
   * If the form is reset, this will revert back to 0.
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
   */
  updateDefaultValues?: boolean
}

export interface FormApi<
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
>
  extends FormApiFieldMethods<TFormData>, FormApiArrayMethods<TFormData> {
  atom: ReadonlyAtom<FormState<TFormData, TFormErrorTypes>>
  readonly state: FormState<TFormData, TFormErrorTypes>
  /** The current baseline values used by `reset()` and `isDefaultValue`. */
  readonly defaultValues: TFormData
  readonly formId: string

  /**
   * TODO expand on it
   *
   * Validates with the given validation signal and returns
   * errors if they appeared. It will automatically populate the
   * form's error state.
   */
  validate: (
    signal: ConfigurableValidationTrigger,
  ) => Promise<Array<FormValidationError<TFormData>>>

  /**
   * TODO for later: submit meta
   *
   */
  handleSubmit: () => Promise<Array<FormValidationError<TFormData>>>
  /**
   * Reset form values, metadata, validation state, and mounted fields.
   *
   * `reset()` restores the current `defaultValues`.
   *
   * `reset(values)` sets the current values and also updates `defaultValues`
   * to those values.
   *
   * `reset(values, { updateDefaultValues: false })` sets the current values
   * while preserving the previous `defaultValues` baseline.
   */
  reset: (values?: TFormData, opts?: FormResetOptions) => void
}

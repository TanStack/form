import type {
  ScopedErrorTypes,
  ToFormGroupErrorTypes,
} from '../validation/state.public'
import type { FormApi } from '../FormApi/FormApi.public'
import type {
  FormSubmitContext,
  SubmitInvalidContext,
} from '../FormApi/formSubmit.public'
import type {
  FormGroupValidator,
  FormGroupValidators,
  ToFormGroupOutputs,
} from '../pipeline/validation/validation.public'
import type { Awaitable } from '../types.public'
import type { ReadonlyAtom } from '@tanstack/store'
import type { DynamicValidatorTriggers } from '../pipeline/events.public'
import type { FormattedValidationError } from '../validation/results/results.public'

/**
 * Context passed to a form group's `onSubmit` after group validation succeeds.
 *
 * @example
 * ```ts
 * {
 *   // ...
 *   onSubmit: async ({ value }) => {
 *     await saveGuestDetails(value)
 *   },
 * }
 * ```
 */
export interface FormGroupSubmitContext<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  out TOutputs,
  in out TGroupError extends ScopedErrorTypes,
  in out TFormError extends ScopedErrorTypes,
> extends Pick<
  FormSubmitContext<TGroupValue, readonly unknown[]>,
  'createValidationError' | 'createErrorMap' | 'parseIssues'
> {
  /** The group values for this submission. */
  value: TGroupValue
  /** The parent form API handling this submission. */
  formApi: FormApi<TFormData, TFormError>
  /** The group API handling this submission. */
  groupApi: FormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupError,
    TFormError
  >
  /**
   * Schema outputs and `createOutput` payloads from this group submission,
   * ordered by validator index. Skipped validators and successful returns
   * without an output contribute `undefined`.
   *
   * @example
   * ```ts
   * {
   *   // ...
   *   onSubmit: async ({ validatorOutputs }) => {
   *     const validatedGuestDetails = validatorOutputs[0]
   *     setStep(step => step + 1)
   *   },
   * }
   * ```
   */
  validatorOutputs: TOutputs
}

/**
 * Context passed to a form group's `onSubmitInvalid` when submission fails.
 *
 * @example
 * ```ts
 * {
 *   // ...
 *   onSubmitInvalid: ({ groupApi }) => {
 *     document
 *       .querySelector<HTMLElement>('[aria-invalid="true"]')
 *       ?.focus()
 *   },
 * }
 * ```
 */
export interface FormGroupSubmitInvalidContext<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
  in out TFormError extends ScopedErrorTypes,
> extends SubmitInvalidContext {
  /** The group values for the failed submission. */
  value: TGroupValue
  /** The parent form API handling the failed submission. */
  formApi: FormApi<TFormData, TFormError>
  /** The group API handling the failed submission. */
  groupApi: FormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupError,
    TFormError
  >
}

export type FormGroupSubmitFn<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidators<TGroupValue>,
  in out TFormError extends ScopedErrorTypes,
  out TSubmitReturn,
> = (
  context: FormGroupSubmitContext<
    TFormData,
    TGroupName,
    TGroupValue,
    ToFormGroupOutputs<NoInfer<TGroupValidators>>,
    ToFormGroupErrorTypes<NoInfer<TGroupValidators>, never>,
    TFormError
  >,
) => TSubmitReturn

/**
 * Handles validation failures and exceptions during a form group submission.
 *
 * Runs for errors reported by field or form group validators, validation errors
 * returned from `onSubmit` using its error helpers, and exceptions thrown or
 * rejected during either stage. A returned promise is awaited before
 * `handleSubmit()` settles.
 *
 * @remarks
 * **Important:** Setting this callback does not suppress exceptions.
 * Call `preventThrow()` to prevent the submission's exception from rejecting
 * `handleSubmit()`. Exceptions caused in this callback are not caught.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TGroupName - Library-managed. Do not specify explicitly.
 * @typeParam TGroupValue - Library-managed. Do not specify explicitly.
 * @typeParam TGroupError - Library-managed. Do not specify explicitly.
 * @typeParam TFormError - Library-managed. Do not specify explicitly.
 *
 * @example
 * ```ts
 * {
 *   // ...
 *   onSubmitInvalid: ({ preventThrow }) => {
 *     preventThrow()
 *     // Focus the first element marked as invalid.
 *     document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
 *   },
 * }
 * ```
 */
export type FormGroupOnSubmitInvalidFn<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupError extends ScopedErrorTypes,
  TFormError extends ScopedErrorTypes,
> = (
  context: FormGroupSubmitInvalidContext<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupError,
    TFormError
  >,
) => Awaitable<void>

export interface FormGroupOptions<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidators<TGroupValue>,
  in out TFormError extends ScopedErrorTypes,
  in out TSubmitReturn = void,
> {
  form: FormApi<TFormData, TFormError>
  name: TGroupName

  // FormOptions-style inference from each validator's triggers could be added
  // here. If so, we should think about the firing timing of them. Could go with a form approach.

  validators?: {
    // The intersection really helps type instantiations, while
    // the exclude part helps with additional properties not being swallowed silently.
    // It's weird, but it works.
    [K in keyof TGroupValidators]: TGroupValidators[K] &
      Record<
        Exclude<
          keyof TGroupValidators[K],
          keyof FormGroupValidator<TGroupValue>
        >,
        never
      >
  }
  /**
   * Called after group submission validation succeeds. The callback is awaited
   * before submission finishes.
   *
   * @example
   * ```ts
   * {
   *   // ...
   *   onSubmit: () => {
   *     setStep(step => step + 1)
   *   },
   * }
   * ```
   */
  onSubmit?: FormGroupSubmitFn<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormError,
    TSubmitReturn
  >
  /**
   * Called when group validation fails or validation or submission throws. The
   * callback is awaited before submission finishes.
   *
   * @example
   * ```ts
   * {
   *   // ...
   *   onSubmitInvalid: ({ groupApi }) => {
   *     document
   *       .querySelector<HTMLElement>('[aria-invalid="true"]')
   *       ?.focus()
   *   },
   * }
   * ```
   */
  onSubmitInvalid?: FormGroupOnSubmitInvalidFn<
    TFormData,
    TGroupName,
    TGroupValue,
    NoInfer<ToFormGroupErrorTypes<TGroupValidators, TSubmitReturn>>,
    TFormError
  >
}

export interface FormGroupState<
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
> {
  values: TGroupValue
  meta: unknown
  errors: Array<TGroupError['selfError']>
  isTouched: boolean
  isDirty: boolean
  isPristine: boolean
  isValid: boolean
  isInvalid: boolean
  canSubmit: boolean
  isSubmitting: boolean
  isSubmitSuccessful: boolean
  isValidating: boolean
  submissionAttempts: number
}

export interface FormGroupApi<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupError extends ScopedErrorTypes,
  in out TFormError extends ScopedErrorTypes,
> {
  readonly form: FormApi<TFormData, TFormError>
  readonly name: TGroupName

  atom: ReadonlyAtom<FormGroupState<TGroupValue, TGroupError>>
  readonly state: FormGroupState<TGroupValue, TGroupError>
  readonly value: TGroupValue
  /** Returns a flat array of issues and error maps with group-relative field paths. */
  validate: (
    signal: DynamicValidatorTriggers,
  ) => Promise<Array<FormattedValidationError<TGroupValue>>>
  /**
   * Submits the group and returns a flat array of issues and error maps.
   *
   * Exceptions reject after submission state is cleaned up, unless
   * `onSubmitInvalid` calls `preventThrow()`.
   */
  handleSubmit: () => Promise<Array<FormattedValidationError<TGroupValue>>>
  reset: () => void
}

import type { ReadonlyAtom } from '@tanstack/store'
import type { FormApi } from '../FormApi/FormApi.public'
import type { ScopedErrorTypes } from '../validation/state.public'
import type { ClientSideEvents } from '../events.public'
import type {
  FormGroupValidateResult,
  FormGroupValidator,
  FormGroupValidators,
  ToFormGroupErrorTypes,
  ToFormGroupOutputs,
} from '../validation.public'
import type { Awaitable } from '../types.public'

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
> {
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
> = (
  context: FormGroupSubmitContext<
    TFormData,
    TGroupName,
    TGroupValue,
    ToFormGroupOutputs<NoInfer<TGroupValidators>>,
    ToFormGroupErrorTypes<NoInfer<TGroupValidators>>,
    TFormError
  >,
) => void | Promise<void>

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
> {
  form: FormApi<TFormData, TFormError>
  name: TGroupName
  validators?: TGroupValidators & {
    [K in keyof TGroupValidators]: Record<
      Exclude<keyof TGroupValidators[K], keyof FormGroupValidator<TGroupValue>>,
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
    TFormError
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
    NoInfer<ToFormGroupErrorTypes<TGroupValidators>>,
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
  validate: (
    signal: ClientSideEvents,
  ) => Promise<Array<FormGroupValidateResult<TGroupValue>>>
  handleSubmit: () => Promise<Array<FormGroupValidateResult<TGroupValue>>>
  reset: () => void
}

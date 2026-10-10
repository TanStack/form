import type { ReadonlyAtom } from '@tanstack/store'
import type { FormApi } from '../FormApi/FormApi.public'
import type {
  ConfigurableValidationTrigger,
  FormErrorTypes,
  FormErrors,
  FormGroupValidateResult,
  FormGroupValidators,
  ToFormGroupErrorTypes,
  ToFormGroupOutputs,
} from '../validation.public'

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
  in out TGroupErrorTypes extends FormErrorTypes,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  /** The group values for this submission. */
  value: TGroupValue
  /** The parent form API handling this submission. */
  formApi: FormApi<TFormData, TFormErrorTypes>
  /** The group API handling this submission. */
  groupApi: FormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupErrorTypes,
    TFormErrorTypes
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
  in out TGroupErrorTypes extends FormErrorTypes,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  /** The group values for the failed submission. */
  value: TGroupValue
  /** The parent form API handling the failed submission. */
  formApi: FormApi<TFormData, TFormErrorTypes>
  /** The group API handling the failed submission. */
  groupApi: FormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupErrorTypes,
    TFormErrorTypes
  >
}

export type FormGroupSubmitFn<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidators<TGroupValue>,
  in out TFormErrorTypes extends FormErrorTypes,
> = (
  context: FormGroupSubmitContext<
    TFormData,
    TGroupName,
    TGroupValue,
    ToFormGroupOutputs<NoInfer<TGroupValidators>>,
    ToFormGroupErrorTypes<NoInfer<TGroupValidators>>,
    TFormErrorTypes
  >,
) => void | Promise<void>

export interface FormGroupOptions<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TGroupValidators extends FormGroupValidators<TGroupValue>,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  form: FormApi<TFormData, TFormErrorTypes>
  name: TGroupName
  validators?: TGroupValidators
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
    TFormErrorTypes
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
  onSubmitInvalid?: (
    context: FormGroupSubmitInvalidContext<
      TFormData,
      TGroupName,
      TGroupValue,
      ToFormGroupErrorTypes<NoInfer<TGroupValidators>>,
      TFormErrorTypes
    >,
  ) => void | Promise<void>
}

export interface FormGroupState<
  in out TGroupValue,
  in out TGroupErrorTypes extends FormErrorTypes,
> {
  values: TGroupValue
  meta: unknown
  errors: FormErrors<TGroupErrorTypes>
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
  in out TGroupErrorTypes extends FormErrorTypes,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  readonly form: FormApi<TFormData, TFormErrorTypes>
  readonly name: TGroupName

  atom: ReadonlyAtom<FormGroupState<TGroupValue, TGroupErrorTypes>>
  readonly state: FormGroupState<TGroupValue, TGroupErrorTypes>
  readonly value: TGroupValue
  validate: (
    signal: ConfigurableValidationTrigger | 'submit',
  ) => Promise<Array<FormGroupValidateResult<TGroupValue>>>
  handleSubmit: () => Promise<Array<FormGroupValidateResult<TGroupValue>>>
  reset: () => void
}

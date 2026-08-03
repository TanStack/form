import type { ReadonlyAtom } from '@tanstack/store'
import type { FormApi } from '../FormApi/FormApi.public'
import type {
  ConfigurableValidationTrigger,
  FormErrorTypes,
  FormErrors,
  FormGroupValidateResult,
  FormGroupValidators,
  ToFormGroupErrorTypes,
  ToFormGroupSchemaOutputs,
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
  out TSchemaOutputs,
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
   * The submit outputs produced by the group's schema validators, ordered by
   * validator index.
   *
   * @example
   * ```ts
   * {
   *   // ...
   *   onSubmit: async ({ schemaOutputs }) => {
   *     const validatedGuestDetails = schemaOutputs[0]
   *     setStep(step => step + 1)
   *   },
   * }
   * ```
   */
  schemaOutputs: TSchemaOutputs
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
  onSubmit?: (
    context: FormGroupSubmitContext<
      TFormData,
      TGroupName,
      TGroupValue,
      ToFormGroupSchemaOutputs<TGroupValidators>,
      ToFormGroupErrorTypes<TGroupValidators>,
      TFormErrorTypes
    >,
  ) => void | Promise<void>
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
      ToFormGroupErrorTypes<TGroupValidators>,
      TFormErrorTypes
    >,
  ) => void | Promise<void>
}

export interface FormGroupApiOptions<
  in out TFormData,
  in out TGroupName,
  in out TGroupValue,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  form: FormApi<TFormData, TFormErrorTypes>
  name: TGroupName
  validators?: FormGroupValidators<TGroupValue>
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
  readonly options: FormGroupApiOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TFormErrorTypes
  >

  atom: ReadonlyAtom<FormGroupState<TGroupValue, TGroupErrorTypes>>
  readonly state: FormGroupState<TGroupValue, TGroupErrorTypes>
  readonly value: TGroupValue
  validate: (
    signal: ConfigurableValidationTrigger | 'submit',
  ) => Promise<Array<FormGroupValidateResult<TGroupValue>>>
  handleSubmit: () => Promise<Array<FormGroupValidateResult<TGroupValue>>>
  reset: () => void
}

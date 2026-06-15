import type { ReadonlyAtom } from '@tanstack/store'
import type {
  ConfigurableValidationTrigger,
  ErrorVisibility,
  FormErrors,
  FormStandardSchemaValidatorOutputs,
  FormValidationError,
  FormValidatorMetas,
  FormValidators,
  SubmitMeta,
  ToFormValidatorMetas,
  ValidationIssue,
} from '../validation.public'
import type { FormListeners } from '../listeners.public'
import type {
  ClearFieldValuesFn,
  FilterFieldValuesFn,
  InsertFieldValueFn,
  PushFieldValueFn,
  RemoveFieldValueFn,
  SwapFieldValuesFn,
} from './FormApiArrayMethods.types.public'
import type {
  GetFieldValueFn,
  ResetFieldFn,
  SetFieldValueFn,
} from './FormApiFieldMethods.types.public'

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

export interface FormSubmitContext<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
> {
  value: TFormData
  formApi: FormApi<TFormData, TFormValidatorMetas, any>
  schemaOutputs: FormStandardSchemaValidatorOutputs<TFormValidatorMetas>
  createValidationError: CreateValidationErrorFn<TFormData>
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
    ToFormValidatorMetas<TFormValidators>,
    SubmitMeta<ValidationIssue, ValidationIssue>
  >
  validators?: TFormValidators
  listeners?: FormListeners<
    TFormData,
    ToFormValidatorMetas<TFormValidators>,
    SubmitMeta<ValidationIssue, ValidationIssue>
  >
  onSubmit?: (
    context: FormSubmitContext<
      TFormData,
      ToFormValidatorMetas<TFormValidators>
    >,
  ) => TSubmitReturn
}

export interface FormApiOptions<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitMeta,
> {
  formId?: string
  defaultValues: TFormData
  errorVisibility?: ErrorVisibility<
    TFormData,
    TFormValidatorMetas,
    TSubmitMeta
  >
  validators?: FormValidators<TFormData>
  listeners?: FormListeners<TFormData, TFormValidatorMetas, TSubmitMeta>
  onSubmit?: (
    context: FormSubmitContext<TFormData, TFormValidatorMetas>,
  ) => unknown
}

export interface FormState<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitMeta,
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
   * Array of form-level validation errors.
   */
  errors: FormErrors<TFormValidatorMetas, TSubmitMeta>
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
   * Whether the form or any field is currently validating.
   */
  isValidating: boolean
  /**
   * The number of times a submission has been attempted, regardless of its success.
   *
   * If the form is reset, this will revert back to 0.
   */
  submissionAttempts: number
}

export type AnyFormApi = FormApi<any, any, any>

export interface FormApi<
  in out TFormData,
  in out TFormValidatorMetas extends FormValidatorMetas,
  in out TSubmitMeta,
> {
  store: ReadonlyAtom<FormState<TFormData, TFormValidatorMetas, TSubmitMeta>>
  readonly state: FormState<TFormData, TFormValidatorMetas, TSubmitMeta>
  readonly options: FormApiOptions<
    TFormData,
    TFormValidatorMetas,
    TSubmitMeta
  >
  readonly formId: string
  setFieldValue: SetFieldValueFn<TFormData>
  /**
   * TODO
   * @param DeepKeys
   * @returns
   */
  getFieldValue: GetFieldValueFn<TFormData>
  resetField: ResetFieldFn<TFormData>
  /**
   * Swap two values in an array field.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   * @param indexA - The index of the first value to swap
   * @param indexB - The index of the second value to swap
   */
  swapFieldValues: SwapFieldValuesFn<TFormData>
  /**
   * Push a value into an array field.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   * @param value - The value to push
   * @param options - Optional update options
   */
  pushFieldValue: PushFieldValueFn<TFormData>
  /**
   * Insert a value into an array field at the specified index.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   * @param index - The index at which to insert the value
   * @param value - The value to insert
   * @param options - Optional update options
   */
  insertFieldValue: InsertFieldValueFn<TFormData>
  /**
   * Clear all values from an array field.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   */
  clearFieldValues: ClearFieldValuesFn<TFormData>
  /**
   * Remove a value from an array field.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   * @param index - The index of the value to remove
   * @param options - Optional update options
   */
  removeFieldValue: RemoveFieldValueFn<TFormData>
  /**
   * Filter the values in an array field using a predicate function.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   * @param predicate - The predicate function to filter values. Returns true to keep the value, false to remove it.
   * @param options - Optional update options including a custom `thisArg` for the predicate
   */
  filterFieldValues: FilterFieldValuesFn<TFormData>

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
   * TODO
   */
  reset: (values?: TFormData) => void
}

import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  TryGetArrayElementType,
} from '../deep-keys.public'
import type { FieldUpdateOptions } from '../types.public'
import type { ReadonlyAtom } from '@tanstack/store'
import type {
  ConfigurableValidationTrigger,
  ErrorVisibility,
  FormErrors,
  FormStandardSchemaValidatorOutputs,
  FormValidationError,
  FormValidators,
} from '../validation.public'
import type { FormListeners } from '../listeners.public'

declare const onSubmitErrorBrand: unique symbol

export type OnSubmitError<T extends FormValidationError<any>> = T & {
  [onSubmitErrorBrand]: true
}

export type CreateValidationErrorFn<TFormData> = <
  TError extends FormValidationError<TFormData>,
>(
  error: TError,
) => OnSubmitError<TError>

export interface FormSubmitContext<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
> {
  value: TFormData
  formApi: FormApi<TFormData, TFormValidators, any>
  schemaOutputs: FormStandardSchemaValidatorOutputs<TFormValidators>
  createValidationError: CreateValidationErrorFn<TFormData>
}

export type AnyFormOptions = FormOptions<any, any, any>

export interface FormOptions<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> {
  defaultValues: TFormData
  errorVisibility?: ErrorVisibility
  validators?: TFormValidators
  listeners?: FormListeners<TFormData, TFormValidators, TSubmitReturn>
  onSubmit?: (
    context: FormSubmitContext<TFormData, TFormValidators>,
  ) => TSubmitReturn
}

export interface FormState<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
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
  formErrors: FormErrors<TFormValidators, TSubmitReturn>
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
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> {
  store: ReadonlyAtom<FormState<TFormData, TFormValidators, TSubmitReturn>>
  readonly state: FormState<TFormData, TFormValidators, TSubmitReturn>
  readonly options: FormOptions<TFormData, TFormValidators, TSubmitReturn>

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

  /**
   * TODO
   * @param fieldName
   * @param updater
   */
  setFieldValue: <TFieldName extends DeepKeys<TFormData>>(
    fieldName: TFieldName,
    value: DeepValue<TFormData, TFieldName>,
    options?: FieldUpdateOptions,
  ) => void

  /**
   * TODO
   * @param fieldName
   * @returns
   */
  getFieldValue: <TFieldName extends DeepKeys<TFormData>>(
    fieldName: TFieldName,
  ) => DeepValue<TFormData, TFieldName>

  /**
   * Swap two values in an array field.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   * @param indexA - The index of the first value to swap
   * @param indexB - The index of the second value to swap
   */
  swapFieldValues: <
    TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  >(
    arrayFieldName: TFieldName,
    indexA: number,
    indexB: number,
    options?: FieldUpdateOptions,
  ) => void

  /**
   * Push a value into an array field.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   * @param value - The value to push
   * @param options - Optional update options
   */
  pushFieldValue: <
    TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  >(
    arrayFieldName: TFieldName,
    value: TryGetArrayElementType<DeepValue<TFormData, TFieldName>>,
    options?: FieldUpdateOptions,
  ) => void

  /**
   * Insert a value into an array field at the specified index.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   * @param index - The index at which to insert the value
   * @param value - The value to insert
   * @param options - Optional update options
   */
  insertFieldValue: <
    TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  >(
    arrayFieldName: TFieldName,
    index: number,
    value: TryGetArrayElementType<DeepValue<TFormData, TFieldName>>,
    options?: FieldUpdateOptions,
  ) => void

  /**
   * Clear all values from an array field.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   */
  clearFieldValues: <
    TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  >(
    arrayFieldName: TFieldName,
    options?: FieldUpdateOptions,
  ) => void

  /**
   * Remove a value from an array field at the specified index.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   * @param index - The index of the value to remove
   * @param options - Optional update options
   */
  removeFieldValue: <
    TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  >(
    arrayFieldName: TFieldName,
    index: number,
    options?: FieldUpdateOptions,
  ) => void

  /**
   * Filter the values in an array field using a predicate function.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   * @param predicate - The predicate function to filter values. Returns true to keep the value, false to remove it.
   * @param options - Optional update options including a custom `thisArg` for the predicate
   */
  filterFieldValues: <
    TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  >(
    arrayFieldName: TFieldName,
    predicate: (
      value: TryGetArrayElementType<DeepValue<TFormData, TFieldName>>,
      index: number,
      array: DeepValue<TFormData, TFieldName>,
    ) => boolean,
    options?: FieldUpdateOptions & { thisArg?: any },
  ) => void

  resetField: <TFieldName extends DeepKeys<TFormData>>(
    fieldName: TFieldName,
  ) => void
}

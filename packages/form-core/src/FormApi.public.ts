import type { FieldUpdateOptions } from './types.public'
import type { ReadonlyAtom } from '@tanstack/store'
import type {
  FormValidationError,
  FormValidator,
  ValidationSignal,
} from './validation.public'

export interface FormOptions<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
> {
  defaultValues: TData
  validators?: TFormValidators
}

export interface FormState<TData> {
  /**
   * The current values of the form.
   */
  values: TData
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
  formErrors: Array<FormValidationError>
}

export interface FormApi<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
> {
  store: ReadonlyAtom<FormState<TData>>
  readonly state: FormState<TData>
  readonly options: FormOptions<TData, TFormValidators>

  /**
   * TODO expand on it
   *
   * Validates with the given validation signal and returns
   * errors if they appeared. It will automatically populate the
   * form's error state.
   */
  validate: (signal: ValidationSignal) => Promise<Array<FormValidationError>>

  /**
   * TODO for later: submit meta
   *
   */
  handleSubmit: () => Promise<any>

  /**
   * TODO
   * @param fieldName
   * @param updater
   */
  setFieldValue: (
    fieldName: string,
    value: any,
    options?: FieldUpdateOptions,
  ) => void

  /**
   * TODO
   * @param fieldName
   * @returns
   */
  getFieldValue: (fieldName: string) => any

  /**
   * Swap two values in an array field.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   * @param indexA - The index of the first value to swap
   * @param indexB - The index of the second value to swap
   */
  swapFieldValues: (
    arrayFieldName: string,
    indexA: number,
    indexB: number,
  ) => void

  /**
   * Push a value into an array field.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   * @param value - The value to push
   * @param options - Optional update options
   */
  pushFieldValue: (
    arrayFieldName: string,
    value: any,
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
  insertFieldValue: (
    arrayFieldName: string,
    index: number,
    value: any,
    options?: FieldUpdateOptions,
  ) => void

  /**
   * Clear all values from an array field.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   */
  clearFieldValues: (arrayFieldName: string) => void

  /**
   * Remove a value from an array field at the specified index.
   * If the field is not an array, this method will be ignored.
   * @param arrayFieldName - The name of the array field
   * @param index - The index of the value to remove
   * @param options - Optional update options
   */
  removeFieldValue: (
    arrayFieldName: string,
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
  filterFieldValues: (
    arrayFieldName: string,
    predicate: (value: any, index: number, array: Array<any>) => boolean,
    options?: FieldUpdateOptions & { thisArg?: any },
  ) => void
}

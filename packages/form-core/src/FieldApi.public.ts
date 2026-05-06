import type { FieldUpdateOptions, Updater } from './types.public'
import type { FormApi } from './FormApi.public'
import type {
  ErrorWithMessage,
  FieldValidator,
  FormValidator,
} from './validation.public'

/**
 * field.state.value
 * field.state.isTouched
 * field.state.errors
 */

export interface BaseFieldMeta {
  isTouched: boolean
  isDirty: boolean
  isBlurred: boolean
  childErrorCount: number
}

export interface FieldMeta extends BaseFieldMeta {
  isPristine: boolean
  isInvalid: boolean
  isValid: boolean
  errors: Array<ErrorWithMessage>
}

export interface FieldState {
  value: any
  meta: FieldMeta
}

export type FieldErrors = Array<any>

export interface FieldApi<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
> {
  /**
   * The form that owns this field.
   */
  form: FormApi<TFormData, TFormValidators>

  /**
   * The name of the field.
   */
  get name(): string

  /**
   * Swap two elements in this field's array.
   * If this field is not an array, this method will be ignored.
   * @param indexA - The index of the first element to swap
   * @param indexB - The index of the second element to swap
   */
  swapValues: (indexA: number, indexB: number) => void

  /**
   * Push a new value into this field's array.
   * If this field is not an array, this method will be ignored.
   * @param value - The value to push into the array
   * @param options - Optional update options
   */
  pushValue: (value: any, options?: FieldUpdateOptions) => void

  /**
   * Insert a new value into this field's array at the specified index.
   * If this field is not an array, this method will be ignored.
   * @param index - The index at which to insert the value
   * @param value - The value to insert
   * @param options - Optional update options
   */
  insertValue: (index: number, value: any, options?: FieldUpdateOptions) => void

  /**
   * Clear all values from this field's array.
   * If this field is not an array, this method will be ignored.
   * @param options - Optional update options
   */
  clearValues: (options?: FieldUpdateOptions) => void

  /**
   * Remove a value from this field's array at the specified index.
   * If this field is not an array, this method will be ignored.
   * @param index - The index of the value to remove
   * @param options - Optional update options
   */
  removeValue: (index: number, options?: FieldUpdateOptions) => void

  /**
   * @deprecated
   * Use the respective getters instead:
   * - `field.value`
   * - `field.errors`
   * - `field.meta`
   */
  state: FieldState

  value: any

  meta: FieldMeta

  errors: FieldErrors

  handleChange: (value: Updater<any>, options?: FieldUpdateOptions) => void

  handleBlur: () => void
}

export interface FieldApiOptions<TFormData, TFieldValue> {
  name: string
  validators?: Array<FieldValidator<TFormData, TFieldValue>>
}

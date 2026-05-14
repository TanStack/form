import type { FieldUpdateOptions, Updater } from './types.public'
import type { FormApi } from './FormApi.public'
import type {
  ErrorVisibility,
  ErrorWithMessage,
  FieldValidator,
  FormValidator,
} from './validation.public'
import type { FieldListeners } from './listeners.public'

export interface BaseFieldMeta {
  isTouched: boolean
  isDirty: boolean
  isBlurred: boolean
}

export interface SubfieldsMeta {
  isEveryValid: boolean
  isAnyInvalid: boolean
  isEveryPristine: boolean
  isSomeDirty: boolean
  isSomeTouched: boolean
}

export interface OriginalFieldMeta {
  errors: Array<ErrorWithMessage>
  isValid: boolean
  isInvalid: boolean
}

export interface FieldMeta extends BaseFieldMeta {
  isPristine: boolean
  isSelfTouched: boolean
  isSelfDirty: boolean
  isInvalid: boolean
  isSelfValid: boolean
  isValid: boolean
  subfields: SubfieldsMeta
  errors: Array<ErrorWithMessage>
  original: OriginalFieldMeta
}

export interface FieldState {
  value: any
  meta: FieldMeta
}

// TODO this should be inferred
export type FieldErrors = Array<ErrorWithMessage>

export type AnyFieldApi = FieldApi<any, any>

export interface FieldApi<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
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
   * Filter the values in this field's array using a predicate function.
   * If this field is not an array, this method will be ignored.
   * @param predicate - The predicate function to filter values. Returns true to keep the value, false to remove it.
   * @param options - Optional update options including a custom `thisArg` for the predicate
   */
  filterValues: (
    predicate: (value: any, index: number, array: Array<any>) => boolean,
    options?: FieldUpdateOptions & { thisArg?: any },
  ) => void

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

  reset: () => void
}

export interface FieldApiOptions<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TFieldValue,
> {
  name: string
  errorVisibility?: ErrorVisibility
  validators?: Array<FieldValidator<TFormData, TFieldValue>>
  listeners?: FieldListeners<TFormData, TFormValidators>
}

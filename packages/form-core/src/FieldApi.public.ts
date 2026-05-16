import type {
  DeepKeys,
  DeepValue,
  TryGetArrayElementType,
} from './deep-keys.public'
import type { FieldUpdateOptions, Updater } from './types.public'
import type { FormApi } from './FormApi.public'
import type {
  ErrorVisibility,
  FieldValidators,
  FormValidators,
  FieldErrors as ValidationFieldErrors,
} from './validation.public'
import type { FieldListeners } from './listeners.public'

export interface BaseFieldMeta {
  isTouched: boolean
  isDirty: boolean
  isBlurred: boolean
  isValidating: boolean
}

export interface SubfieldsMeta {
  isEveryValid: boolean
  isAnyInvalid: boolean
  isEveryPristine: boolean
  isSomeDirty: boolean
  isSomeTouched: boolean
  isSomeValidating: boolean
}

export interface OriginalFieldMeta<
  TFormValidators extends FormValidators<any>,
  TFieldValidators extends FieldValidators<any, any, any>,
> {
  errors: ValidationFieldErrors<TFormValidators, TFieldValidators>
  isValid: boolean
  isInvalid: boolean
}

export type AnyFieldMeta = FieldMeta<any, any>

export interface FieldMeta<
  TFormValidators extends FormValidators<any>,
  TFieldValidators extends FieldValidators<any, any, any>,
> extends BaseFieldMeta {
  isPristine: boolean
  isSelfTouched: boolean
  isSelfDirty: boolean
  isInvalid: boolean
  isSelfValid: boolean
  isSelfValidating: boolean
  isValid: boolean
  subfields: SubfieldsMeta
  errors: ValidationFieldErrors<TFormValidators, TFieldValidators>
  original: OriginalFieldMeta<TFormValidators, TFieldValidators>
}

export interface FieldState<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> {
  value: TFieldValue
  meta: FieldMeta<TFormValidators, TFieldValidators>
}

export type AnyFieldApi = FieldApi<any, any, any, any, any>

export interface FieldApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> {
  /**
   * The form that owns this field.
   */
  form: FormApi<TFormData, TFormValidators>

  /**
   * The name of the field.
   */
  get name(): TFieldName

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
  pushValue: (
    value: TryGetArrayElementType<TFieldValue>,
    options?: FieldUpdateOptions,
  ) => void

  /**
   * Insert a new value into this field's array at the specified index.
   * If this field is not an array, this method will be ignored.
   * @param index - The index at which to insert the value
   * @param value - The value to insert
   * @param options - Optional update options
   */
  insertValue: (
    index: number,
    value: TryGetArrayElementType<TFieldValue>,
    options?: FieldUpdateOptions,
  ) => void

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
    predicate: (
      value: TryGetArrayElementType<TFieldValue>,
      index: number,
      array: TFieldValue,
    ) => boolean,
    options?: FieldUpdateOptions & { thisArg?: any },
  ) => void

  /**
   * @deprecated
   * Use the respective getters instead:
   * - `field.value`
   * - `field.errors`
   * - `field.meta`
   */
  state: FieldState<
    TFormData,
    TFormValidators,
    TFieldName,
    TFieldValue,
    TFieldValidators
  >

  value: TFieldValue

  meta: FieldMeta<TFormValidators, TFieldValidators>

  errors: ValidationFieldErrors<TFormValidators, TFieldValidators>

  handleChange: (
    value: Updater<TFieldValue>,
    options?: FieldUpdateOptions,
  ) => void

  handleBlur: () => void

  reset: () => void
}

export interface FieldApiOptions<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> {
  name: TFieldName
  errorVisibility?: ErrorVisibility
  validators?: TFieldValidators
  listeners?: FieldListeners<
    TFormData,
    TFormValidators,
    TFieldName,
    TFieldValue,
    TFieldValidators
  >
}

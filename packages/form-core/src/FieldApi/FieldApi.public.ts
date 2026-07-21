import type { TryGetArrayElementType } from '../deep-keys.public'
import type { FieldUpdateOptions, Updater } from '../types.public'
import type { FormApi } from '../FormApi/FormApi.public'
import type {
  ErrorVisibility,
  FieldValidators,
  FormErrorTypes,
  FormGroupValidatorMetas,
  ToFieldError,
  FieldErrors as ValidationFieldErrors,
} from '../validation.public'
import type { FieldListeners } from '../listeners.public'
import type { ReadonlyAtom } from '@tanstack/store'

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

export interface OriginalFieldMeta<in out TFieldError> {
  errors: ValidationFieldErrors<TFieldError>
  isValid: boolean
  isInvalid: boolean
}

export type AnyFieldMeta = FieldMeta<any>

export interface FieldMeta<in out TFieldError> extends BaseFieldMeta {
  isPristine: boolean
  isDefaultValue: boolean
  isSelfTouched: boolean
  isSelfDirty: boolean
  isInvalid: boolean
  isSelfValid: boolean
  isSelfValidating: boolean
  isValid: boolean
  subfields: SubfieldsMeta
  errors: ValidationFieldErrors<TFieldError>
  original: OriginalFieldMeta<TFieldError>
}

export interface FieldState<out TFieldValue, in out TFieldError> {
  value: TFieldValue
  meta: FieldMeta<TFieldError>
}

export type AnyFieldApi = FieldApi<any, any, any, any, any>

type FieldArrayElement<TFieldValue> = TryGetArrayElementType<TFieldValue>

type FieldArrayPredicate<in out TFieldValue> = (
  value: FieldArrayElement<TFieldValue>,
  index: number,
  array: TFieldValue,
) => boolean

type FieldPushValueFn<in out TFieldValue> = (
  value: FieldArrayElement<TFieldValue>,
  options?: FieldUpdateOptions,
) => void

type FieldInsertValueFn<in out TFieldValue> = (
  index: number,
  value: FieldArrayElement<TFieldValue>,
  options?: FieldUpdateOptions,
) => void

type FieldClearValuesFn = (options?: FieldUpdateOptions) => void

type FieldRemoveValueFn = (index: number, options?: FieldUpdateOptions) => void

type FieldMoveValueFn = (
  fromIndex: number,
  toIndex: number,
  options?: FieldUpdateOptions,
) => void

type FieldFilterValuesFn<in out TFieldValue> = (
  predicate: FieldArrayPredicate<TFieldValue>,
  options?: FieldUpdateOptions & { thisArg?: any },
) => void

type FieldHandleChangeFn<in out TFieldValue> = (
  value: Updater<TFieldValue>,
  options?: FieldUpdateOptions,
) => void

type FieldVoidFn = () => void

export interface FieldApi<
  out TFieldName,
  in out TFieldValue,
  in out TFieldError,
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  /**
   * The form that owns this field.
   */
  form: FormApi<TFormData, TFormErrorTypes>

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
   * Move an element in this field's array from one index to another.
   * If this field is not an array, this method will be ignored.
   * @param fromIndex - The current index of the element to move
   * @param toIndex - The index to move the element to
   * @param options - Optional update options
   */
  moveValue: FieldMoveValueFn

  /**
   * Push a new value into this field's array.
   * If this field is not an array, this method will be ignored.
   * @param value - The value to push into the array
   * @param options - Optional update options
   */
  pushValue: FieldPushValueFn<TFieldValue>

  /**
   * Insert a new value into this field's array at the specified index.
   * If this field is not an array, this method will be ignored.
   * @param index - The index at which to insert the value
   * @param value - The value to insert
   * @param options - Optional update options
   */
  insertValue: FieldInsertValueFn<TFieldValue>

  /**
   * Clear all values from this field's array.
   * If this field is not an array, this method will be ignored.
   * @param options - Optional update options
   */
  clearValues: FieldClearValuesFn

  /**
   * Remove a value from this field's array at the specified index.
   * If this field is not an array, this method will be ignored.
   * @param index - The index of the value to remove
   * @param options - Optional update options
   */
  removeValue: FieldRemoveValueFn

  /**
   * Filter the values in this field's array using a predicate function.
   * If this field is not an array, this method will be ignored.
   * @param predicate - The predicate function to filter values. Returns true to keep the value, false to remove it.
   * @param options - Optional update options including a custom `thisArg` for the predicate
   */
  filterValues: FieldFilterValuesFn<TFieldValue>

  atom: ReadonlyAtom<FieldState<TFieldValue, TFieldError>>

  value: TFieldValue

  meta: FieldMeta<TFieldError>

  errors: ValidationFieldErrors<TFieldError>

  handleChange: FieldHandleChangeFn<TFieldValue>

  handleBlur: FieldVoidFn

  reset: FieldVoidFn
}

export interface FieldApiOptions<
  in out TFieldData,
  in out TFieldName,
  in out TFieldValue,
  in out TFieldValidators extends FieldValidators<
    TFieldData,
    TFieldName,
    TFieldValue
  >,
  in out TGroupValidatorMetas extends FormGroupValidatorMetas,
  in out TFormData,
  in out TFormErrorTypes extends FormErrorTypes,
> {
  name: TFieldName
  errorVisibility?: ErrorVisibility<TFormData, TFormErrorTypes>
  /**
   * Route descendant field errors from form-level validation to this field.
   */
  errorBoundary?: boolean
  validators?: TFieldValidators
  listeners?: FieldListeners<
    TFieldData,
    TFieldName,
    TFieldValue,
    ToFieldError<TFieldValidators, TGroupValidatorMetas, TFormErrorTypes>,
    TFormData,
    TFormErrorTypes
  >
}

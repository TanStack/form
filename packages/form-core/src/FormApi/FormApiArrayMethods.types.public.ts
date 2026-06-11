import type {
  DeepKeysWhereValueIncludes,
  DeepValue,
  TryGetArrayElementType,
} from '../deep-keys.public'
import type { FieldUpdateOptions } from '../types.public'

export type ArrayFieldName<TFormData> = DeepKeysWhereValueIncludes<
  TFormData,
  ReadonlyArray<any>
>

export type ArrayFieldValue<
  TFormData,
  TFieldName extends ArrayFieldName<TFormData>,
> = DeepValue<TFormData, TFieldName>

export type ArrayFieldElement<
  TFormData,
  TFieldName extends ArrayFieldName<TFormData>,
> = TryGetArrayElementType<ArrayFieldValue<TFormData, TFieldName>>

export type ArrayFieldPredicate<
  in out TFormData,
  in out TFieldName extends ArrayFieldName<TFormData>,
> = (
  value: ArrayFieldElement<TFormData, TFieldName>,
  index: number,
  array: ArrayFieldValue<TFormData, TFieldName>,
) => boolean

export type SwapFieldValuesFn<in out TFormData> = <
  TFieldName extends ArrayFieldName<TFormData>,
>(
  arrayFieldName: TFieldName,
  indexA: number,
  indexB: number,
  options?: FieldUpdateOptions,
) => void

export type PushFieldValueFn<in out TFormData> = <
  TFieldName extends ArrayFieldName<TFormData>,
>(
  arrayFieldName: TFieldName,
  value: ArrayFieldElement<TFormData, TFieldName>,
  options?: FieldUpdateOptions,
) => void

export type InsertFieldValueFn<in out TFormData> = <
  TFieldName extends ArrayFieldName<TFormData>,
>(
  arrayFieldName: TFieldName,
  index: number,
  value: ArrayFieldElement<TFormData, TFieldName>,
  options?: FieldUpdateOptions,
) => void

export type ClearFieldValuesFn<in out TFormData> = <
  TFieldName extends ArrayFieldName<TFormData>,
>(
  arrayFieldName: TFieldName,
  options?: FieldUpdateOptions,
) => void

export type RemoveFieldValueFn<in out TFormData> = <
  TFieldName extends ArrayFieldName<TFormData>,
>(
  arrayFieldName: TFieldName,
  index: number,
  options?: FieldUpdateOptions,
) => void

export type FilterFieldValuesFn<in out TFormData> = <
  TFieldName extends ArrayFieldName<TFormData>,
>(
  arrayFieldName: TFieldName,
  predicate: ArrayFieldPredicate<TFormData, TFieldName>,
  options?: FieldUpdateOptions & { thisArg?: any },
) => void

export interface FormApiArrayMethods<in out TFormData> {
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
   * Remove a value from an array field at the specified index.
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
}

import type {
  DeepKeysWhereValueIncludes,
  DeepValue,
  TryGetArrayElementType,
} from '../deep-keys.public'
import type { FieldUpdateOptions } from '../types.public'

/**
 * Field paths whose value type includes a mutable or readonly array.
 *
 * A path is included when at least one member of a union is an array, including
 * when the value can also be `null` or `undefined`.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export type ArrayFieldName<TFormData> = DeepKeysWhereValueIncludes<
  TFormData,
  ReadonlyArray<any>
>

/**
 * Complete value type at an array field path.
 *
 * This preserves any nullish or non-array members that share the field's value
 * union.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 */
export type ArrayFieldValue<
  TFormData,
  TFieldName extends ArrayFieldName<TFormData>,
> = DeepValue<TFormData, TFieldName>

/**
 * Element type extracted from the array member of an array field's value.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 */
export type ArrayFieldElement<
  TFormData,
  TFieldName extends ArrayFieldName<TFormData>,
> = TryGetArrayElementType<ArrayFieldValue<TFormData, TFieldName>>

/**
 * Selects which elements `filterFieldValues` keeps.
 *
 * Return `true` to keep an element or `false` to remove it. The callback
 * receives the element's original index and the array before filtering.
 *
 * @example
 * ```ts
 * // items: [1, 2, 3, 4]
 * formApi.filterFieldValues('items', (item) => item % 2 === 0)
 * // items: [2, 4]
 * ```
 *
 * @param value - The current element.
 * @param index - The element's index in the original array.
 * @param array - The array being filtered.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 */
export type ArrayFieldPredicate<
  in out TFormData,
  in out TFieldName extends ArrayFieldName<TFormData>,
> = (
  value: ArrayFieldElement<TFormData, TFieldName>,
  index: number,
  array: ArrayFieldValue<TFormData, TFieldName>,
) => boolean

/**
 * Swaps two elements in an array field.
 *
 * Passing equal indices does nothing. Invalid indices or a runtime value that
 * is not an array produce a warning and leave the value unchanged.
 *
 * By default, the update marks the array field as touched and dirty, notifies
 * change listeners, and runs change validation.
 *
 * @example
 * ```ts
 * // items: ['first', 'second', 'third']
 * formApi.swapFieldValues('items', 0, 2)
 * // items: ['third', 'second', 'first']
 * ```
 *
 * @param arrayFieldName - The array field path.
 * @param indexA - The first index to swap, from `0` through `array.length - 1`.
 * @param indexB - The second index to swap, from `0` through `array.length - 1`.
 * @param options - Controls metadata updates and whether validation runs.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 */
export type SwapFieldValuesFn<in out TFormData> = <
  TFieldName extends ArrayFieldName<TFormData>,
>(
  arrayFieldName: TFieldName,
  indexA: number,
  indexB: number,
  options?: FieldUpdateOptions,
) => void

/**
 * Moves an element to another index in an array field.
 *
 * Passing equal indices does nothing. Invalid indices or a runtime value that
 * is not an array produce a warning and leave the value unchanged.
 *
 * By default, the update marks the array field as touched and dirty, notifies
 * change listeners, and runs change validation.
 *
 * @example
 * ```ts
 * // items: ['first', 'second', 'third']
 * formApi.moveFieldValue('items', 0, 2)
 * // items: ['second', 'third', 'first']
 * ```
 *
 * @param arrayFieldName - The array field path.
 * @param fromIndex - The current index, from `0` through `array.length - 1`.
 * @param toIndex - The destination index, from `0` through `array.length - 1`.
 * @param options - Controls metadata updates and whether validation runs.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 */
export type MoveFieldValueFn<in out TFormData> = <
  TFieldName extends ArrayFieldName<TFormData>,
>(
  arrayFieldName: TFieldName,
  fromIndex: number,
  toIndex: number,
  options?: FieldUpdateOptions,
) => void

/**
 * Appends an element to an array field.
 *
 * A runtime value that is not an array produces a warning and is left
 * unchanged. By default, the update marks the array field as touched and
 * dirty, notifies change listeners, and runs change validation.
 *
 * @example
 * ```ts
 * // items: ['first', 'second']
 * formApi.pushFieldValue('items', 'new item')
 * // items: ['first', 'second', 'new item']
 * ```
 *
 * @param arrayFieldName - The array field path.
 * @param value - The element to append.
 * @param options - Controls metadata updates and whether validation runs.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 */
export type PushFieldValueFn<in out TFormData> = <
  TFieldName extends ArrayFieldName<TFormData>,
>(
  arrayFieldName: TFieldName,
  value: ArrayFieldElement<TFormData, TFieldName>,
  options?: FieldUpdateOptions,
) => void

/**
 * Inserts an element at an index in an array field.
 *
 * Inserting at the array length appends the element. An invalid index or a
 * runtime value that is not an array produces a warning and leaves the value
 * unchanged.
 *
 * By default, the update marks the array field as touched and dirty, notifies
 * change listeners, and runs change validation.
 *
 * @example
 * ```ts
 * // items: ['first', 'second']
 * formApi.insertFieldValue('items', 1, 'new item')
 * // items: ['first', 'new item', 'second']
 * ```
 *
 * @param arrayFieldName - The array field path.
 * @param index - The insertion index, from `0` through `array.length`.
 * @param value - The element to insert.
 * @param options - Controls metadata updates and whether validation runs.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 */
export type InsertFieldValueFn<in out TFormData> = <
  TFieldName extends ArrayFieldName<TFormData>,
>(
  arrayFieldName: TFieldName,
  index: number,
  value: ArrayFieldElement<TFormData, TFieldName>,
  options?: FieldUpdateOptions,
) => void

/**
 * Removes every element from an array field.
 *
 * A runtime value that is not an array produces a warning and is left
 * unchanged. By default, the update marks the array field as touched and
 * dirty, notifies change listeners, and runs change validation.
 *
 * @example
 * ```ts
 * // items: ['first', 'second']
 * formApi.clearFieldValues('items')
 * // items: []
 * ```
 *
 * @param arrayFieldName - The array field path.
 * @param options - Controls metadata updates and whether validation runs.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 */
export type ClearFieldValuesFn<in out TFormData> = <
  TFieldName extends ArrayFieldName<TFormData>,
>(
  arrayFieldName: TFieldName,
  options?: FieldUpdateOptions,
) => void

/**
 * Removes an element from an array field.
 *
 * An invalid index or a runtime value that is not an array produces a warning
 * and leaves the value unchanged.
 *
 * By default, the update marks the array field as touched and dirty, notifies
 * change listeners, and runs change validation.
 *
 * @example
 * ```ts
 * // items: ['first', 'second', 'third']
 * formApi.removeFieldValue('items', 1)
 * // items: ['first', 'third']
 * ```
 *
 * @param arrayFieldName - The array field path.
 * @param index - The index to remove, from `0` through `array.length - 1`.
 * @param options - Controls metadata updates and whether validation runs.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 */
export type RemoveFieldValueFn<in out TFormData> = <
  TFieldName extends ArrayFieldName<TFormData>,
>(
  arrayFieldName: TFieldName,
  index: number,
  options?: FieldUpdateOptions,
) => void

/**
 * Keeps the elements that satisfy a predicate.
 *
 * A runtime value that is not an array produces a warning and is left
 * unchanged. By default, the update marks the array field as touched and
 * dirty, notifies change listeners, and runs change validation.
 *
 * @example
 * ```ts
 * // items: [1, 2, 3, 4]
 * formApi.filterFieldValues('items', (item) => item % 2 === 0)
 * // items: [2, 4]
 * ```
 *
 * @param arrayFieldName - The array field path.
 * @param predicate - Called with each element, its original index, and the
 * array. Return `true` to keep the element.
 * @param options - Controls metadata updates and validation. `thisArg` sets the
 * predicate's `this` value.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFieldName - Library-managed. Do not specify explicitly.
 */
export type FilterFieldValuesFn<in out TFormData> = <
  TFieldName extends ArrayFieldName<TFormData>,
>(
  arrayFieldName: TFieldName,
  predicate: ArrayFieldPredicate<TFormData, TFieldName>,
  options?: FieldUpdateOptions & { thisArg?: any },
) => void

/**
 * Methods for adding, removing, moving, and filtering array field elements.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export interface FormApiArrayMethods<in out TFormData> {
  /**
   * Swaps two elements in an array field.
   *
   * Both indices must be between `0` and `array.length - 1`. Passing equal
   * indices does nothing. Out-of-range indices or a runtime value that is not
   * an array produce a warning and leave the value unchanged.
   *
   * By default, the update marks the array field as touched and dirty, notifies
   * change listeners, and runs change validation.
   *
   * @example
   * ```ts
   * // items: ['first', 'second', 'third']
   * formApi.swapFieldValues('items', 0, 2)
   * // items: ['third', 'second', 'first']
   * ```
   */
  swapFieldValues: SwapFieldValuesFn<TFormData>

  /**
   * Moves an element to another index in an array field.
   *
   * Both indices must be between `0` and `array.length - 1`. Passing equal
   * indices does nothing. Out-of-range indices or a runtime value that is not
   * an array produce a warning and leave the value unchanged.
   *
   * By default, the update marks the array field as touched and dirty, notifies
   * change listeners, and runs change validation.
   *
   * @example
   * ```ts
   * // items: ['first', 'second', 'third']
   * formApi.moveFieldValue('items', 0, 2)
   * // items: ['second', 'third', 'first']
   * ```
   */
  moveFieldValue: MoveFieldValueFn<TFormData>

  /**
   * Appends an element to an array field.
   *
   * A runtime value that is not an array produces a warning and is left
   * unchanged. By default, the update marks the array field as touched and
   * dirty, notifies change listeners, and runs change validation.
   *
   * @example
   * ```ts
   * // items: ['first', 'second']
   * formApi.pushFieldValue('items', 'new item')
   * // items: ['first', 'second', 'new item']
   * ```
   */
  pushFieldValue: PushFieldValueFn<TFormData>

  /**
   * Inserts an element at an index in an array field.
   *
   * The index must be between `0` and `array.length`; passing `array.length`
   * appends the element. An out-of-range index or a runtime value that is not
   * an array produces a warning and leaves the value unchanged.
   *
   * By default, the update marks the array field as touched and dirty, notifies
   * change listeners, and runs change validation.
   *
   * @example
   * ```ts
   * // items: ['first', 'second']
   * formApi.insertFieldValue('items', 1, 'new item')
   * // items: ['first', 'new item', 'second']
   * ```
   */
  insertFieldValue: InsertFieldValueFn<TFormData>

  /**
   * Removes every element from an array field.
   *
   * A runtime value that is not an array produces a warning and is left
   * unchanged. By default, the update marks the array field as touched and
   * dirty, notifies change listeners, and runs change validation.
   *
   * @example
   * ```ts
   * // items: ['first', 'second']
   * formApi.clearFieldValues('items')
   * // items: []
   * ```
   */
  clearFieldValues: ClearFieldValuesFn<TFormData>

  /**
   * Removes an element from an array field.
   *
   * The index must be between `0` and `array.length - 1`. An out-of-range index
   * or a runtime value that is not an array produces a warning and leaves the
   * value unchanged.
   *
   * By default, the update marks the array field as touched and dirty, notifies
   * change listeners, and runs change validation.
   *
   * @example
   * ```ts
   * // items: ['first', 'second', 'third']
   * formApi.removeFieldValue('items', 1)
   * // items: ['first', 'third']
   * ```
   */
  removeFieldValue: RemoveFieldValueFn<TFormData>

  /**
   * Keeps the elements that satisfy a predicate.
   *
   * `options.thisArg` sets the predicate's `this` value. A runtime value that is
   * not an array produces a warning and is left unchanged. By default, the
   * update marks the array field as touched and dirty, notifies change
   * listeners, and runs change validation.
   *
   * @example
   * ```ts
   * // items: [1, 2, 3, 4]
   * formApi.filterFieldValues('items', (item) => item % 2 === 0)
   * // items: [2, 4]
   * ```
   */
  filterFieldValues: FilterFieldValuesFn<TFormData>
}

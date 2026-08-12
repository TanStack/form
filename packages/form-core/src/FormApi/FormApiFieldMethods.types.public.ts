import type { DeepKeys, DeepValue } from '../deep-keys.public'
import type { FieldUpdateOptions, Updater } from '../types.public'

/**
 * Updates the current value at a field path.
 *
 * The next value may be supplied directly or calculated from the current
 * value. By default, the update marks the field as touched and dirty, notifies
 * change listeners, and runs change validation.
 *
 * @example
 * ```ts
 * formApi.setFieldValue('profile.name', 'Ada')
 * formApi.setFieldValue('visitCount', (count) => count + 1)
 * ```
 *
 * @param DeepKeys - The field path to update.
 * @param value - The next value or an updater that receives the current value.
 * @param options - Controls metadata updates and whether validation runs.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TDeepKeys - Library-managed. Do not specify explicitly.
 */
export type SetFieldValueFn<in out TFormData> = <
  TDeepKeys extends DeepKeys<TFormData>,
>(
  DeepKeys: TDeepKeys,
  value: Updater<DeepValue<TFormData, TDeepKeys>>,
  options?: FieldUpdateOptions,
) => void

/**
 * Reads the current value at a field path.
 *
 * This is a read-only operation and does not create a `FieldApi` for the path.
 *
 * @example
 * ```ts
 * const name = formApi.getFieldValue('profile.name')
 * ```
 *
 * @param DeepKeys - The field path to read.
 * @returns The current value at the path, or `undefined` when the path cannot
 * be resolved at runtime.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TDeepKeys - Library-managed. Do not specify explicitly.
 */
export type GetFieldValueFn<in out TFormData> = <
  TDeepKeys extends DeepKeys<TFormData>,
>(
  DeepKeys: TDeepKeys,
) => DeepValue<TFormData, TDeepKeys>

/**
 * Restores a field path from `defaultValues` and resets state for its field
 * subtree.
 *
 * Existing `FieldApi` instances at or below the path remain mounted. Pending
 * validation is canceled, field metadata is cleared, and reset listeners are
 * notified. Form-wide dirty history remains unchanged; use `formApi.reset()`
 * to clear it.
 *
 * @example
 * ```ts
 * formApi.setFieldValue('profile.name', 'Grace')
 * formApi.resetField('profile.name')
 * // `profile.name` is restored from `defaultValues`.
 * ```
 *
 * @param DeepKeys - The field path to reset.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TDeepKeys - Library-managed. Do not specify explicitly.
 */
export type ResetFieldFn<in out TFormData> = <
  TDeepKeys extends DeepKeys<TFormData>,
>(
  DeepKeys: TDeepKeys,
) => void

/**
 * Type-safe methods for reading, updating, and resetting individual field
 * values.
 *
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 */
export interface FormApiFieldMethods<in out TFormData> {
  /**
   * Updates the current value at a field path.
   *
   * The next value may be supplied directly or calculated from the current
   * value. By default, the update marks the field as touched and dirty,
   * notifies change listeners, and runs change validation.
   *
   * @example
   * ```ts
   * formApi.setFieldValue('profile.name', 'Ada')
   * formApi.setFieldValue('visitCount', (count) => count + 1)
   * ```
   */
  setFieldValue: SetFieldValueFn<TFormData>

  /**
   * Reads the current value at a field path.
   *
   * This is a read-only operation and does not create a `FieldApi` for the path.
   *
   * @example
   * ```ts
   * const name = formApi.getFieldValue('profile.name')
   * ```
   *
   * @returns The current value at the path, or `undefined` when the path cannot
   * be resolved at runtime.
   */
  getFieldValue: GetFieldValueFn<TFormData>

  /**
   * Restores a field path from `defaultValues` and resets state for its field
   * subtree.
   *
   * Existing `FieldApi` instances at or below the path remain mounted.
   * Form-wide dirty history remains unchanged; use `formApi.reset()` to clear
   * it.
   *
   * @example
   * ```ts
   * formApi.setFieldValue('profile.name', 'Grace')
   * formApi.resetField('profile.name')
   * // `profile.name` is restored from `defaultValues`.
   * ```
   */
  resetField: ResetFieldFn<TFormData>
}

import type { FieldApi } from './FieldApi/FieldApi.public'

export type UpdateFn<in out TValue> = (previousValue: TValue) => TValue
export type Updater<TValue> = TValue | UpdateFn<TValue>

export interface FieldUpdateOptions {
  /**
   * Whether to mark the field as touched from the update.
   *
   * @default true
   */
  markAsTouched?: boolean
  /**
   * Whether to mark the field as dirty from the update.
   *
   * @default true
   */
  markAsDirty?: boolean
  /**
   * Whether to mark the field as blurred from the update.
   *
   * @default: Only true if the emitted event is a blur
   */
  markAsBlurred?: boolean
  /**
   * Whether to cause a validation run from the update.
   *
   * @default true
   */
  causeValidation?: boolean
}

export type OneOrMany<TValue> = TValue | Array<TValue>

/**
 * A field API that preserves its value type while erasing its name, error, and
 * owning form types.
 *
 * Use it for reusable value-specific UI or helpers that should accept the same
 * value type at any field path. Value reads and updates remain typed without
 * tying the reusable code to one path or form shape.
 *
 * @example
 * ```ts
 * function trimField(field: FieldWithValue<string>) {
 *   field.handleChange((value) => value.trim())
 * }
 * ```
 */
export type FieldWithValue<TFieldValue> = FieldApi<
  any,
  TFieldValue,
  any,
  any,
  any
>

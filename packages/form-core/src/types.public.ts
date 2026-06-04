import type { FieldApi } from './FieldApi/FieldApi.public'

export type UpdateFn<TValue> = (previousValue: TValue) => TValue
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

export type FieldWithValue<TFieldValue> = FieldApi<
  any,
  any,
  TFieldValue,
  any,
  any,
  any,
  any,
  any
>

export type Updater<T> = T | ((prev: T) => T)

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
}

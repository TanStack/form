export type UpdateFn<T> = (previousValue: T) => T
export type Updater<T> = T | UpdateFn<T>

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
   * Whether to cause a validation run from the update.
   *
   * @default true
   */
  causeValidation?: boolean
}

export type OneOrMany<T> = T | Array<T>

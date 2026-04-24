import type { FormApi } from './FormApi.public'

export interface FieldMeta {
  isTouched: boolean
}

export interface FieldApi<TFormData> {
  /**
   * The form that owns this field.
   */
  form: FormApi<TFormData>
  /**
   * The name of the field.
   */
  get name(): string
  /**
   * Swap two elements in this field's array.
   * If this field is not an array, this method will be ignored.
   */
  swapValues: (indexA: number, indexB: number) => void
}

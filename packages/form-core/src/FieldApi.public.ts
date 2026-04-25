import type { Updater } from './types.public'
import type { FormApi } from './FormApi.public'

// field.meta
// field.errors
// field.state

/**
 * field.state.value
 * field.state.isTouched
 * field.state.errors
 */

export interface FieldMeta {
  isTouched: boolean
  errors: FieldErrors
}

export interface FieldState {
  value: any
  meta: FieldMeta
}

export type FieldErrors = Array<any>

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

  /**
   * @deprecated
   * Use the respective getters instead:
   * - `field.value`
   * - `field.errors`
   * - `field.meta`
   */
  state: FieldState

  value: any

  meta: FieldMeta

  errors: FieldErrors

  handleChange: (value: Updater<any>) => void
}

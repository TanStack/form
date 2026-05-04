import type { FieldUpdateOptions, Updater } from './types.public'
import type { FormApi } from './FormApi.public'
import type {
  FieldValidator,
  FormValidationError,
  FormValidator,
} from './validation.public'

/**
 * field.state.value
 * field.state.isTouched
 * field.state.errors
 */

export interface BaseFieldMeta {
  isTouched: boolean
  isDirty: boolean
  errors: FieldErrors
  formValidatorErrors: Array<Array<FormValidationError>>
  childErrorCount: number
}

export interface FieldMeta extends BaseFieldMeta {
  isPristine: boolean
  isInvalid: boolean
  isValid: boolean
}

export interface FieldState {
  value: any
  meta: FieldMeta
}

export type FieldErrors = Array<any>

export interface FieldApi<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
> {
  /**
   * The form that owns this field.
   */
  form: FormApi<TFormData, TFormValidators>

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
   * Push a new value into this field's array.
   * If this field is not an array, this method will be ignored.
   */
  pushValue: (value: any, options?: FieldUpdateOptions) => void

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

  handleChange: (value: Updater<any>, options?: FieldUpdateOptions) => void
}

export interface FieldApiOptions<TFormData, TFieldValue> {
  name: string
  validators?: Array<FieldValidator<TFormData, TFieldValue>>
}

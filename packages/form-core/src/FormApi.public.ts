import type { FieldUpdateOptions } from './types.public'
import type { ReadonlyAtom } from '@tanstack/store'
import type {
  FormValidationError,
  FormValidator,
  ValidationSignal,
} from './validation.public'

export interface FormOptions<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
> {
  defaultValues: TData
  validators?: TFormValidators
}

export interface FormState<TData> {
  /**
   * The current values of the form.
   */
  values: TData
  /**
   * Whether the form has been touched.
   */
  isTouched: boolean
  /**
   * Whether the form has been dirtied. The opposite of `isPristine`.
   *
   * TODO add link to persistent dirty model? Or maybe a reference to isDefaultValue?
   */
  isDirty: boolean
  /**
   * Whether the form has not yet been dirtied. The opposite of `isDirty`.
   */
  isPristine: boolean
  /**
   * Array of form-level validation errors.
   */
  formErrors: Array<FormValidationError>
}

export interface FormApi<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
> {
  store: ReadonlyAtom<FormState<TData>>
  readonly state: FormState<TData>
  readonly options: FormOptions<TData, TFormValidators>

  /**
   * TODO expand on it
   *
   * Validates with the given validation signal and returns
   * errors if they appeared. It will automatically populate the
   * form's error state.
   */
  validate: (signal: ValidationSignal) => Promise<Array<FormValidationError>>

  /**
   * TODO for later: submit meta
   *
   */
  handleSubmit: () => Promise<any>

  /**
   * TODO
   * @param fieldName
   * @param updater
   */
  setFieldValue: (
    fieldName: string,
    value: any,
    options?: FieldUpdateOptions,
  ) => void

  /**
   * TODO
   * @param fieldName
   * @returns
   */
  getFieldValue: (fieldName: string) => any

  /**
   * TODO
   * @param arrayFieldName
   * @param indexA
   * @param indexB
   */
  swapFieldValues: (
    arrayFieldName: string,
    indexA: number,
    indexB: number,
  ) => void

  /**
   * TODO
   * @param arrayFieldName
   * @param value
   * @param options
   * @returns
   */
  pushFieldValue: (
    arrayFieldName: string,
    value: any,
    options?: FieldUpdateOptions,
  ) => void

  insertFieldValue: (
    arrayFieldName: string,
    index: number,
    value: any,
    options?: FieldUpdateOptions,
  ) => void

  clearFieldValues: (arrayFieldName: string) => void
}

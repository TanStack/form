import type { FieldUpdateOptions } from './types.public'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type { BaseFieldMeta, FieldApi } from './FieldApi.public'
import type { FormValidator } from './validation.public'

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
}

export interface FormApi<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
> {
  store: ReadonlyAtom<FormState<TData>>
  fieldMetaAtom: Atom<
    ReadonlyMap<FieldApi<TData, TFormValidators>, BaseFieldMeta>
  >
  readonly state: FormState<TData>
  readonly options: FormOptions<TData, TFormValidators>

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
}

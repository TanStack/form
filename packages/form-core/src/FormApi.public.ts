import type { FieldUpdateOptions } from './types.public'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type { BaseFieldMeta, FieldApi } from './FieldApi.public'

export interface FormOptions<TData> {
  defaultValues: TData
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
}

export interface FormApi<TData> {
  store: ReadonlyAtom<FormState<TData>>
  fieldMetaAtom: Atom<ReadonlyMap<FieldApi<TData>, BaseFieldMeta>>
  state: FormState<TData>
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

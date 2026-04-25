import type { Atom } from '@tanstack/store'
import type { FieldApi, FieldMeta } from './FieldApi.public'

export interface FormOptions<TData> {
  defaultValues: TData
}

export interface FormState<TData> {
  values: TData
}

export interface FormApi<TData> {
  storeAtom: Atom<FormState<TData>>
  fieldMetaAtom: Atom<Map<FieldApi<TData>, FieldMeta>>
  state: FormState<TData>
  /**
   * TODO
   * @param fieldName
   * @param updater
   */
  setFieldValue: (fieldName: string, value: any) => void

  /**
   * TODO
   * @param fieldName
   * @returns
   */
  getFieldValue: (fieldName: string) => any
}

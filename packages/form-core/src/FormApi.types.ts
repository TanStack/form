import type { Atom } from '@tanstack/store'
import type { FieldMeta } from './FieldApi.types'

export interface FormOptions<TData> {
  defaultValues: TData
}

export interface FormState<TData> {
  values: TData
}

export interface FormApi<TData> {
  baseAtom: Atom<FormState<TData>>
  fieldMetaAtom: Atom<Partial<Record<string, FieldMeta>>>
}

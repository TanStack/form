import type { Atom } from '@tanstack/store'

export interface FormOptions<TData> {
  defaultValues: TData
}

export interface FormState<TData> {
  values: TData
}

export interface FormApi<TData> {
  baseAtom: Atom<FormState<TData>>
}

import type { DeepKeys, FieldOptions } from '@tanstack/form-core'

export type UseFieldOptions<
  TData,
  TFormData,
  TName = unknown extends TFormData ? string : DeepKeys<TFormData>,
> = FieldOptions<TData, TFormData, TName> & {
  mode?: 'value' | 'array'
}

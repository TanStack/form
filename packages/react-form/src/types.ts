import type { FieldOptions, DeepKeys } from '@tanstack/form-core'

export type UseFieldOptions<
  TData,
  TFormData,
  ValidatorType,
  TName = unknown extends TFormData ? string : DeepKeys<TFormData>,
> = FieldOptions<TData, TFormData, ValidatorType, TName> & {
  mode?: 'value' | 'array'
}

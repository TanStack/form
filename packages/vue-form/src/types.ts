import type { FieldOptions, DeepKeys } from '@tanstack/form-core'

export type UseFieldOptions<
  TData,
  TParentData,
  TName extends DeepKeys<TParentData>,
> = FieldOptions<TData, TParentData, TName> & {
  mode?: 'value' | 'array'
}

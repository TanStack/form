import type { FieldOptions, DeepKeys, DeepValue } from '@tanstack/form-core'

export type CreateFieldOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData = DeepValue<TParentData, TName>,
> = FieldOptions<TParentData, TName, TData> & {
  mode?: 'value' | 'array'
}

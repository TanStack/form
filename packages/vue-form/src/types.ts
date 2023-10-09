import type { FieldOptions, DeepKeys, DeepValue } from '@tanstack/form-core'

export type UseFieldOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  TData = DeepValue<TParentData, TName>,
> = FieldOptions<TParentData, TName, ValidatorType, TData> & {
  mode?: 'value' | 'array'
}

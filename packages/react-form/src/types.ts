import type { FieldOptions, DeepKeys, DeepValue } from '@tanstack/form-core'

export type UseFieldOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = FieldOptions<TParentData, TName, ValidatorType, FormValidator, TData> & {
  mode?: 'value' | 'array'
}

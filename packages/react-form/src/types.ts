import type {
  FieldOptions,
  DeepKeys,
  DeepValue,
  Validator,
} from '@tanstack/form-core'

export type UseFieldOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = FieldOptions<TParentData, TName, TFieldValidator, TFormValidator, TData> & {
  mode?: 'value' | 'array'
}

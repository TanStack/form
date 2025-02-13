import type {
  DeepKeys,
  DeepValue,
  FieldApiOptions,
  Validator,
} from '@tanstack/form-core'

export type CreateFieldOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TParentMetaExtension = never,
> = FieldApiOptions<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  TData,
  TParentMetaExtension
> & {
  mode?: 'value' | 'array'
}

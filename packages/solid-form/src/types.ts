import type {
  DeepKeys,
  DeepValue,
  FieldApiOptions,
  StandardSchemaV1,
  Validator,
} from '@tanstack/form-core'

export type CreateFieldOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<
    DeepValue<TParentData, TName>,
    unknown
  > = Validator<
    DeepValue<TParentData, TName>,
    StandardSchemaV1<DeepValue<TParentData, TName>>
  >,
  TFormValidator extends Validator<TParentData, unknown> = Validator<
    TParentData,
    StandardSchemaV1<TParentData>
  >,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = FieldApiOptions<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  TData
> & {
  mode?: 'value' | 'array'
}

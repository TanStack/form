import type {
  DeepKeys,
  DeepValue,
  FieldApiOptions,
  StandardSchemaValidator,
  Validator,
} from '@tanstack/form-core'
import type { FunctionComponent } from 'react'

/**
 * The field options.
 */
export type UseFieldOptions<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends Validator<
    DeepValue<TParentData, TName>,
    unknown
  > = StandardSchemaValidator,
  TFormValidator extends Validator<
    TParentData,
    unknown
  > = StandardSchemaValidator,
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

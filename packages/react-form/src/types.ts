import type {
  DeepKeys,
  DeepValue,
  FieldApiOptions,
  Validator,
} from '@tanstack/form-core'
import { ReactFormExtendedApi } from './useForm'

/**
 * The field options.
 */
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
> = FieldApiOptions<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  TData
> & {
  mode?: 'value' | 'array'
}

/**
 * The return type use useForm with pre-populated generics
 */
export type UseFormReturnType<TForm, TFormValidator> = TFormValidator extends
  | Validator<TForm, unknown>
  | undefined
  ? ReactFormExtendedApi<TForm, TFormValidator>
  : never

import type {
  DeepKeys,
  DeepValue,
  FieldApiOptions,
  Validator,
} from '@tanstack/form-core'
import type { FunctionComponent } from 'rehackt'

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
 * The return type of React.ReactNode appears to change between React 4.9 and 5.0
 *
 * This means that if we replace this type with React.ReactNode, there will be
 * random typings the fail between React 4.9 and 5.0. This is a hack that resolves this issue.
 */
export type NodeType = ReturnType<FunctionComponent>

import type {
  DeepKeys,
  DeepValue,
  FieldApiOptions,
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
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
> = FieldApiOptions<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  TData,
  TOnMountReturn,
  TOnChangeReturn,
  TOnChangeAsyncReturn,
  TOnBlurReturn,
  TOnBlurAsyncReturn,
  TOnSubmitReturn,
  TOnSubmitAsyncReturn,
  TFormOnMountReturn,
  TFormOnChangeReturn,
  TFormOnChangeAsyncReturn,
  TFormOnBlurReturn,
  TFormOnBlurAsyncReturn,
  TFormOnSubmitReturn,
  TFormOnSubmitAsyncReturn,
  TFormOnServerReturn
> & {
  mode?: 'value' | 'array'
}

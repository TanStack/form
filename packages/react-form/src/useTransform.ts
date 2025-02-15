import type { FormApi, FormTransform, Validator } from '@tanstack/form-core'

export function useTransform<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
>(
  fn: (
    formBase: FormApi<any, any, any, any, any, any, any, any, any>,
  ) => FormApi<
    TFormData,
    TFormValidator,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn
  >,
  deps: unknown[],
): FormTransform<
  TFormData,
  TFormValidator,
  TOnMountReturn,
  TOnChangeReturn,
  TOnChangeAsyncReturn,
  TOnBlurReturn,
  TOnBlurAsyncReturn,
  TOnSubmitReturn,
  TOnSubmitAsyncReturn
> {
  return {
    fn,
    deps,
  }
}

import type { FormApi, FormTransform } from '@tanstack/form-core'

export function useTransform<
  TFormData,
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

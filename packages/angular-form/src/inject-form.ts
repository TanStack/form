import { FormApi } from '@tanstack/form-core'
import { injectStore } from '@tanstack/angular-store'
import type { FormOptions, Validator } from '@tanstack/form-core'

export function injectForm<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
  TOnServerReturn = undefined,
>(
  opts?: FormOptions<
    TFormData,
    TFormValidator,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn,
    TOnServerReturn
  >,
) {
  const api = new FormApi<
    TFormData,
    TFormValidator,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn,
    TOnServerReturn
  >(opts)

  injectStore(api.store, (state) => state.isSubmitting)

  return api
}

import { FormApi } from '@tanstack/form-core'
import { injectStore } from '@tanstack/angular-store'
import type { FormOptions } from '@tanstack/form-core'

export function injectForm<
  TFormData,
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

import { injectStore as injectAngularStore } from '@tanstack/angular-store'
import type { FormApi, FormState, Validator } from '@tanstack/form-core'

export function injectStore<
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
  TSelected = NoInfer<FormState<TFormData>>,
>(
  form: FormApi<
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
  selector?: (
    state: NoInfer<
      FormState<
        TFormData,
        TOnMountReturn,
        TOnChangeReturn,
        TOnChangeAsyncReturn,
        TOnBlurReturn,
        TOnBlurAsyncReturn,
        TOnSubmitReturn,
        TOnSubmitAsyncReturn,
        TOnServerReturn
      >
    >,
  ) => TSelected,
) {
  return injectAngularStore(form.store, selector)
}

import { injectStore as injectAngularStore } from '@tanstack/angular-store'
import type { FormApi, FormState, Validator } from '@tanstack/form-core'

export function injectStore<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
  TSelected = NoInfer<FormState<TFormData>>,
>(
  form: FormApi<TFormData, TFormValidator>,
  selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
) {
  return injectAngularStore(form.store, selector)
}

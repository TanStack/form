import { injectStore as injectAngularStore } from '@tanstack/angular-store'
import type {
  FormApi,
  FormState,
  StandardSchemaV1,
  Validator,
} from '@tanstack/form-core'

export function injectStore<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> = Validator<
    TFormData,
    StandardSchemaV1<TFormData>
  >,
  TSelected = NoInfer<FormState<TFormData>>,
>(
  form: FormApi<TFormData, TFormValidator>,
  selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
) {
  return injectAngularStore(form.store, selector)
}

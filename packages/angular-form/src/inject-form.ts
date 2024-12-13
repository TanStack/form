import { FormApi } from '@tanstack/form-core'
import { injectStore } from '@tanstack/angular-store'
import type {
  FormOptions,
  StandardSchemaV1,
  Validator,
} from '@tanstack/form-core'

export function injectForm<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> = Validator<
    TFormData,
    StandardSchemaV1<TFormData>
  >,
>(opts?: FormOptions<TFormData, TFormValidator>) {
  const api = new FormApi<TFormData, TFormValidator>(opts)

  injectStore(api.store, (state) => state.isSubmitting)

  return api
}

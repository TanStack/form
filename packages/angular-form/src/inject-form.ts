import { FormApi } from '@tanstack/form-core'
import { injectStore } from '@tanstack/angular-store'
import type { FormOptions, Validator } from '@tanstack/form-core'

export function injectForm<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(opts?: FormOptions<TFormData, TFormValidator>) {
  const api = new FormApi<TFormData, TFormValidator>(opts)

  injectStore(api.store, (state) => state.isSubmitting)

  return api
}

import { inject, provide } from 'vue'
import type { FormApi, Validator } from '@tanstack/form-core'

export type FormContext<
  TFormData = any,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = {
  formApi: FormApi<TFormData, TFormValidator>
  parentFieldName?: string
} | null

export const formContext = Symbol('FormContext')

export function provideFormContext<
  TFormData = any,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(val: FormContext<TFormData, TFormValidator>) {
  provide(formContext, val)
}

export function useFormContext() {
  const formApi = inject(formContext) as FormContext

  if (!formApi) {
    throw new Error(`You are trying to use the form API outside of a form!`)
  }

  return formApi
}

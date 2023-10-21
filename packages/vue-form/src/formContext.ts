import type { FormApi } from '@tanstack/form-core'
import { inject, provide } from 'vue-demi'

export type FormContext = {
  formApi: FormApi<any, unknown>
  parentFieldName?: string
} | null

export const formContext = Symbol('FormContext')

export function provideFormContext(val: FormContext) {
  provide(formContext, val)
}

export function useFormContext() {
  const formApi = inject(formContext) as FormContext

  if (!formApi) {
    throw new Error(`You are trying to use the form API outside of a form!`)
  }

  return formApi
}

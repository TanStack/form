import type { FormApi, FormOptions } from '@tanstack/form-core'

import { type UseField, type FieldComponent, Field, useField } from './useField'
import { useForm } from './useForm'

export type FormFactory<TFormData, FormValidator> = {
  useForm: (
    opts?: FormOptions<TFormData, FormValidator>,
  ) => FormApi<TFormData, FormValidator>
  useField: UseField<TFormData, FormValidator>
  Field: FieldComponent<TFormData, FormValidator>
}

export function createFormFactory<TFormData, FormValidator>(
  defaultOpts?: FormOptions<TFormData, FormValidator>,
): FormFactory<TFormData, FormValidator> {
  return {
    useForm: (opts) => {
      const formOptions = Object.assign({}, defaultOpts, opts)
      return useForm<TFormData, FormValidator>(formOptions)
    },
    useField: useField as any,
    Field: Field as any,
  }
}

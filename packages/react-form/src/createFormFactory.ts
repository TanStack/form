import type { FormApi, FormOptions } from '@tanstack/form-core'

import { type UseField, type FieldComponent, Field, useField } from './useField'
import { useForm } from './useForm'

export type FormFactory<TFormData> = {
  useForm: (opts?: FormOptions<TFormData>) => FormApi<TFormData>
  useField: UseField<TFormData>
  Field: FieldComponent<TFormData, TFormData>
}

export function createFormFactory<TFormData>(
  defaultOpts?: FormOptions<TFormData>,
): FormFactory<TFormData> {
  return {
    useForm: (opts) => {
      const formOptions = Object.assign({}, defaultOpts, opts)
      return useForm<TFormData>(formOptions)
    },
    useField: useField as any,
    Field: Field as any,
  }
}

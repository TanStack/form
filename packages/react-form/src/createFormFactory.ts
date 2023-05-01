import type { FormApi, FormOptions } from '@tanstack/form-core'
import { createUseField, type UseField } from './useField'
import { useForm } from './useForm'
import { createFieldComponent, type FieldComponent } from './Field'

export type FormFactory<TFormData> = {
  useForm: (opts?: FormOptions<TFormData>) => FormApi<TFormData>
  useField: UseField<TFormData>
  Field: FieldComponent<TFormData>
}

export function createFormFactory<TFormData>(
  defaultOpts?: FormOptions<TFormData>,
): FormFactory<TFormData> {
  return {
    useForm: (opts) => {
      return useForm<TFormData>({ ...defaultOpts, ...opts } as any) as any
    },
    useField: createUseField<TFormData>(),
    Field: createFieldComponent<TFormData>(),
  }
}

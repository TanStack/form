import type { FormApi, FormOptions } from '@tanstack/form-core'
import { createUseField, type UseField } from './useField'
import { useForm } from './useForm'

export type FormFactory<TFormData> = {
  useForm: (opts?: FormOptions<TFormData>) => FormApi<TFormData>
  useField: UseField<TFormData>
}

export function createFormFactory<TFormData>(
  defaultOpts?: FormOptions<TFormData>,
): FormFactory<TFormData> {
  return {
    useForm: (opts) => {
      return useForm<TFormData>({ ...defaultOpts, ...opts } as any) as any
    },
    useField: createUseField(),
  }
}

import type { FormApi, FormOptions } from '@tanstack/form-core'

import {
  type UseField,
  type FieldComponent,
  Field,
  createField,
} from './createField'
import { createForm } from './createForm'
import { mergeProps } from 'solid-js'

export type FormFactory<TFormData> = {
  createForm: (opts?: () => FormOptions<TFormData>) => FormApi<TFormData>
  createField: UseField<TFormData>
  Field: FieldComponent<TFormData>
}

export function createFormFactory<TFormData>(
  defaultOpts?: () => FormOptions<TFormData>,
): FormFactory<TFormData> {
  return {
    createForm: (opts) =>
      createForm<TFormData>(() =>
        mergeProps(defaultOpts?.() ?? {}, opts?.() ?? {}),
      ),
    createField: createField,
    Field: Field<TFormData>,
  }
}

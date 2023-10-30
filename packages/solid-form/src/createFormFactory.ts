import type { FormApi, FormOptions } from '@tanstack/form-core'

import {
  type CreateField,
  type FieldComponent,
  Field,
  createField,
} from './createField'
import { createForm } from './createForm'
import { mergeProps } from 'solid-js'

export type FormFactory<TFormData, FormValidator> = {
  createForm: (
    opts?: () => FormOptions<TFormData, FormValidator>,
  ) => FormApi<TFormData, FormValidator>
  createField: CreateField<TFormData>
  Field: FieldComponent<TFormData, FormValidator>
}

export function createFormFactory<TFormData, FormValidator>(
  defaultOpts?: () => FormOptions<TFormData, FormValidator>,
): FormFactory<TFormData, FormValidator> {
  return {
    createForm: (opts) =>
      createForm<TFormData, FormValidator>(() =>
        mergeProps(defaultOpts?.() ?? {}, opts?.() ?? {}),
      ),
    createField,
    Field: Field as never,
  }
}

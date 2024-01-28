import type { FormApi, FormOptions, Validator } from '@tanstack/form-core'

import {
  type CreateField,
  type FieldComponent,
  Field,
  createField,
} from './createField'
import { createForm } from './createForm'
import { mergeProps } from 'solid-js'

export type FormFactory<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = {
  createForm: (
    opts?: () => FormOptions<TFormData, TFormValidator>,
  ) => FormApi<TFormData, TFormValidator>
  createField: typeof createField
  Field: typeof Field
}

export function createFormFactory<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(
  defaultOpts?: () => FormOptions<TFormData, TFormValidator>,
): FormFactory<TFormData, TFormValidator> {
  return {
    createForm: (opts) =>
      createForm<TFormData, TFormValidator>(() =>
        mergeProps(defaultOpts?.() ?? {}, opts?.() ?? {}),
      ),
    createField,
    Field: Field,
  }
}

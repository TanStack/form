import { mergeProps } from 'solid-js'
import {
  type CreateField,
  Field,
  type FieldComponent,
  createField,
} from './createField'
import { createForm } from './createForm'
import type { FormApi, FormOptions, Validator } from '@tanstack/form-core'

export type FormFactory<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = {
  createForm: (
    opts?: () => FormOptions<TFormData, TFormValidator>,
  ) => FormApi<TFormData, TFormValidator>
  createField: CreateField<TFormData>
  Field: FieldComponent<TFormData, TFormValidator>
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
    Field: Field as never,
  }
}

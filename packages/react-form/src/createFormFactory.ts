import type { FormApi, FormOptions, Validator } from '@tanstack/form-core'

import { type UseField, type FieldComponent, Field, useField } from './useField'
import { useForm } from './useForm'
import { ValidateFormData, getValidateFormData } from './validateFormData'

export type FormFactory<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> = {
  useForm: (
    opts?: FormOptions<TFormData, TFormValidator>,
  ) => FormApi<TFormData, TFormValidator>
  useField: UseField<TFormData>
  Field: FieldComponent<TFormData, TFormValidator>
  validateFormData: ValidateFormData<TFormData, TFormValidator>
  initialFormState: Partial<FormApi<TFormData, TFormValidator>['state']>
}

export function createFormFactory<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(
  defaultOpts?: FormOptions<TFormData, TFormValidator>,
): FormFactory<TFormData, TFormValidator> {
  return {
    useForm: (opts) => {
      const formOptions = Object.assign({}, defaultOpts, opts)
      return useForm<TFormData, TFormValidator>(formOptions)
    },
    useField: useField as any,
    Field: Field as any,
    validateFormData: getValidateFormData(defaultOpts) as never,
    initialFormState: {
      errorMap: {
        onServer: undefined,
      },
      errors: [],
    },
  }
}

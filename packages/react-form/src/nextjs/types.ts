import type { FormAsyncValidateOrFn, FormState } from '@tanstack/form-core'

export type ServerFormState<
  TFormData,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
> = Pick<
  FormState<
    TFormData,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    TOnServer
  >,
  'values' | 'errors' | 'errorMap'
>

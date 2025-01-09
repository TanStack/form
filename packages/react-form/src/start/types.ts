import type { FormState } from '@tanstack/form-core'

export type ServerFormState<TFormData, TOnServerReturn = undefined> = Pick<
  FormState<
    TFormData,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    TOnServerReturn
  >,
  'values' | 'errors' | 'errorMap'
>

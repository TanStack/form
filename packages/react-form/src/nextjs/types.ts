import type { FormState } from '@tanstack/form-core'

export type ServerFormState<TFormData> = Pick<
  FormState<TFormData>,
  'values' | 'errors' | 'errorMap'
>

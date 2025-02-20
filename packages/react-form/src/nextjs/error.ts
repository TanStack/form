import type { ServerFormState } from './types'
import type { FormAsyncValidateOrFn } from '@tanstack/form-core'

interface ServerValidateErrorState<
  TFormData,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
> {
  formState: ServerFormState<TFormData, TOnServer>
}

export class ServerValidateError<
    TFormData,
    TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  >
  extends Error
  implements ServerValidateErrorState<TFormData, TOnServer>
{
  formState: ServerFormState<TFormData, TOnServer>

  constructor(options: ServerValidateErrorState<TFormData, TOnServer>) {
    super('Your form has errors. Please check the fields and try again.')
    this.name = 'ServerValidateError'
    this.formState = options.formState
  }
}

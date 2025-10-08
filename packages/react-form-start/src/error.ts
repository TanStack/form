import type {
  FormAsyncValidateOrFn,
  ServerFormState,
} from '@tanstack/react-form'

interface ServerValidateErrorState<
  TFormData,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
> {
  formState: ServerFormState<TFormData, TOnServer>
  response: Response
}

export class ServerValidateError<
    TFormData,
    TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  >
  extends Error
  implements ServerValidateErrorState<TFormData, TOnServer>
{
  formState: ServerFormState<TFormData, TOnServer>
  response: Response

  constructor(options: ServerValidateErrorState<TFormData, TOnServer>) {
    super('Your form has errors. Please check the fields and try again.')
    this.name = 'ServerValidateError'
    this.response = options.response
    this.formState = options.formState
  }
}

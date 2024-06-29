import type { ServerFormState } from './types'

interface ServerValidateErrorState<TFormData> {
  formState: ServerFormState<TFormData>
  response: Response
}

export class ServerValidateError<TFormData>
  extends Error
  implements ServerValidateErrorState<TFormData>
{
  response: Response
  formState: ServerFormState<TFormData>

  constructor(options: ServerValidateErrorState<TFormData>) {
    super('Your form has errors. Please check the fields and try again.')
    this.name = 'ServerValidateError'
    this.response = options.response
    this.formState = options.formState
  }
}

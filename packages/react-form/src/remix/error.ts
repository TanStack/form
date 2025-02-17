import type { ServerFormState } from './types'

interface ServerValidateErrorState<TFormData, TOnServerReturn = undefined> {
  formState: ServerFormState<TFormData, TOnServerReturn>
}

export class ServerValidateError<TFormData, TOnServerReturn = undefined>
  extends Error
  implements ServerValidateErrorState<TFormData, TOnServerReturn>
{
  formState: ServerFormState<TFormData, TOnServerReturn>

  constructor(options: ServerValidateErrorState<TFormData, TOnServerReturn>) {
    super('Your form has errors. Please check the fields and try again.')
    this.name = 'ServerValidateError'
    this.formState = options.formState
  }
}

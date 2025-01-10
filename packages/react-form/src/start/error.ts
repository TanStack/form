import type { AnyRouter, Redirect } from '@tanstack/react-router'
import type { ServerFormState } from './types'

interface ServerValidateErrorState<TFormData, TOnServerReturn = undefined> {
  formState: ServerFormState<TFormData, TOnServerReturn>
  redirect: Redirect<AnyRouter, string, string, string, string>
}

export class ServerValidateError<TFormData, TOnServerReturn = undefined>
  extends Error
  implements ServerValidateErrorState<TFormData, TOnServerReturn>
{
  formState: ServerFormState<TFormData, TOnServerReturn>
  redirect: Redirect<AnyRouter, string, string, string, string>

  constructor(options: ServerValidateErrorState<TFormData, TOnServerReturn>) {
    super('Your form has errors. Please check the fields and try again.')
    this.name = 'ServerValidateError'
    this.redirect = options.redirect
    this.formState = options.formState
  }
}

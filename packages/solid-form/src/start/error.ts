import { reload } from '@solidjs/router'
import type { ServerFormState } from './types'

interface ServerValidateErrorState<TFormData> {
  formState: ServerFormState<TFormData>
  reload: ReturnType<typeof reload>
}

export class ServerValidateError<TFormData>
  extends Error
  implements ServerValidateErrorState<TFormData>
{
  reload: ReturnType<typeof reload>
  formState: ServerFormState<TFormData>

  constructor(options: ServerValidateErrorState<TFormData>) {
    super('Your form has errors. Please check the fields and try again.')
    this.name = 'ServerValidateError'
    this.reload = options.reload
    this.formState = options.formState
  }
}

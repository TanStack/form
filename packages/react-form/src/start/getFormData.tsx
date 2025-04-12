import * as utils from './utils'
import type { ServerFormState } from './types'

export const initialFormState = {
  errorMap: {
    onServer: undefined,
  },
  errors: [],
}

export const getFormData = async () => {
  const data = utils.getInternalTanstackCookie() as
    | undefined
    | ServerFormState<any, undefined>
  // Delete the temporary cookie from the client after reading it
  utils.deleteInternalTanstackCookie()
  if (!data) return initialFormState
  return data
}

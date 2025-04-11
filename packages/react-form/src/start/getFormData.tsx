import { deleteCookie } from '@tanstack/react-start/server'
import { _tanstackInternalsCookie } from './utils'
import type { ServerFormState } from './types'

export const initialFormState = {
  errorMap: {
    onServer: undefined,
  },
  errors: [],
}

export const getFormData = async () => {
  const data = _tanstackInternalsCookie.get() as
    | undefined
    | ServerFormState<any, undefined>
  // Delete the temporary cookie from the client after reading it
  deleteCookie(_tanstackInternalsCookie.name)
  if (!data) return initialFormState
  return data
}

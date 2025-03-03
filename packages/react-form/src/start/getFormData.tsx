import { getHeader, removeResponseHeader } from '@tanstack/react-start/server'
import { _tanstackInternalsCookie } from './utils'
import type { ServerFormState } from './types'

export const initialFormState = {
  errorMap: {
    onServer: undefined,
  },
  errors: [],
}

export const getFormData = async () => {
  const data = (await _tanstackInternalsCookie.parse(getHeader('Cookie')!)) as
    | undefined
    | ServerFormState<any, undefined>
  // Delete the cookie before it hits the client again¸
  removeResponseHeader('Cookie')
  if (!data) return initialFormState
  return data
}

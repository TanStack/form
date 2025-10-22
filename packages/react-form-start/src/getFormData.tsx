import { createServerFn } from '@tanstack/react-start'
import {
  deleteInternalTanStackCookie,
  getInternalTanStackCookie,
} from './utils'
import type { ServerFormState } from '@tanstack/react-form'

export const initialFormState = {
  errorMap: {
    onServer: undefined,
  },
  errors: [],
}

export const getFormData = createServerFn().handler(async () => {
  const data = getInternalTanStackCookie() as
    | undefined
    | ServerFormState<any, undefined>
  // Delete the temporary cookie from the client after reading it
  deleteInternalTanStackCookie()
  if (!data) return initialFormState
  return data
})

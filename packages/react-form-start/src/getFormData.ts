import { createServerFn } from '@tanstack/react-start'
import { initialServerFormState } from '@tanstack/form-core'
import {
  deleteInternalTanStackCookie,
  getInternalTanStackCookie,
} from './utils'

export const getFormData = createServerFn({
  strict: { output: false },
}).handler(async () => {
  const data = getInternalTanStackCookie()
  deleteInternalTanStackCookie()

  return data ?? initialServerFormState
})

import { createServerFn } from '@tanstack/start'
import { _tanstackInternalsCookie } from './utils'
import type { ServerFormState } from './types'

export const initialFormState = {
  errorMap: {
    onServer: undefined,
  },
  errors: [],
}

export const getFormData = createServerFn('GET', async (_, ctx) => {
  const data = (await _tanstackInternalsCookie.parse(
    ctx.request.headers.get('Cookie'),
  )) as undefined | ServerFormState<any>
  // Delete the cookie before it hits the client again¸
  ctx.request.headers.delete('Cookie')
  if (!data) return initialFormState
  return data
})

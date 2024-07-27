import { _tanstackInternalsCookie } from './utils'
import type { FetchFnCtx } from '@tanstack/start'
import type { ServerFormState } from './types'

export const initialFormState = {
  errorMap: {
    onServer: undefined,
  },
  errors: [],
}

export const getFormData = async (ctx: FetchFnCtx) => {
  const data = (await _tanstackInternalsCookie.parse(
    ctx.request.headers.get('Cookie'),
  )) as undefined | ServerFormState<any>
  // Delete the cookie before it hits the client again¸
  ctx.request.headers.delete('Cookie')
  if (!data) return initialFormState
  return data
}

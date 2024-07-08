import { type FetchFn } from '@tanstack/start'
import { _tanstackInternalsCookie } from './utils'
import type { ServerFormState } from './types'

type FetchFnCtx = Parameters<FetchFn<never, never>>[1]

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

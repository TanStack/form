import { getRequestEvent } from 'solid-js/web'
import { _tanstackInternalsCookie } from './utils'
import type { ServerFormState } from './types'

export const initialFormState = {
  errorMap: {
    onServer: undefined,
  },
  errors: [],
}

export const getFormData = async () => {
  const ctx = getRequestEvent()!
  const data = (await _tanstackInternalsCookie.parse(
    ctx.request.headers.get('Cookie'),
  )) as undefined | ServerFormState<any>
  if (!data) return initialFormState
  return data
}

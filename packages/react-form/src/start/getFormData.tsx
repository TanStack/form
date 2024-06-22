import { createServerFn } from '@tanstack/start'
import { _tanstackInternalsCookie } from './utils'
import type { FormApi } from '@tanstack/form-core'

export const initialFormState = {
  errorMap: {
    onServer: undefined,
  },
  errors: [],
}

export const getFormData = createServerFn("GET", async (_, ctx) => {
  const data = await _tanstackInternalsCookie.parse(ctx.request.headers.get("Cookie")) as undefined | FormApi<any, any>['state'];
  // Delete the cookie before it hits the client again¸
  ctx.request.headers.delete("Cookie");
  if (!data) return initialFormState;
  return data;
})

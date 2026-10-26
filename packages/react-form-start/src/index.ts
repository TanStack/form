import { createServerFn } from '@tanstack/react-start'
import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server'
import { parse, stringify } from 'devalue'
import type { TanStackFormServerPlugin } from '@tanstack/form-core'

const INTERNALS_COOKIE_NAME = '_tanstack_form_internals'

function getCookieName(formId: string): string {
  return `${INTERNALS_COOKIE_NAME}_${encodeURIComponent(formId)}`
}

const readServerState = createServerFn({
  strict: { output: false },
})
  .validator((formId: string) => {
    if (typeof formId !== 'string') {
      throw new TypeError('Expected a form ID')
    }

    return formId
  })
  .handler(async ({ data: formId }) => {
    const cookieName = getCookieName(formId)
    const cookie = getCookie(cookieName)
    deleteCookie(cookieName)

    if (cookie) {
      return parse(cookie)
    }
    return undefined
  })

export function start(): TanStackFormServerPlugin<
  { formData: FormData },
  FormData
> {
  return {
    getFormData: ({ formData }) => formData,
    persistServerState: {
      setState: (formId, serverState) => {
        setCookie(getCookieName(formId), stringify(serverState))
      },
      readState: (formId) => readServerState({ data: formId }),
    },
  }
}

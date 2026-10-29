import { createTanStackFormServerPlugin } from '@tanstack/form-core'
import { createServerFn } from '@tanstack/react-start'
import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server'
import { parse, stringify } from 'devalue'

const INTERNALS_COOKIE_NAME = '_tanstack_form_internals'

function getCookieName(transportId: string): string {
  return `${INTERNALS_COOKIE_NAME}_${encodeURIComponent(transportId)}`
}

const readServerState = createServerFn({
  strict: { output: false },
})
  .validator((transportId: string) => {
    if (typeof transportId !== 'string') {
      throw new TypeError('Expected a form ID')
    }

    return transportId
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

export function start() {
  return createTanStackFormServerPlugin({
    submittedDataType: new FormData(),
    transportMiddleware: {
      setState: (transportId, serverState) => {
        setCookie(getCookieName(transportId), stringify(serverState))
      },
      readState: (transportId) => readServerState({ data: transportId }),
    },
  })
}

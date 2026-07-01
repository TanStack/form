import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server'
import { parse, stringify } from 'devalue'
import type { ServerFormState } from '@tanstack/form-core'

const INTERNALS_COOKIE_NAME = '_tanstack_form_internals'

export function setInternalTanStackCookie(
  serverState: ServerFormState<any, any>,
): void {
  setCookie(INTERNALS_COOKIE_NAME, stringify(serverState))
}

export function getInternalTanStackCookie():
  | ServerFormState<any, any>
  | undefined {
  const cookie = getCookie(INTERNALS_COOKIE_NAME)
  if (!cookie) return undefined

  return parse(cookie) as ServerFormState<any, any>
}

export function deleteInternalTanStackCookie(): void {
  deleteCookie(INTERNALS_COOKIE_NAME)
}

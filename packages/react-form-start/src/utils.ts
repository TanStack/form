import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server'
import { parse, stringify } from 'devalue'

const _INTERNALS_COOKIE_NAME = '_tanstack_form_internals'

export const setInternalTanStackCookie = (data: any) => {
  const cookie = stringify(data)
  setCookie(_INTERNALS_COOKIE_NAME, cookie)
}

export const getInternalTanStackCookie = () => {
  const cookie = getCookie(_INTERNALS_COOKIE_NAME)
  if (!cookie) return undefined
  return parse(cookie)
}

export const deleteInternalTanStackCookie = () => {
  deleteCookie(_INTERNALS_COOKIE_NAME)
}

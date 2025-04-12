import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server'
import * as devalue from 'devalue'

const _INTERNALS_COOKIE_NAME = '_tanstack-internals'

export const setInternalTanstackCookie = (data: any) => {
  const cookie = devalue.stringify(data)
  setCookie(_INTERNALS_COOKIE_NAME, cookie)
}

export const getInternalTanstackCookie = () => {
  const cookie = getCookie(_INTERNALS_COOKIE_NAME)
  if (!cookie) return undefined
  return devalue.parse(cookie)
}

export const deleteInternalTanstackCookie = () => {
  deleteCookie(_INTERNALS_COOKIE_NAME)
}

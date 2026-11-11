import {
  deleteCookie,
  getCookie,
  setCookie,
} from '@tanstack/react-start/server'
import { parse, stringify } from 'devalue'
import type { ServerFormState } from '@tanstack/form-core'

const INTERNALS_COOKIE_NAME = '_tanstack_form_internals'

export function setInternalTanStackCookie(
  serverState: ServerFormState<any>,
): void {
  const state = {
    ...serverState,
    validationResults: serverState.validationResults.map((validation) => {
      const { result } = validation
      return {
        ...validation,
        // Omit the helpers that come with some error maps
        result:
          result && typeof result === 'object' && 'fields' in result
            ? { form: result.form, fields: result.fields }
            : result,
      }
    }),
  }

  setCookie(INTERNALS_COOKIE_NAME, stringify(state))
}

export function getInternalTanStackCookie(): ServerFormState<any> | undefined {
  const cookie = getCookie(INTERNALS_COOKIE_NAME)
  if (!cookie) return undefined

  return parse(cookie) as ServerFormState<any>
}

export function deleteInternalTanStackCookie(): void {
  deleteCookie(INTERNALS_COOKIE_NAME)
}

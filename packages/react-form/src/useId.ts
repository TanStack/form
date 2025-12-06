import { version as reactVersion, useId as useReactId } from 'react'
import { uuid } from '@tanstack/form-core'

/** React 17 does not have the useId hook, so we use a random uuid as a fallback. */
export function useId() {
  if (reactVersion.split('.')[0] === '17') {
    return uuid()
  }

  // react-compiler/react-compiler is disabled because useId is not available in React 17. However in React 18+ it is available and we want to use it.
  // eslint-disable-next-line react-compiler/react-compiler, react-hooks/rules-of-hooks
  return useReactId()
}

import { version as reactVersion, useId as useReactId } from 'react'
import { uuid } from '@tanstack/form-core'

/** React 17 does not have the useId hook, so we use a random uuid as a fallback. */
export const useFormId = reactVersion.split('.')[0] === '17' ? uuid : useReactId

import * as React from 'react'
import { uuid } from '@tanstack/form-core'

/** React 17 does not have the useId hook, so we use a random uuid as a fallback. */
export const useFormId = React.version.split('.')[0] === '17' ? uuid : React.useId

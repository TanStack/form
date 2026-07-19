import { visitFieldAndAncestors } from '@tanstack/form-core/internals'
import type { FieldErrorDebugCase } from './types'

export const schemaErrorOnUnmountedField = {
  evaluate: ({ field, error }) => {
    if (field._isMounted || error.source.validatorType !== 'schema') {
      return undefined
    }

    let mountedAncestorPath: string | undefined
    visitFieldAndAncestors(field, (candidate) => {
      if (candidate === field || !candidate._isMounted) return

      mountedAncestorPath = candidate.name
      return false
    })

    if (!mountedAncestorPath) return undefined

    return {
      kind: 'schema-error-on-unmounted-field',
      evidence: {
        fieldPath: field.name,
        mountedAncestorPath,
      },
    }
  },
} satisfies FieldErrorDebugCase

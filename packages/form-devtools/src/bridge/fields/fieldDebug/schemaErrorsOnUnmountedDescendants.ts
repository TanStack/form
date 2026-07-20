import { visitFieldSubtree } from '@tanstack/form-core/internals'
import { getDevtoolsFieldErrors } from '../detailSnapshot'
import type { FieldDebugCase } from './types'

export const schemaErrorsOnUnmountedDescendants = {
  evaluate: ({ field }) => {
    const unmountedDescendantPaths: Array<string> = []

    visitFieldSubtree(field, (candidate) => {
      if (candidate === field || candidate._isKilled || candidate._isMounted) {
        return
      }

      const hasSchemaError = getDevtoolsFieldErrors(
        candidate,
        candidate.state,
        'messages',
      ).some(({ source }) => source.validatorType === 'schema')

      if (hasSchemaError) unmountedDescendantPaths.push(candidate.name)
    })

    if (unmountedDescendantPaths.length === 0) return undefined

    return {
      kind: 'schema-errors-on-unmounted-descendants',
      evidence: {
        fieldPath: field.name,
        unmountedDescendantPaths,
      },
    }
  },
} satisfies FieldDebugCase

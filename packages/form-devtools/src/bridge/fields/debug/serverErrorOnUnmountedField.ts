import type { FieldErrorDebugCase } from './types'

export const serverErrorOnUnmountedField = {
  evaluate: ({ field, error }) => {
    if (
      field._isMounted ||
      error.source.scope !== 'form' ||
      error.sourceEvent !== 'server'
    ) {
      return undefined
    }

    const validator =
      field.form._validatorInstances?.[error.source.validatorIndex]?.definition
    const hasServerTrigger = validator?.triggers.includes('server')

    if (!hasServerTrigger) return undefined

    return {
      kind: 'server-error-on-unmounted-field',
      evidence: {
        fieldPath: field.name,
      },
    }
  },
} satisfies FieldErrorDebugCase

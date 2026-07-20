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
      field.form.options.validators?.[error.source.validatorIndex]
    const hasServerTrigger = validator?.triggers.some(
      (trigger) => trigger === 'server',
    )

    if (!hasServerTrigger) return undefined

    return {
      kind: 'server-error-on-unmounted-field',
      evidence: {
        fieldPath: field.name,
      },
    }
  },
} satisfies FieldErrorDebugCase

import type { FieldErrorDebugCase } from './types'

export const errorsHidden = {
  evaluate: ({ field }) => {
    if (!field._isMounted) return

    const meta = field.state.meta

    if (meta.errors.length > 0 || meta.original.errors.length === 0) {
      return undefined
    }

    return {
      kind: 'errors-hidden',
      evidence: {
        fieldPath: field.name,
      },
    }
  },
} satisfies FieldErrorDebugCase

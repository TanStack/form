import type { FieldId } from '@/types/branded'
import type { FieldErrorDebugCase } from './types'
import { Code } from '@/components/ui/code'

export const tooSpecificSchemaPath = {
  evaluate: ({ fieldId, error, store }) => {
    const rowsByFieldId = store.fieldList.rowsByFieldId()
    const field = rowsByFieldId.get(fieldId)
    if (field?.isMounted !== false) return undefined
    if (error.source.validatorType !== 'schema') return undefined

    const visited = new Set<FieldId>([fieldId])
    let parentFieldId = field.parentFieldId
    let mountedAncestorPath: string | undefined

    while (parentFieldId) {
      if (visited.has(parentFieldId)) return undefined
      visited.add(parentFieldId)

      const parent = rowsByFieldId.get(parentFieldId)
      if (!parent) return undefined

      if (parent.isMounted !== false) {
        mountedAncestorPath = parent.path
        break
      }
      parentFieldId = parent.parentFieldId
    }

    if (!mountedAncestorPath) return undefined

    return {
      title: 'Schema error in unmounted field',
      description:
        'Schema errors can be overly specific in the field path, causing errors to show up in the wrong field.',
      commonCase: (
        <>
          The mounted field <Code>dateRange</Code> was supposed to receive this
          error, but the schema reported the unmounted field{' '}
          <Code>dateRange.start</Code> instead.
        </>
      ),
      fixes: [
        <>
          If <Code>{mountedAncestorPath}</Code> should receive this error, use{' '}
          <Code>errorBoundary</Code> on that field.
        </>,
        <>
          If <Code>{field.path}</Code> should receive this error, make sure that
          field is mounted.
        </>,
      ],
    }
  },
} satisfies FieldErrorDebugCase

import type { FieldErrorDebugSuspicion } from '@/eventClientTypes'
import type { FieldErrorDebugDetails } from './types'
import { Code } from '@/components/ui/code'

type SchemaErrorOnUnmountedFieldSuspicion = Extract<
  FieldErrorDebugSuspicion,
  { kind: 'schema-error-on-unmounted-field' }
>

export function getSchemaErrorOnUnmountedFieldDetails(
  suspicion: SchemaErrorOnUnmountedFieldSuspicion,
): FieldErrorDebugDetails {
  const { fieldPath, mountedAncestorPath } = suspicion.evidence

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
        If <Code>{fieldPath}</Code> should receive this error, make sure that
        field is mounted.
      </>,
    ],
  }
}

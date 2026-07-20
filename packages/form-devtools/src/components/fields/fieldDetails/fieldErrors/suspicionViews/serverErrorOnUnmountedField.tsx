import type { FieldErrorDebugSuspicion } from '@/eventClientTypes'
import type { FieldErrorDebugDetails } from './types'
import { Code } from '@/components/ui/code'

type ServerErrorOnUnmountedFieldSuspicion = Extract<
  FieldErrorDebugSuspicion,
  { kind: 'server-error-on-unmounted-field' }
>

export function getServerErrorOnUnmountedFieldDetails(
  suspicion: ServerErrorOnUnmountedFieldSuspicion,
): FieldErrorDebugDetails {
  const { fieldPath } = suspicion.evidence

  return {
    title: 'Server expected missing field',
    description: (
      <>
        The server validator reported an error for <Code>{fieldPath}</Code>, but
        that field was not included in the submitted <Code>FormData</Code>.
      </>
    ),
    commonCase: (
      <>
        The field is rendered conditionally and was not on the page when the
        form was submitted. The server still expected to receive{' '}
        <Code>{fieldPath}</Code>.
      </>
    ),
    fixes: [
      <>
        If the field should always be submitted, make sure its form control is
        rendered, belongs to the submitted form, and has the correct{' '}
        <Code>name</Code>.
      </>,
      <>
        If the field is only required in some cases, update the server
        validation so it is optional when the field is not rendered.
      </>,
      <>
        If the server still needs the value when the field is not rendered,
        submit it with a hidden input or add it to the <Code>FormData</Code>{' '}
        yourself.
      </>,
    ],
  }
}

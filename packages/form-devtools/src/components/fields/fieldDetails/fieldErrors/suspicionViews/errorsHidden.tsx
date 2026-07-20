import type { FieldErrorDebugSuspicion } from '@/eventClientTypes'
import type { FieldErrorDebugDetails } from './types'
import { Code } from '@/components/ui/code'

type ErrorsHiddenSuspicion = Extract<
  FieldErrorDebugSuspicion,
  { kind: 'errors-hidden' }
>

export function getErrorsHiddenDetails(
  suspicion: ErrorsHiddenSuspicion,
): FieldErrorDebugDetails {
  const { fieldPath } = suspicion.evidence

  return {
    title: 'Errors are hidden',
    description: (
      <>
        There are errors for <Code>{fieldPath}</Code>, but they are hidden by
        the field's error visibility policy.
      </>
    ),
    commonCase: (
      <>
        The <Code>errorVisibility</Code> callback is waiting for field
        interaction, but the field meta has not been updated by a change or blur
        event.
      </>
    ),
    fixes: [
      <>
        Check the field meta. Is <Code>errorVisibility</Code> returning{' '}
        <Code>true</Code> for it?
      </>,
      <>
        Are <Code>handleChange</Code> and <Code>handleBlur</Code> set? Did the
        callbacks get called?
      </>,
      <>
        Consider a field-level <Code>errorVisibility</Code> if this field should
        behave differently.
      </>,
    ],
  }
}

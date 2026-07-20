import { For } from 'solid-js'
import type { JSX } from 'solid-js'
import type { FieldDebugSuspicion } from '@/eventClientTypes'
import type { DebugDetails } from '../../debug/types'
import { Code } from '@/components/ui/code'

type ValidatorsWithoutTriggersSuspicion = Extract<
  FieldDebugSuspicion,
  { kind: 'validators-without-triggers' }
>

type ValidatorLocation =
  ValidatorsWithoutTriggersSuspicion['evidence']['validators'][number]

function getValidatorLocationText(
  fieldPath: string,
  location: ValidatorLocation,
): JSX.Element {
  const validatorPosition = location.validatorIndex + 1

  switch (location.scope) {
    case 'field':
      return (
        <>
          Field <Code>{fieldPath}</Code> validator{' '}
          <Code>#{validatorPosition}</Code>
        </>
      )
    case 'formGroup':
      return (
        <>
          Form group <Code>{location.formGroupPath}</Code> validator{' '}
          <Code>#{validatorPosition}</Code>
        </>
      )
    case 'form':
      return (
        <>
          Form validator <Code>#{validatorPosition}</Code>
        </>
      )
  }
}

export function getValidatorsWithoutTriggersDetails(
  suspicion: ValidatorsWithoutTriggersSuspicion,
): DebugDetails {
  const { fieldPath, validators } = suspicion.evidence

  return {
    title: (
      <>
        Validators with <Code>triggers: []</Code>
      </>
    ),
    description: (
      <>
        The following validators affecting <Code>{fieldPath}</Code> have an
        empty <Code>triggers</Code> array, so they do not run for change or blur
        events:
        <ul class="list-disc pl-4">
          <For each={validators}>
            {(location) => (
              <li>{getValidatorLocationText(fieldPath, location)}</li>
            )}
          </For>
        </ul>
      </>
    ),
    commonCase: (
      <>
        A validator was intended to run when the field changes or blurs, but it
        was configured with <Code>triggers: []</Code>.
      </>
    ),
    fixes: [
      <>
        Add <Code>change</Code>, <Code>blur</Code>, or a conditional trigger to
        the validator's <Code>triggers</Code> array.
      </>,
      <>
        If the validator is intentionally submit-only or mount-only, no trigger
        is needed. Submit validation runs by default, while mount validation
        requires <Code>runOnMount: true</Code>.
      </>,
    ],
  }
}

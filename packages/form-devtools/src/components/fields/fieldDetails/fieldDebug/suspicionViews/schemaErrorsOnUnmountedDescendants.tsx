import { For } from 'solid-js'
import type { FieldDebugSuspicion } from '@/eventClientTypes'
import type { DebugDetails } from '../../debug/types'
import { Code } from '@/components/ui/code'

type SchemaErrorsOnUnmountedDescendantsSuspicion = Extract<
  FieldDebugSuspicion,
  { kind: 'schema-errors-on-unmounted-descendants' }
>

export function getSchemaErrorsOnUnmountedDescendantsDetails(
  suspicion: SchemaErrorsOnUnmountedDescendantsSuspicion,
): DebugDetails {
  const { fieldPath, unmountedDescendantPaths } = suspicion.evidence

  return {
    title: 'Schema errors in unmounted fields',
    description: (
      <>
        This field has no errors of its own, but schema errors exist on
        unmounted fields:
        <ul class="list-disc pl-4">
          <For each={unmountedDescendantPaths}>
            {(path) => (
              <li>
                <Code>{path}</Code>
              </li>
            )}
          </For>
        </ul>
      </>
    ),
    commonCase: (
      <>
        The mounted field <Code>dateRange</Code> was supposed to receive this
        error, but the schema reported the unmounted field{' '}
        <Code>dateRange.start</Code> instead.
      </>
    ),
    fixes: [
      <>
        If <Code>{fieldPath}</Code> should receive these errors, use{' '}
        <Code>errorBoundary</Code> on that field.
      </>,
      <>
        If the fields like <Code>{unmountedDescendantPaths[0]}</Code> should
        receive the errors, make sure those fields are mounted.
      </>,
    ],
  }
}

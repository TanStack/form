import { DotIcon } from 'lucide-solid'
import { Show } from 'solid-js'
import type { DevtoolsFieldErrorSource } from '@/eventClientTypes'

interface FieldDetailErrorSourceTextProps {
  source: DevtoolsFieldErrorSource
  sourceEvent?: string
}

export function FieldDetailErrorSourceText({
  source,
  sourceEvent,
}: FieldDetailErrorSourceTextProps) {
  const sourceTextLabels: Record<DevtoolsFieldErrorSource['scope'], string> = {
    field: 'Field',
    form: 'Form',
    formGroup: 'Form group',
    onSubmit: 'Submission error',
  }
  const label = () =>
    source.validatorType === 'schema' ? 'Schema' : 'Callback'

  const scope = () => sourceTextLabels[source.scope]

  return (
    <Show when={source.scope !== 'onSubmit'} fallback={<span>{scope()}</span>}>
      <span title="The scope of the validator this error came from.">
        {scope()}
      </span>
      <DotIcon class="size-4" />
      <span
        class="font-bold"
        title="The type of validator that created this error."
      >
        {label()}
      </span>
      <Show when={sourceEvent !== undefined}>
        <DotIcon class="size-4" />
        <span class="font-bold">{sourceEvent}</span>
      </Show>
    </Show>
  )
}

import { Show } from 'solid-js'
import { FieldMetaBadge } from '../FieldMetaBadge'
import type { FieldId } from '@/types/branded'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'

interface FieldListMetaBadgesProps {
  fieldId: FieldId
}
export function FieldListMetaBadges(props: FieldListMetaBadgesProps) {
  const { getFieldSummary } = useFormDevtoolsStore().fieldList

  const meta = () => getFieldSummary(props.fieldId)
  // Can happen during submission events where a field wasn't touched yet, but a dirtied / blurred field will
  // always include touched. At least usually.
  // We'll still allow filtering to be exact if the difference matters in the list.
  const isOnlyTouched = () => {
    const m = meta()
    return !m.isDirty && !m.isBlurred && m.isTouched
  }

  return (
    <>
      <Show when={meta().isDirty}>
        <FieldMetaBadge kind="dirty" />
      </Show>
      <Show when={isOnlyTouched()}>
        <FieldMetaBadge kind="touched" />
      </Show>
      <Show when={meta().isBlurred}>
        <FieldMetaBadge kind="blurred" />
      </Show>
      <Show when={meta().isLongValidating}>
        <FieldMetaBadge kind="validating" />
      </Show>
      <Show when={meta().validity === 'invalid'}>
        <FieldMetaBadge kind="invalid" />
      </Show>
      <Show when={meta().validity === 'invalidHidden'}>
        <FieldMetaBadge kind="invalidHidden" />
      </Show>
      <Show when={!meta().isDefaultValue}>
        <FieldMetaBadge kind="nonDefaultValue" />
      </Show>
    </>
  )
}

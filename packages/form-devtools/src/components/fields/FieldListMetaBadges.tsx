import { Show } from 'solid-js'
import { FieldMetaBadge } from './FieldMetaBadge'
import type { FieldId } from '@/types/branded'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'

interface FieldListMetaBadgesProps {
  fieldId: FieldId
}
export function FieldListMetaBadges(props: FieldListMetaBadgesProps) {
  const { getFieldSummary } = useFormDevtoolsStore().fieldList

  const meta = () => getFieldSummary(props.fieldId)
  return (
    <>
      <Show when={meta().isDirty}>
        <FieldMetaBadge kind="dirty" />
      </Show>
      <Show when={meta().isTouched}>
        <FieldMetaBadge kind="touched" />
      </Show>
    </>
  )
}

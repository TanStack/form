import { For, Show, createMemo } from 'solid-js'
import { FieldMetaBadge } from '../FieldMetaBadge'
import type { FieldMetaBadgeKind } from '../FieldMetaBadge'
import type { FieldId } from '@/types/branded'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'
import { ItemDescription } from '@/components/ui/item'

interface FieldListMetaBadgesProps {
  fieldId: FieldId
  isMounted: boolean | undefined
}
export function FieldListMetaBadges(props: FieldListMetaBadgesProps) {
  const { getFieldSummary } = useFormDevtoolsStore().fieldMeta

  const meta = () => getFieldSummary(props.fieldId)

  const badges = createMemo(() => {
    const output: Array<FieldMetaBadgeKind> = []
    const m = meta()

    // Can happen during submission events where a field wasn't touched yet, but a dirtied / blurred field will
    // always include touched. At least usually.
    // We'll still allow filtering to be exact if the difference matters in the list.
    const isOnlyTouched = !m.isDirty && !m.isBlurred && m.isTouched

    if (props.isMounted === false) output.push('unmounted')
    if (m.isDirty) output.push('dirty')
    if (isOnlyTouched) output.push('touched')
    if (m.isBlurred) output.push('blurred')
    if (m.isLongValidating) output.push('validating')
    if (m.validity === 'invalid') output.push('invalid')
    if (m.validity === 'invalidHidden') output.push('invalidHidden')
    if (!m.isDefaultValue) output.push('nonDefaultValue')

    return output
  })

  return (
    <Show when={badges().length > 0}>
      <ItemDescription class="flex flex-wrap gap-2">
        <For each={badges()}>{(badge) => <FieldMetaBadge kind={badge} />}</For>
      </ItemDescription>
    </Show>
  )
}

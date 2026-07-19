import { For, Show, createMemo } from 'solid-js'
import { FieldMetaBadge } from '../FieldMetaBadge'
import type { FieldMetaBadgeKind } from '../FieldMetaBadge'
import type { FieldId } from '@/types/branded'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'
import { CardDescription } from '@/components/ui/card'

interface FieldDetailMetaBadgesProps {
  fieldId: FieldId
  isMounted: boolean | undefined
}
export function FieldDetailMetaBadges(props: FieldDetailMetaBadgesProps) {
  const { getFieldSummary } = useFormDevtoolsStore().fieldMeta

  const meta = () => getFieldSummary(props.fieldId)

  const badges = createMemo(() => {
    const m = meta()
    const output: Array<FieldMetaBadgeKind> = []

    if (props.isMounted === false) output.push('unmounted')

    output.push(
      m.isDirty ? 'dirty' : 'pristine',
      m.isTouched ? 'touched' : 'untouched',
      m.isDefaultValue ? 'defaultValue' : 'nonDefaultValue',
    )

    if (m.isBlurred) output.push('blurred')
    if (m.isLongValidating) output.push('validating')

    return output
  })

  return (
    <Show when={badges().length > 0}>
      <CardDescription class="flex flex-wrap gap-2">
        <For each={badges()}>{(badge) => <FieldMetaBadge kind={badge} />}</For>
      </CardDescription>
    </Show>
  )
}

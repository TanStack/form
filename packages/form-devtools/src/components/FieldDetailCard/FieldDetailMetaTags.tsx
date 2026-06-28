import { For } from 'solid-js'
import { useFieldDetailCardStyles } from '../../styles/field-detail-card.styles'
import { FieldMetaBadge } from '../FieldMetaBadge'
import type { FieldMetaBadgeVariant } from '../FieldMetaBadge'
import type { FieldDetailMetaSnapshot } from './fieldDetailTypes'

interface FieldDetailMetaTagsProps {
  meta: FieldDetailMetaSnapshot
}

function getFieldDetailMetaBadgeVariants(
  meta: FieldDetailMetaSnapshot,
): Array<FieldMetaBadgeVariant> {
  const variants: Array<FieldMetaBadgeVariant> = [
    meta.isDirty ? 'dirty' : 'pristine',
    meta.isDefaultValue ? 'isDefaultValue' : 'isNotDefaultValue',
  ]

  if (meta.isTouched) variants.push('touched')
  if (meta.isBlurred) variants.push('blurred')
  if (meta.isValid) variants.push('valid')
  if (meta.isValid && meta.original.isInvalid) variants.push('isInvalidHidden')
  if (meta.isInvalid) variants.push('isInvalid')

  return variants
}

export function FieldDetailMetaTags(props: FieldDetailMetaTagsProps) {
  const styles = useFieldDetailCardStyles()

  return (
    <div class={styles().stateTags}>
      <For each={getFieldDetailMetaBadgeVariants(props.meta)}>
        {(variant) => <FieldMetaBadge variant={variant} size="md" />}
      </For>
    </div>
  )
}

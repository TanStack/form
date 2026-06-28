import { createMemo } from 'solid-js'
import { useFieldDetailCardStyles } from '../../styles/field-detail-card.styles'
import { KeyedJsonTree } from './KeyedJsonTree'
import { getFieldDetailJsonState } from './fieldDetailJson'
import type { FieldDetailSnapshot } from './fieldDetailTypes'

interface FieldDetailCardJsonSectionProps {
  field: FieldDetailSnapshot
  includeRawValues: boolean
}

export function FieldDetailCardJsonSection(
  props: FieldDetailCardJsonSectionProps,
) {
  const styles = useFieldDetailCardStyles()
  const jsonState = createMemo(() =>
    getFieldDetailJsonState(props.field, props.includeRawValues),
  )

  return (
    <div class={styles().jsonStateSection}>
      <div class={styles().jsonStateTree}>
        <KeyedJsonTree
          value={jsonState()}
          defaultExpansionDepth={1}
          copyable
        />
      </div>
    </div>
  )
}

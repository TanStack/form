import { useFieldDetailCardStyles } from '../../styles/field-detail-card.styles'
import { FieldDetailCardSections } from './FieldDetailCardSections'
import type { FieldDetailErrorDisplayMode } from './FieldDetailCardValuesSection'
import type {
  FieldDetailCardChromeProps,
  FieldDetailSnapshot,
  FieldDetailViewMode,
} from './fieldDetailTypes'

interface FieldDetailCardProps extends FieldDetailCardChromeProps {
  field: FieldDetailSnapshot
  includeRawValues: boolean
  detailViewMode: FieldDetailViewMode
  mountedFieldPaths: ReadonlySet<string>
  onOpenField: (fieldPath: string) => void
  onRawValueChange: (fieldPath: string, includeRawValues: boolean) => void
  errorDisplayMode: FieldDetailErrorDisplayMode
  onErrorDisplayModeChange: (
    fieldPath: string,
    mode: FieldDetailErrorDisplayMode,
  ) => void
}

export function FieldDetailCard(props: FieldDetailCardProps) {
  const styles = useFieldDetailCardStyles()

  return (
    <section
      class={styles().card}
      classList={{
        [styles().cardPrimary]: props.isPrimary,
        [styles().cardSelected]: props.isSelected,
      }}
      data-status={props.field.status}
      aria-current={props.isSelected ? 'true' : undefined}
    >
      <FieldDetailCardSections
        field={props.field}
        includeRawValues={props.includeRawValues}
        detailViewMode={props.detailViewMode}
        mountedFieldPaths={props.mountedFieldPaths}
        onOpenField={props.onOpenField}
        onRawValueChange={props.onRawValueChange}
        errorDisplayMode={props.errorDisplayMode}
        onErrorDisplayModeChange={props.onErrorDisplayModeChange}
      />
    </section>
  )
}

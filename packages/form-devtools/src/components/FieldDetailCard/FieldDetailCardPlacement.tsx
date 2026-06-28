import { For, createComputed, createSignal } from 'solid-js'
import { useFieldDetailCardStyles } from '../../styles/field-detail-card.styles'
import { FieldDetailCard } from './FieldDetailCard'
import type {
  FieldDetailCardChromeProps,
  FieldDetailCardItem,
  FieldDetailViewMode,
} from './fieldDetailTypes'
import type { Accessor, Setter } from 'solid-js'
import type { FieldDetailErrorDisplayMode } from './FieldDetailCardValuesSection'

interface FieldDetailCardPlacementProps {
  fields: ReadonlyArray<FieldDetailCardItem>
  selectedFieldPath: string | null
  rawValueByFieldPath: ReadonlyMap<string, boolean>
  detailViewMode: FieldDetailViewMode
  mountedFieldPaths: ReadonlySet<string>
  onOpenField: (fieldPath: string) => void
  onRawValueChange: (fieldPath: string, includeRawValues: boolean) => void
  getErrorDisplayMode: (fieldPath: string) => FieldDetailErrorDisplayMode
  onErrorDisplayModeChange: (
    fieldPath: string,
    mode: FieldDetailErrorDisplayMode,
  ) => void
}

export function FieldDetailCardPlacement(props: FieldDetailCardPlacementProps) {
  const styles = useFieldDetailCardStyles()
  const fieldEntriesByPath = new Map<string, FieldDetailCardEntry>()
  const [fieldEntries, setFieldEntries] = createSignal<
    Array<FieldDetailCardEntry>
  >([])

  createComputed(() => {
    const seenPaths = new Set<string>()
    const nextEntries = props.fields.map((field) => {
      let entry = fieldEntriesByPath.get(field.path)

      if (!entry) {
        const [fieldValue, setFieldValue] = createSignal(field)
        entry = {
          path: field.path,
          field: fieldValue,
          setField: setFieldValue,
        }
        fieldEntriesByPath.set(field.path, entry)
      } else {
        entry.setField(field)
      }

      seenPaths.add(field.path)
      return entry
    })

    for (const path of fieldEntriesByPath.keys()) {
      if (!seenPaths.has(path)) {
        fieldEntriesByPath.delete(path)
      }
    }

    setFieldEntries(nextEntries)
  })

  return (
    <div class={styles().grid}>
      <For each={fieldEntries()}>
        {(entry, index) => (
          <FieldDetailCardView
            field={entry.field()}
            isPrimary={index() === 0}
            isSelected={props.selectedFieldPath === entry.path}
            includeRawValues={props.rawValueByFieldPath.get(entry.path) ?? true}
            detailViewMode={props.detailViewMode}
            mountedFieldPaths={props.mountedFieldPaths}
            onOpenField={props.onOpenField}
            onRawValueChange={props.onRawValueChange}
            errorDisplayMode={props.getErrorDisplayMode(entry.path)}
            onErrorDisplayModeChange={props.onErrorDisplayModeChange}
          />
        )}
      </For>
    </div>
  )
}

interface FieldDetailCardEntry {
  path: string
  field: Accessor<FieldDetailCardItem>
  setField: Setter<FieldDetailCardItem>
}

interface FieldDetailCardViewProps extends FieldDetailCardChromeProps {
  field: FieldDetailCardItem
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

function FieldDetailCardView(props: FieldDetailCardViewProps) {
  return (
    <FieldDetailCard
      field={props.field}
      isPrimary={props.isPrimary}
      isSelected={props.isSelected}
      includeRawValues={props.includeRawValues}
      detailViewMode={props.detailViewMode}
      mountedFieldPaths={props.mountedFieldPaths}
      onOpenField={props.onOpenField}
      onRawValueChange={props.onRawValueChange}
      errorDisplayMode={props.errorDisplayMode}
      onErrorDisplayModeChange={props.onErrorDisplayModeChange}
    />
  )
}

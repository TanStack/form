import { Show, createEffect, createSignal, on } from 'solid-js'
import { useFieldDetailCardStyles } from '../../styles/field-detail-card.styles'
import { FieldDetailCardPlacement } from './FieldDetailCardPlacement'
import type { FieldDetailErrorDisplayMode } from './FieldDetailCardValuesSection'
import type {
  FieldDetailCardItem,
  FieldDetailViewMode,
} from './fieldDetailTypes'

interface FieldDetailCardsProps {
  fields: ReadonlyArray<FieldDetailCardItem>
  selectedFieldPath: string | null
  rawValueByFieldPath: ReadonlyMap<string, boolean>
  detailViewMode: FieldDetailViewMode
  mountedFieldPaths: ReadonlySet<string>
  onOpenField: (fieldPath: string) => void
  onRawValueChange: (fieldPath: string, includeRawValues: boolean) => void
}

export function FieldDetailCards(props: FieldDetailCardsProps) {
  const styles = useFieldDetailCardStyles()
  const [errorDisplayModes, setErrorDisplayModes] = createSignal<
    ReadonlyMap<string, FieldDetailErrorDisplayMode>
  >(new Map())
  let panelRef: HTMLDivElement | undefined
  let hasRendered = false

  const getErrorDisplayMode = (fieldPath: string) =>
    errorDisplayModes().get(fieldPath) ?? 'list'

  const setErrorDisplayMode = (
    fieldPath: string,
    mode: FieldDetailErrorDisplayMode,
  ) => {
    setErrorDisplayModes((previousModes) => {
      const nextModes = new Map(previousModes)
      nextModes.set(fieldPath, mode)
      return nextModes
    })
  }

  createEffect(
    on(
      () => props.selectedFieldPath,
      (selectedFieldPath, previousSelectedFieldPath) => {
        if (!hasRendered) {
          hasRendered = true
          return
        }

        if (
          selectedFieldPath === null ||
          selectedFieldPath === previousSelectedFieldPath
        ) {
          return
        }

        panelRef?.parentElement?.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      },
    ),
  )

  return (
    <div ref={panelRef} class={styles().panel}>
      <Show
        when={props.fields.length > 0}
        fallback={
          <div class={styles().emptyState}>No selected or pinned fields</div>
        }
      >
        <FieldDetailCardPlacement
          fields={props.fields}
          selectedFieldPath={props.selectedFieldPath}
          rawValueByFieldPath={props.rawValueByFieldPath}
          detailViewMode={props.detailViewMode}
          mountedFieldPaths={props.mountedFieldPaths}
          onOpenField={props.onOpenField}
          onRawValueChange={props.onRawValueChange}
          getErrorDisplayMode={getErrorDisplayMode}
          onErrorDisplayModeChange={setErrorDisplayMode}
        />
      </Show>
    </div>
  )
}

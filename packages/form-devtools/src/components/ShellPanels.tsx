import { For, Show, createSignal } from 'solid-js'
import { useStyles } from '../styles/use-styles'
import { FieldListFilterBar, MountedFieldsList } from './MountedFieldsList'
import { FieldDetailCards } from './FieldDetailCard/FieldDetailCards'
import type { FieldListFilter } from './MountedFieldsList'
import type { DevtoolsTabConfig, DevtoolsTabId } from './shellTabs'
import type {
  FieldDetailCardItem,
  FieldDetailViewMode,
} from './FieldDetailCard/fieldDetailTypes'

interface LeftPanelContentProps {
  activeTab: DevtoolsTabId
  tabConfig: DevtoolsTabConfig
  fields: Parameters<typeof MountedFieldsList>[0]['fields']
  fieldQuery: string
  fieldFilter: FieldListFilter
  selectedFieldPath: string | null
  pinnedFieldPaths: ReadonlyArray<string>
  onQueryChange: (query: string) => void
  onFilterChange: (filter: FieldListFilter) => void
  onSelectField: (fieldPath: string) => void
  onTogglePinnedField: (fieldPath: string) => void
}

export function LeftPanelContent(props: LeftPanelContentProps) {
  const styles = useStyles()

  return (
    <>
      <div class={styles().panelHeader}>
        <span>{props.tabConfig.leftTitle}</span>
        <Show when={props.activeTab === 'fields'}>
          <FieldListFilterBar
            fields={props.fields}
            query={props.fieldQuery}
            pinnedFieldPaths={props.pinnedFieldPaths}
            filter={props.fieldFilter}
            onFilterChange={props.onFilterChange}
          />
        </Show>
      </div>
      <Show
        when={props.activeTab === 'fields'}
        fallback={
          <div class={styles().placeholderContent}>
            {props.tabConfig.leftDescription}
          </div>
        }
      >
        <MountedFieldsList
          fields={props.fields}
          selectedFieldPath={props.selectedFieldPath}
          pinnedFieldPaths={props.pinnedFieldPaths}
          query={props.fieldQuery}
          filter={props.fieldFilter}
          onQueryChange={props.onQueryChange}
          onSelectField={props.onSelectField}
          onTogglePinnedField={props.onTogglePinnedField}
        />
      </Show>
    </>
  )
}

interface DetailPanelContentProps {
  activeTab: DevtoolsTabId
  tabConfig: DevtoolsTabConfig
  rawValueByFieldPath: ReadonlyMap<string, boolean>
  selectedFieldPath: string | null
  mountedFieldPaths: ReadonlySet<string>
  onOpenField: (fieldPath: string) => void
  onRawValueChange: (fieldPath: string, includeRawValues: boolean) => void
  visibleFields: ReadonlyArray<FieldDetailCardItem>
}

export function DetailPanelContent(props: DetailPanelContentProps) {
  const styles = useStyles()
  const [fieldDetailViewMode, setFieldDetailViewMode] =
    createSignal<FieldDetailViewMode>('ui')
  const fieldDetailViewModes: Array<{
    value: FieldDetailViewMode
    label: string
  }> = [
    { value: 'ui', label: 'UI' },
    { value: 'json', label: 'JSON' },
  ]

  return (
    <>
      <div class={styles().panelHeader}>
        <span>{props.tabConfig.detailTitle}</span>
        <Show when={props.activeTab === 'fields'}>
          <div
            class={styles().segmentedControl}
            role="group"
            aria-label="Field detail view mode"
          >
            <For each={fieldDetailViewModes}>
              {(mode) => (
                <button
                  class={styles().segmentedButton}
                  classList={{
                    [styles().segmentedButtonActive]:
                      fieldDetailViewMode() === mode.value,
                  }}
                  type="button"
                  aria-pressed={fieldDetailViewMode() === mode.value}
                  onClick={() => setFieldDetailViewMode(mode.value)}
                >
                  {mode.label}
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>
      <Show
        when={props.activeTab === 'fields'}
        fallback={
          <div class={styles().placeholderContent}>
            {props.tabConfig.detailDescription}
          </div>
        }
      >
        <FieldDetailCards
          fields={props.visibleFields}
          rawValueByFieldPath={props.rawValueByFieldPath}
          selectedFieldPath={props.selectedFieldPath}
          detailViewMode={fieldDetailViewMode()}
          mountedFieldPaths={props.mountedFieldPaths}
          onOpenField={props.onOpenField}
          onRawValueChange={props.onRawValueChange}
        />
      </Show>
    </>
  )
}

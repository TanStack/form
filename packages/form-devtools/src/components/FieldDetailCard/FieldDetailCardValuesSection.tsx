import { For, Show, createMemo } from 'solid-js'
import { useFieldDetailCardStyles } from '../../styles/field-detail-card.styles'
import { KeyedJsonTree } from './KeyedJsonTree'
import type { FieldDetailSnapshot } from './fieldDetailTypes'

export type FieldDetailErrorDisplayMode = 'list' | 'json'

interface FieldDetailCardValuesSectionProps {
  field: FieldDetailSnapshot
  includeRawValues: boolean
  errorDisplayMode: FieldDetailErrorDisplayMode
  onErrorDisplayModeChange: (mode: FieldDetailErrorDisplayMode) => void
}

export function FieldDetailCardValuesSection(
  props: FieldDetailCardValuesSectionProps,
) {
  const styles = useFieldDetailCardStyles()
  const originalErrors = createMemo(
    () => props.field.state.meta.original.errors,
  )
  const isHiddenFromFrontend = createMemo(
    () =>
      originalErrors().length > 0 && props.field.state.meta.errors.length === 0,
  )

  return (
    <div class={styles().valuesSection}>
      <Show when={props.includeRawValues}>
        <div class={styles().valuesGrid}>
          <FieldDetailValuePane label="Value" value={props.field.state.value} />
          <FieldDetailValuePane
            label="Default value"
            value={props.field.defaultValue}
          />
        </div>
      </Show>
      <Show when={originalErrors().length > 0}>
        <div class={styles().errorSection}>
          <div class={styles().errorSectionHeader}>
            <div class={styles().errorSectionTitle}>
              <span class={styles().valuePaneLabel}>Errors</span>
              <Show when={isHiddenFromFrontend()}>
                <span class={styles().errorVisibilityHint}>
                  Hidden from frontend
                </span>
              </Show>
            </div>
            <div
              class={styles().errorDisplayToggle}
              role="group"
              aria-label="Error display mode"
            >
              <FieldDetailErrorDisplayButton
                mode="list"
                label="List"
                activeMode={props.errorDisplayMode}
                onSelect={props.onErrorDisplayModeChange}
              />
              <FieldDetailErrorDisplayButton
                mode="json"
                label="JSON"
                activeMode={props.errorDisplayMode}
                onSelect={props.onErrorDisplayModeChange}
              />
            </div>
          </div>
          <Show
            when={props.errorDisplayMode === 'json'}
            fallback={<FieldDetailErrorList errors={originalErrors()} />}
          >
            <div class={styles().valueTree}>
              <KeyedJsonTree
                value={originalErrors()}
                defaultExpansionDepth={1}
                copyable
              />
            </div>
          </Show>
        </div>
      </Show>
    </div>
  )
}

interface FieldDetailErrorDisplayButtonProps {
  mode: FieldDetailErrorDisplayMode
  label: string
  activeMode: FieldDetailErrorDisplayMode
  onSelect: (mode: FieldDetailErrorDisplayMode) => void
}

function FieldDetailErrorDisplayButton(
  props: FieldDetailErrorDisplayButtonProps,
) {
  const styles = useFieldDetailCardStyles()
  const isActive = () => props.activeMode === props.mode

  return (
    <button
      class={styles().errorDisplayToggleButton}
      classList={{
        [styles().errorDisplayToggleButtonActive]: isActive(),
      }}
      type="button"
      aria-pressed={isActive()}
      onClick={() => props.onSelect(props.mode)}
    >
      {props.label}
    </button>
  )
}

interface FieldDetailErrorListProps {
  errors: FieldDetailSnapshot['state']['meta']['original']['errors']
}

function FieldDetailErrorList(props: FieldDetailErrorListProps) {
  const styles = useFieldDetailCardStyles()

  return (
    <ul class={styles().errorMessageList}>
      <For each={props.errors}>
        {(error) => <li class={styles().errorMessageItem}>{error.message}</li>}
      </For>
    </ul>
  )
}

interface FieldDetailValuePaneProps {
  label: string
  value: unknown
}

function FieldDetailValuePane(props: FieldDetailValuePaneProps) {
  const styles = useFieldDetailCardStyles()

  return (
    <div class={styles().valuePane}>
      <div class={styles().valuePaneLabel}>{props.label}</div>
      <div class={styles().valueTree}>
        <KeyedJsonTree value={props.value} defaultExpansionDepth={1} copyable />
      </div>
    </div>
  )
}

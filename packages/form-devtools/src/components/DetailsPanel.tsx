import { For, Show, createEffect, createMemo } from 'solid-js'
import { JsonTree } from '@tanstack/devtools-ui'
import { useStyles } from '../styles/use-styles'
import { useFormEventClient } from '../contexts/eventClientContext'
import { ActionButtons } from './ActionButtons'
import { StateHeader } from './StateHeader'

import type { Accessor } from 'solid-js'

type DetailsPanelProps = {
  selectedKey: Accessor<string>
}

export function DetailsPanel({ selectedKey }: DetailsPanelProps) {
  const styles = useStyles()
  const { store } = useFormEventClient()

  const selectedIndex = createMemo(() =>
    store().findIndex((f) => f.id === selectedKey()),
  )

  const selectedInstance = createMemo(() =>
    selectedIndex() > -1 ? store()[selectedIndex()] : null,
  )

  const state = createMemo(() => selectedInstance()?.state)

  const formStatus = createMemo(() => ({
    canSubmit: state()?.canSubmit,
    isFormValid: state()?.isFormValid,
    isFormValidating: state()?.isFormValidating,
    isSubmitted: state()?.isSubmitted,
    isSubmitting: state()?.isSubmitting,
    isSubmitSuccessful: state()?.isSubmitSuccessful,
    submissionAttempts: state()?.submissionAttempts,
    errors: state()?.errors,
    errorMap: state()?.errorMap,
  }))

  createEffect(() => console.log(selectedInstance()?.state))

  const individualFields = createMemo(() => {
    const fields: Record<string, { value: any; meta: any }> = {}
    const values = state()?.values || {}
    const fieldMeta = state()?.fieldMeta || {}

    Object.keys(values).forEach((key) => {
      fields[key] = {
        value: values[key],
        meta: fieldMeta[key],
      }
    })

    return fields
  })

  return (
    <div class={styles().stateDetails}>
      <Show when={selectedInstance()}>
        <StateHeader selectedInstance={selectedInstance} />

        <div class={styles().detailsGrid}>
          <div class={styles().detailSection}>
            <div class={styles().detailSectionHeader}>Actions</div>
            <ActionButtons selectedInstance={selectedInstance} />
          </div>

          <div class={styles().detailSection}>
            <div class={styles().detailSectionHeader}>Individual Fields</div>

            <div
              style={{
                display: 'flex',
                gap: '8px',
              }}
            >
              <For each={Object.entries(individualFields())}>
                {([fieldName, fieldData]) => (
                  <div
                    class={styles().stateContent}
                    style={{ 'margin-bottom': '16px' }}
                  >
                    <div
                      style={{
                        'font-weight': 'bold',
                        'margin-bottom': '4px',
                      }}
                    >
                      {fieldName}
                    </div>
                    <JsonTree copyable value={fieldData as unknown} />
                  </div>
                )}
              </For>
            </div>
          </div>

          <div class={styles().detailSection}>
            <div class={styles().detailSectionHeader}>Form values</div>
            <div class={styles().stateContent}>
              <JsonTree
                copyable
                value={store()[selectedIndex()]!.state.values as unknown}
              />
            </div>
          </div>

          <div class={styles().detailSection}>
            <div class={styles().detailSectionHeader}>Form status</div>
            <div class={styles().stateContent}>
              <JsonTree copyable value={formStatus() as unknown} />
            </div>
          </div>

          <div class={styles().detailSection}>
            <div class={styles().detailSectionHeader}>Form options</div>
            <div class={styles().stateContent}>
              <JsonTree
                copyable
                value={store()[selectedIndex()]?.options as unknown}
                collapsePaths={['validators'] as unknown as never}
              />
            </div>
          </div>

          <div class={styles().detailSection}>
            <div class={styles().detailSectionHeader}>Submission history</div>
            <div class={styles().stateContent}>
              <JsonTree
                copyable
                value={store()[selectedIndex()]?.history as unknown}
              />
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}

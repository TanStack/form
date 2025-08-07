import { For, Show, createMemo } from 'solid-js'
import { JsonTree } from '@tanstack/devtools-ui'
import { useStyles } from '../styles/use-styles'
import { useFormEventClient } from '../contexts/eventClientContext'
import { ActionButtons } from './ActionButtons'
import { StateHeader } from './StateHeader'

import type { Accessor } from 'solid-js'

type DetailsPanelProps = {
  selectedKey: Accessor<string | null>
}

export function DetailsPanel({ selectedKey }: DetailsPanelProps) {
  const styles = useStyles()
  const { store } = useFormEventClient()

  const selectedInstance = createMemo(() => {
    const key = selectedKey()
    return key
      ? (store.formState.find((form) => form.id === key) ?? null)
      : null
  })

  const state = createMemo(() => selectedInstance()?.state)
  const history = createMemo(() => selectedInstance()?.history)

  const sections = createMemo(() => [
    {
      title: 'Form options',
      value: selectedInstance()?.options,
    },
    {
      title: 'Form values',
      value: state()?.values,
    },
    {
      title: 'Form Interactions',
      value: {
        isPristine: state()?.isPristine,
        isTouched: state()?.isTouched,
        isDirty: state()?.isDirty,
        isDefaultValue: state()?.isDefaultValue,
        isBlurred: state()?.isBlurred,
      },
    },
    {
      title: 'Form Status',
      value: {
        canSubmit: state()?.canSubmit,
        isFormValid: state()?.isFormValid,
        isFormValidating: state()?.isFormValidating,
        isSubmitted: state()?.isSubmitted,
        isSubmitting: state()?.isSubmitting,
        isSubmitSuccessful: state()?.isSubmitSuccessful,
        submissionAttempts: state()?.submissionAttempts,
        errors: state()?.errors,
        errorMap: state()?.errorMap,
      },
    },
    {
      title: 'Field Status',
      value: {
        isFieldsValid: state()?.isFieldsValid,
        isFieldsValidating: state()?.isFieldsValidating,
        fieldMeta: state()?.fieldMeta,
      },
    },
    {
      title: 'Submission history',
      value: history(),
    },
  ])

  return (
    <div class={styles().stateDetails}>
      <Show when={selectedInstance()}>
        <StateHeader selectedInstance={selectedInstance} />

        <div class={styles().detailsGrid}>
          <div class={styles().detailSection}>
            <div class={styles().detailSectionHeader}>Actions</div>
            <ActionButtons selectedInstance={selectedInstance} />
          </div>

          <For each={sections()}>
            {(section) => (
              <div class={styles().detailSection}>
                <div class={styles().detailSectionHeader}>{section.title}</div>
                <div class={styles().stateContent}>
                  <JsonTree value={section.value} />
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

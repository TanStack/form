import { FormEventClient } from '@tanstack/form-core'

import { useStyles } from '../styles/use-styles'

import type { Accessor } from 'solid-js'
import type { DevtoolsFormState } from '../contexts/eventClientContext'

type ActionButtonsProps = {
  selectedInstance: Accessor<DevtoolsFormState | null>
}

export function ActionButtons(props: ActionButtonsProps) {
  const styles = useStyles()

  return (
    <div class={styles().actionsRow}>
      <button
        class={styles().actionButton}
        onMouseDown={() => {
          const formEventClient = new FormEventClient();
          formEventClient.emit('request-form-state', {
            id: props.selectedInstance()?.id as string,
          })
        }}
      >
        <span class={styles().actionDotGreen} />
        Flush
      </button>

      <button
        class={styles().actionButton}
        onMouseDown={() => {
          const formEventClient = new FormEventClient();
          formEventClient.emit('request-form-reset', {
            id: props.selectedInstance()?.id as string,
          })
        }}
      >
        <span class={styles().actionDotRed} />
        Reset
      </button>

      <button
        class={styles().actionButton}
        onMouseDown={() => {
          const formEventClient = new FormEventClient();
          formEventClient.emit('request-form-force-submit', {
            id: props.selectedInstance()?.id as string,
          })
        }}
      >
        <span class={styles().actionDotYellow} />
        Submit (-f)
      </button>
    </div>
  )
}

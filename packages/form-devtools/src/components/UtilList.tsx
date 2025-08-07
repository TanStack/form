import { For, createEffect } from 'solid-js'
import clsx from 'clsx'

import { useStyles } from '../styles/use-styles'
import { useFormEventClient } from '../contexts/eventClientContext'

type UtilListProps = {
  selectedKey: () => string | null
  setSelectedKey: (key: string | null) => void
}

export function UtilList(props: UtilListProps) {
  const styles = useStyles()
  const { store } = useFormEventClient()

  return (
    <div class={styles().utilList}>
      {store.formState.length > 0 && (
        <div class={styles().utilGroup}>
          <For each={store.formState}>
            {(instance) => {
              return (
                <div
                  class={clsx(
                    styles().utilRow,
                    props.selectedKey() === instance.id &&
                      styles().utilRowSelected,
                  )}
                  onClick={() => props.setSelectedKey(instance.id)}
                >
                  <div class={styles().utilKey}>{instance.id}</div>
                </div>
              )
            }}
          </For>
        </div>
      )}
    </div>
  )
}

import { For } from 'solid-js'
import clsx from 'clsx'
import { useStyles } from '../styles/use-styles'
import type { AnyFormState } from '@tanstack/form-core'

type UtilListProps = {
  selectedKey: () => string | null
  setSelectedKey: (key: string | null) => void
  utilState: () => Array<{ id: string; state: AnyFormState }>
}

export function UtilList(props: UtilListProps) {
  const styles = useStyles()

  return (
    <div class={styles().utilList}>
      {props.utilState().length > 0 && (
        <div class={styles().utilGroup}>
          <For each={props.utilState()}>
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

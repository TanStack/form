import { Show, createMemo } from 'solid-js'
import { JsonTree } from '@tanstack/devtools-ui'

interface KeyedJsonTreeProps {
  value: unknown
  defaultExpansionDepth?: number
  copyable?: boolean
}

export function KeyedJsonTree(props: KeyedJsonTreeProps) {
  const treeKey = createMemo(() => ({ value: props.value }))

  return (
    <Show keyed when={treeKey()}>
      {(tree) => (
        <JsonTree
          value={tree.value}
          defaultExpansionDepth={props.defaultExpansionDepth}
          copyable={props.copyable}
        />
      )}
    </Show>
  )
}

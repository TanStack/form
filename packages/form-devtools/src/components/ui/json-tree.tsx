import { JsonTreeView } from '@ark-ui/solid'
import { ChevronRightIcon } from 'lucide-solid'
import { Show, splitProps } from 'solid-js'
import { ScrollArea } from './scroll-area'
import { CopyButton } from './copy-button'
import type { ComponentProps } from 'solid-js'
import { cn } from '@/utils'

interface JsonTreeProps extends ComponentProps<'div'> {
  /**
   * The value to
   */
  value: unknown
  /**
   * The default expansion depth that the JSON viewer should have.
   */
  defaultExpandedDepth: number
  /**
   * Whether or not the JSON tree should be copyable. If true,
   * adds a copy button on the top right of the tree.
   *
   * @default false
   */
  copyable?: boolean
  /**
   * Whether the property keys should have quotes or not.
   *
   * @default false
   */
  quotesOnKeys?: boolean
}

export function JsonTree(props: JsonTreeProps) {
  const [local, others] = splitProps(props, [
    'value',
    'class',
    'quotesOnKeys',
    'copyable',
    'defaultExpandedDepth',
  ])

  return (
    <JsonTreeView.Root
      defaultExpandedDepth={local.defaultExpandedDepth}
      data={local.value}
      quotesOnKeys={local.quotesOnKeys}
      asChild={(innerProps) => (
        <ScrollArea
          class={cn(
            'text-sm/6 ark-json-root w-full font-mono rounded-lg',
            local.class,
          )}
          {...others}
          {...innerProps()}
        />
      )}
    >
      <Show when={props.copyable}>
        <CopyButton value={local.value} class="z-10 absolute right-1 top-1" />
      </Show>
      <JsonTreeView.Tree
        arrow={<ChevronRightIcon class="w-4 h-4 text-muted-foreground" />}
        indentGuide
        class="flex flex-col text-1/2 rounded-lg"
      />
    </JsonTreeView.Root>
  )
}

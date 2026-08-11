import { JsonTreeView } from '@ark-ui/solid'
import ChevronRightIcon from 'lucide-solid/icons/chevron-right'
import { Show, splitProps } from 'solid-js'
import { ScrollArea } from './scroll-area'
import { CopyButton } from './copy-button'
import type { ComponentProps } from 'solid-js'
import { cn } from '@/utils'

interface JsonTreeProps extends ComponentProps<'div'> {
  /**
   * The value to render in the JSON tree.
   */
  value: unknown
  /**
   * The default expansion depth that the JSON viewer should have.
   */
  defaultExpandedDepth?: number
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

/**
 * A scrollable JSON inspector with optional key quotes and copy support.
 *
 * @example
 * ```tsx
 * <JsonTree value={{ name: "Ada" }} defaultExpandedDepth={1} />
 * ```
 */
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
            'ark-json-root w-full rounded-lg font-mono text-sm/6',
            local.class,
          )}
          {...others}
          {...innerProps()}
        />
      )}
    >
      <Show when={props.copyable}>
        <CopyButton value={local.value} class="absolute top-1 right-1 z-10" />
      </Show>
      <JsonTreeView.Tree
        arrow={<ChevronRightIcon class="h-4 w-4 text-muted-foreground" />}
        indentGuide
        class="text-1/2 flex flex-col rounded-lg"
      />
    </JsonTreeView.Root>
  )
}

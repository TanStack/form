import { Splitter } from '@ark-ui/solid'
import { createSignal, splitProps } from 'solid-js'
import { SearchIcon } from 'lucide-solid'
import { DevtoolsTab } from '../header/TabsNav'
import { Separator } from '../ui/separator'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { ScrollArea } from '../ui/scroll-area'
import type {
  SplitterPanelData,
  SplitterResizeTriggerProps,
} from '@ark-ui/solid'
import { cn } from '@/utils'

function SidebarRail(props: SplitterResizeTriggerProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <Splitter.ResizeTrigger
      class={cn(
        'outline-none z-20 hidden w-2 transition-all ease-linear after:absolute after:inset-y-0 after:start-1/2 after:w-2 hover:after:bg-sidebar-border sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2 cursor-col-resize',
        local.class,
      )}
      {...others}
    />
  )
}

const sidebarId = 'fieldTabSidebar'
const mainId = 'fieldTabMain'
const panels: Array<SplitterPanelData> = [
  {
    id: sidebarId,
    minSize: 5,
  },
  {
    id: mainId,
    minSize: 20,
  },
]
const panelTriggerId = `${sidebarId}:${mainId}`

export function FieldTab() {
  const [size, setSize] = createSignal([0.25, 0.75])

  return (
    <DevtoolsTab value="field" disableScroll>
      <Splitter.Root
        panels={panels}
        size={size()}
        onResize={(details) => setSize(details.size)}
      >
        <Splitter.Panel
          id={sidebarId}
          class="size-full bg-sidebar p-2 grid gap-2 grid-rows-[auto_auto_1fr]"
        >
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search fields..." />
          </InputGroup>
          <Separator />
          <ScrollArea>Content</ScrollArea>
        </Splitter.Panel>
        <SidebarRail id={panelTriggerId} aria-label="Resize" />
        <Splitter.Panel id={mainId} class="size-full p-2">
          B
        </Splitter.Panel>
      </Splitter.Root>
    </DevtoolsTab>
  )
}

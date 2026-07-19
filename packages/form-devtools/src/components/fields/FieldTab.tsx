import { Splitter } from '@ark-ui/solid'
import { For, Show, createSignal } from 'solid-js'
import { DevtoolsTab } from '../header/TabsNav'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { ResizableSidebar } from '../ui/resizable-sidebar'
import { FieldDetailCard } from './fieldDetails/FieldDetailCard'
import { FieldListSearch } from './leftPanel/listSearch/FieldListSearch'
import { FieldList } from './leftPanel/FieldList'
import type { SplitterPanelData } from '@ark-ui/solid'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'

const sidebarId = 'fieldTabSidebar'
const mainId = 'fieldTabMain'
const panels: Array<SplitterPanelData> = [
  {
    id: sidebarId,
    minSize: 10,
  },
  {
    id: mainId,
    minSize: 20,
  },
]

function Sidebar() {
  return (
    <ResizableSidebar
      sidebarPanelId={sidebarId}
      mainPanelId={mainId}
      class="grid gap-2 grid-rows-[auto_1fr]"
    >
      <div class="flex flex-col gap-2 px-2 pt-2">
        <FieldListSearch />
        <Separator />
      </div>
      <ScrollArea class="min-h-0 px-2">
        <FieldList />
      </ScrollArea>
    </ResizableSidebar>
  )
}

export function FieldTab() {
  const { mainPanelFieldRows } = useFormDevtoolsStore().fieldList
  const [size, setSize] = createSignal([0.25, 0.75])

  return (
    <DevtoolsTab value="field" disableScroll>
      <Splitter.Root
        panels={panels}
        size={size()}
        onResize={(details) => setSize(details.size)}
      >
        <Sidebar />
        <Splitter.Panel id={mainId} class="size-full min-w-0 relative">
          <Show
            when={mainPanelFieldRows().length > 0}
            fallback={
              <div class="flex size-full items-center justify-center text-sm text-muted-foreground">
                No field selected
              </div>
            }
          >
            <ScrollArea class="size-full">
              <div class="p-3 flex flex-wrap gap-y-4 gap-2 content-evenly">
                <For each={mainPanelFieldRows()}>
                  {(field) => (
                    <FieldDetailCard
                      field={field}
                      class="flex-initial w-fit max-w-150 min-w-0"
                    />
                  )}
                </For>
              </div>
            </ScrollArea>
          </Show>
        </Splitter.Panel>
      </Splitter.Root>
    </DevtoolsTab>
  )
}

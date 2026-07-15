import { Splitter } from '@ark-ui/solid'
import { For, Show, createSignal } from 'solid-js'
import { DevtoolsTab } from '../header/TabsNav'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { LeftResizablePanel } from './leftPanel/LeftResizablePanel'
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
        <LeftResizablePanel
          sidebarPanelId={sidebarId}
          mainPanelId={mainId}
          class="grid gap-2 grid-rows-[auto_auto_1fr]"
        >
          <FieldListSearch />
          <Separator />
          <ScrollArea class="min-h-0">
            <FieldList />
          </ScrollArea>
        </LeftResizablePanel>
        <Splitter.Panel id={mainId} class="size-full min-w-0 p-3">
          <Show
            when={mainPanelFieldRows().length > 0}
            fallback={
              <div class="flex size-full items-center justify-center text-sm text-muted-foreground">
                No field selected
              </div>
            }
          >
            <div class="grid max-w-full gap-2">
              <For each={mainPanelFieldRows()}>
                {(field) => (
                  <div class="grid max-w-full gap-2">
                    <div class="text-xs font-medium uppercase text-muted-foreground">
                      Field
                    </div>
                    <code class="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-md border bg-muted px-2 py-1.5 font-mono text-sm">
                      {field.path}
                    </code>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Splitter.Panel>
      </Splitter.Root>
    </DevtoolsTab>
  )
}

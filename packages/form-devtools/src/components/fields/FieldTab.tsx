import { Splitter } from '@ark-ui/solid'
import { For, Show, createSignal } from 'solid-js'
import { DevtoolsTab } from '../header/TabsNav'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { LeftResizablePanel } from './LeftResizablePanel'
import { FieldListSearch } from './FieldListSearch'
import type { SplitterPanelData } from '@ark-ui/solid'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'
import { cn } from '@/utils'

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

export function FieldTab() {
  const { formSelector, fieldList } = useFormDevtoolsStore()
  const { selectedForm } = formSelector
  const {
    fieldRows,
    selectedFieldRow,
    setSelectedFieldPath,
    visibleFieldRows,
  } = fieldList
  const [size, setSize] = createSignal([0.25, 0.75])

  const emptyMessage = () => {
    if (!selectedForm()) return 'No form selected'
    if (fieldRows().length === 0) return 'No mounted fields'
    return 'No matching fields'
  }

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
            <Show
              when={selectedForm() && visibleFieldRows().length > 0}
              fallback={
                <div class="flex min-h-24 items-center justify-center px-3 text-center text-xs text-muted-foreground">
                  {emptyMessage()}
                </div>
              }
            >
              <div class="grid gap-1">
                <For each={visibleFieldRows()}>
                  {(field) => (
                    <button
                      type="button"
                      title={field.path}
                      aria-selected={selectedFieldRow()?.path === field.path}
                      onClick={() => setSelectedFieldPath(field.path)}
                      class={cn(
                        'min-h-8 w-full min-w-0 rounded-md px-2 py-1.5 text-left font-mono text-xs leading-5 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50 aria-selected:bg-sidebar-accent aria-selected:text-sidebar-accent-foreground',
                      )}
                    >
                      <span class="block truncate">{field.path}</span>
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </ScrollArea>
        </LeftResizablePanel>
        <Splitter.Panel id={mainId} class="size-full min-w-0 p-3">
          <Show
            when={selectedFieldRow()}
            fallback={
              <div class="flex size-full items-center justify-center text-sm text-muted-foreground">
                No field selected
              </div>
            }
          >
            {(field) => (
              <div class="grid max-w-full gap-2">
                <div class="text-xs font-medium uppercase text-muted-foreground">
                  Field
                </div>
                <code class="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-md border bg-muted px-2 py-1.5 font-mono text-sm">
                  {field().path}
                </code>
              </div>
            )}
          </Show>
        </Splitter.Panel>
      </Splitter.Root>
    </DevtoolsTab>
  )
}

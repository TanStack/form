import { Listbox, Splitter } from '@ark-ui/solid'
import { For, Show, createSignal } from 'solid-js'
import { BookmarkIcon } from 'lucide-solid'
import { DevtoolsTab } from '../header/TabsNav'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '../ui/item'
import { Badge } from '../ui/badge'
import { LeftResizablePanel } from './LeftResizablePanel'
import { FieldListSearch } from './listSearch/FieldListSearch'
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
  const { formSelector, fieldList } = useFormDevtoolsStore()
  const { selectedForm } = formSelector
  const {
    fieldRows,
    selectedFieldRow,
    setSelectedFieldPath,
    fieldsListCollection,
    mainPanelFieldRows,
    isFieldPinned,
    toggleFieldPinned,
  } = fieldList
  const [size, setSize] = createSignal([0.25, 0.75])

  const emptyMessage = () => {
    if (!selectedForm()) return 'No form selected'
    if (fieldRows().length === 0) return 'No mounted fields'
    return 'No matching fields'
  }

  const selectedRow = () => {
    const id = selectedFieldRow()?.fieldId
    if (id) return [id]
    return []
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
            <Listbox.Root
              collection={fieldsListCollection()}
              value={selectedRow()}
              onValueChange={(details) => {
                const row = fieldsListCollection().items.find(
                  (item) => item.fieldId === details.value[0],
                )
                if (row) setSelectedFieldPath(row.path)
              }}
              selectionMode="single"
              deselectable
            >
              <Listbox.Empty class="flex w-full justify-center py-2 text-center text-sm text-muted-foreground">
                {emptyMessage()}
              </Listbox.Empty>
              <Listbox.Content
                asChild={(innerProps) => (
                  <ItemGroup {...innerProps()} class="gap-2 outline-none" />
                )}
              >
                <For each={fieldsListCollection().items}>
                  {(item) => (
                    <Listbox.Item
                      item={item}
                      asChild={(innerProps) => (
                        <Item
                          class="group cursor-pointer hover:bg-muted/40 data-highlighted:not-data-selected:bg-muted/50 data-selected:bg-muted/50 flex-nowrap"
                          {...innerProps()}
                        />
                      )}
                    >
                      <ItemMedia
                        variant="default"
                        class="group self-stretch! items-start"
                        asChild={(innerProps) => (
                          <button
                            {...innerProps()}
                            type="button"
                            title={
                              isFieldPinned(item.fieldId)
                                ? 'Remove bookmark'
                                : 'Bookmark'
                            }
                            aria-pressed={isFieldPinned(item.fieldId)}
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={(event) => {
                              event.stopPropagation()
                              toggleFieldPinned(item.fieldId)
                            }}
                          />
                        )}
                      >
                        <BookmarkIcon class="group-aria-pressed:fill-current size-4.5" />
                      </ItemMedia>
                      <ItemContent>
                        <Listbox.ItemText
                          asChild={(innerProps) => (
                            <ItemTitle {...innerProps()} class="truncate" />
                          )}
                        >
                          {item.path}
                        </Listbox.ItemText>
                        <ItemDescription class="flex flex-wrap gap-2">
                          <Badge class="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            Blue
                          </Badge>
                          <Badge class="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                            Green
                          </Badge>
                          <Badge class="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                            Sky
                          </Badge>
                          <Badge class="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                            Purple
                          </Badge>
                          <Badge class="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                            Red
                          </Badge>
                        </ItemDescription>
                      </ItemContent>
                    </Listbox.Item>
                  )}
                </For>
              </Listbox.Content>
            </Listbox.Root>
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

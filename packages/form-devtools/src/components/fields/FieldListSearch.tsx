import { Combobox, TagsInput } from '@ark-ui/solid'
import { For } from 'solid-js'
import { XIcon } from 'lucide-solid'
import { Portal } from '../ui/portal'
import { Button } from '../ui/button'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '../ui/item'
import { createFieldListSearch } from '@/hooks/createFieldListSearch'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'

export function FieldListSearch() {
  const { fieldList } = useFormDevtoolsStore()
  const { Provider, comboboxApi, selectedTags, tagsSuggestions } =
    createFieldListSearch({
      query: fieldList.fieldSearchQuery,
      setQuery: fieldList.setFieldSearchQuery,
    })

  return (
    <Provider>
      <Combobox.Control
        asChild={(comboboxControlProps) => (
          <TagsInput.Control
            {...comboboxControlProps()}
            data-slot="combobox-chips"
            class="flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40"
          >
            <For each={selectedTags()}>
              {(value, index) => (
                <TagsInput.Item value={value.id} index={index()}>
                  <TagsInput.ItemPreview
                    data-slot="combobox-chip"
                    class="transition-colors group data-highlighted:bg-primary data-highlighted:text-primary-foreground flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 pr-0"
                  >
                    <TagsInput.ItemText>
                      <span class="group-not-data-highlighted:text-muted-foreground">
                        @
                      </span>
                      {value.label}
                    </TagsInput.ItemText>

                    <TagsInput.ItemDeleteTrigger
                      asChild={(innerProps) => (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          data-slot="combobox-chip-remove"
                          class="group-data-highlighted:bg-transparent group-data-highlighted:hover:bg-transparent dark:group-data-highlighted:bg-transparent dark:group-data-highlighted:hover:bg-transparent group-data-highlighted:hover:text-inherit"
                          {...innerProps()}
                        />
                      )}
                    >
                      <XIcon class="pointer-events-none" />
                    </TagsInput.ItemDeleteTrigger>
                  </TagsInput.ItemPreview>
                </TagsInput.Item>
              )}
            </For>

            <Combobox.Input
              asChild={(comboboxInputProps) => (
                <TagsInput.Input
                  {...comboboxInputProps()}
                  data-slot="combobox-chip-input"
                  class="min-w-16 flex-1 outline-none"
                  placeholder="Use @ for filters"
                  on:keydown={{
                    capture: true,
                    handleEvent: (event) => {
                      if (!(event instanceof KeyboardEvent)) return
                      if (event.key !== 'Enter') return

                      const selectingSuggestion =
                        comboboxApi().open &&
                        comboboxApi().highlightedValue !== null

                      // Enter may select a highlighted Combobox item.
                      // Otherwise prevent TagsInput from creating the raw
                      // input text as a tag.
                      if (!selectingSuggestion) {
                        event.preventDefault()
                      }
                    },
                  }}
                  // onKeyDownCapture={handleInputKeyDown}
                />
              )}
            />
          </TagsInput.Control>
        )}
      />

      <TagsInput.HiddenInput />

      <Portal>
        <Combobox.Positioner class="isolate z-50">
          <Combobox.Content
            data-slot="combobox-content"
            class="group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+(--spacing(7)))] origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          >
            <Combobox.Empty
              data-slot="combobox-empty"
              class="hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex"
            >
              No matching tags
            </Combobox.Empty>
            <div
              data-slot="combobox-list"
              class="no-scrollbar max-h-[min(calc(--spacing(72)-(--spacing(9))),calc(var(--available-height)-(--spacing(9))))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0"
            >
              <For each={tagsSuggestions().items}>
                {(tag) => (
                  <Combobox.Item
                    item={tag}
                    data-slot="combobox-item"
                    class="my-1 relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                  >
                    <Combobox.ItemText
                      asChild={(innerProps) => (
                        <Item size="xs" class="p-0" {...innerProps()} />
                      )}
                    >
                      <ItemMedia variant="icon">
                        <tag.icon />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle class="whitespace-nowrap">
                          {tag.label}
                        </ItemTitle>
                        <ItemDescription>{tag.description}</ItemDescription>
                      </ItemContent>
                    </Combobox.ItemText>
                  </Combobox.Item>
                )}
              </For>
            </div>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Provider>
  )
}

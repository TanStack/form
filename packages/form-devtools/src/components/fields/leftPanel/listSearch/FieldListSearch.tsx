import { TagsInput } from '@ark-ui/solid'
import { For, Show } from 'solid-js'
import FunnelXIcon from 'lucide-solid/icons/funnel-x'
import SearchIcon from 'lucide-solid/icons/search'
import { InputGroupAddon, InputGroupButton } from '../../../ui/input-group'
import { FieldSearchControl } from './FieldSearchControl'
import { FieldFilterChip } from './FieldFilterChip'
import { FieldSearchInput } from './FieldSearchInput'
import { FieldListTagsContent } from './FieldListTagsContent'
import { FieldListTagsItem } from './FieldListTagsItem'
import { createFieldListSearch } from '@/hooks/createFieldListSearch'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'

export function FieldListSearch() {
  const { fieldSearchQuery, setFieldSearchQuery, setFieldFilterPipeline } =
    useFormDevtoolsStore().fieldList
  const {
    Provider,
    comboboxApi,
    hasFilters,
    selectedTags,
    tagsSuggestions,
    clearSelection,
  } = createFieldListSearch({
    query: fieldSearchQuery,
    setQuery: setFieldSearchQuery,
    setFilterPipeline: setFieldFilterPipeline,
  })

  return (
    <Provider>
      <FieldSearchControl>
        <For each={selectedTags()}>
          {(value, index) => <FieldFilterChip item={value} index={index()} />}
        </For>
        <Show when={selectedTags().length === 0}>
          <InputGroupAddon align="inline-start" class="p-0">
            <SearchIcon />
          </InputGroupAddon>
        </Show>
        <FieldSearchInput comboboxApi={comboboxApi} />

        <InputGroupButton
          variant="ghost"
          size="icon-xs"
          data-filters={hasFilters()}
          disabled={!hasFilters()}
          onClick={clearSelection}
          class="data-[filters=false]:opacity-0"
        >
          <FunnelXIcon />
        </InputGroupButton>
      </FieldSearchControl>

      <TagsInput.HiddenInput />

      <FieldListTagsContent>
        <For each={tagsSuggestions().items}>
          {(tag) => <FieldListTagsItem item={tag} />}
        </For>
      </FieldListTagsContent>
    </Provider>
  )
}

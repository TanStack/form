import { Combobox, TagsInput } from '@ark-ui/solid'
import type { UseComboboxReturn } from '@ark-ui/solid'
import type { FieldListFilter } from '@/hooks/createFieldListSearch'

interface FieldSearchInput {
  comboboxApi: UseComboboxReturn<FieldListFilter>
}

export function FieldSearchInput({ comboboxApi }: FieldSearchInput) {
  return (
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
                comboboxApi().open && comboboxApi().highlightedValue !== null

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
  )
}

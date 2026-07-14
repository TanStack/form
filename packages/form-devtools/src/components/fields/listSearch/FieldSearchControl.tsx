import { Combobox, TagsInput } from '@ark-ui/solid'
import type { ParentProps } from 'solid-js'

export function FieldSearchControl(props: ParentProps) {
  return (
    <Combobox.Control
      asChild={(comboboxControlProps) => (
        <TagsInput.Control
          {...comboboxControlProps()}
          data-slot="combobox-chips"
          class="flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding ps-2.5 pe-1 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:ps-1 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40"
        >
          {props.children}
        </TagsInput.Control>
      )}
    />
  )
}

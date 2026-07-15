import { TagsInput } from '@ark-ui/solid'
import { XIcon } from 'lucide-solid'
import type { FieldListFilter } from '@/hooks/createFieldListSearch'
import { Button } from '@/components/ui/button'

interface FieldFilterChipProps {
  item: FieldListFilter
  index: number
}
export function FieldFilterChip({ item, index }: FieldFilterChipProps) {
  return (
    <TagsInput.Item value={item.id} index={index}>
      <TagsInput.ItemPreview
        data-slot="combobox-chip"
        class="data-highlighted:ring-1 data-highlighted:ring-ring transition-colors group flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 pr-0"
      >
        <TagsInput.ItemText>
          <span class="text-muted-foreground">@</span>
          {item.label}
        </TagsInput.ItemText>

        <TagsInput.ItemDeleteTrigger
          asChild={(innerProps) => (
            <Button
              variant="ghost"
              size="icon-xs"
              data-slot="combobox-chip-remove"
              {...innerProps()}
            />
          )}
        >
          <XIcon class="pointer-events-none" />
        </TagsInput.ItemDeleteTrigger>
      </TagsInput.ItemPreview>
    </TagsInput.Item>
  )
}

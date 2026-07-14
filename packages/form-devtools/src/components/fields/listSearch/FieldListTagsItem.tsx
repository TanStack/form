import { Combobox } from '@ark-ui/solid'
import type { FieldListFilter } from '@/hooks/createFieldListSearch'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface FieldListTagsItemProps {
  item: FieldListFilter
}

export function FieldListTagsItem({ item }: FieldListTagsItemProps) {
  const LucideIcon = item.icon

  return (
    <Combobox.Item
      item={item}
      data-slot="combobox-item"
      class="my-1 relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    >
      <Combobox.ItemText
        asChild={(innerProps) => (
          <Item size="xs" class="p-0" {...innerProps()} />
        )}
      >
        <ItemMedia variant="icon">
          <LucideIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle class="whitespace-nowrap">{item.label}</ItemTitle>
          <ItemDescription>{item.description}</ItemDescription>
        </ItemContent>
      </Combobox.ItemText>
    </Combobox.Item>
  )
}

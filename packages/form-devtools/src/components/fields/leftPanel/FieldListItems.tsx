import { Listbox } from '@ark-ui/solid'
import { For } from 'solid-js'
import BookmarkIcon from 'lucide-solid/icons/bookmark'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '../../ui/item'
import { FieldLabel } from '../FieldLabel'
import { FieldListMetaBadges } from './FieldListMetaBadges'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'

export function FieldListItems() {
  const { fieldsListCollection, isFieldPinned, toggleFieldPinned } =
    useFormDevtoolsStore().fieldList
  return (
    <For each={fieldsListCollection().items}>
      {(item) => (
        <Listbox.Item
          item={item}
          asChild={(innerProps) => (
            <Item
              class="group cursor-pointer hover:bg-muted data-highlighted:not-data-selected:bg-muted data-selected:bg-muted flex-nowrap"
              {...innerProps()}
            />
          )}
        >
          <ItemMedia
            variant="default"
            class="group self-stretch! items-start outline-hidden"
            asChild={(innerProps) => (
              <button
                {...innerProps()}
                type="button"
                title={
                  isFieldPinned(item.fieldId) ? 'Remove bookmark' : 'Bookmark'
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
            <BookmarkIcon class="size-4.5 -translate-y-px text-foreground/80 group-focus-visible:scale-110 group-focus-visible:text-foreground group-hover:text-foreground transition-transform group-aria-pressed:text-foreground group-aria-pressed:fill-foreground " />
          </ItemMedia>
          <ItemContent>
            <Listbox.ItemText
              asChild={(innerProps) => (
                <ItemTitle {...innerProps()} class="gap-0 font-mono" />
              )}
            >
              <FieldLabel path={item.path} leaf={item.pathLeaf} />
            </Listbox.ItemText>
            <ItemDescription class="flex flex-wrap gap-2">
              <FieldListMetaBadges
                fieldId={item.fieldId}
                isMounted={item.isMounted}
              />
            </ItemDescription>
          </ItemContent>
        </Listbox.Item>
      )}
    </For>
  )
}

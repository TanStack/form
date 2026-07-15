import {
  Combobox as ComboboxPrimitive,
  useComboboxContext,
} from '@ark-ui/solid'
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-solid'
import { For, Show, splitProps } from 'solid-js'
import type { Accessor, JSX } from 'solid-js'
import type { CollectionItem } from '@ark-ui/solid'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Portal } from '@/components/ui/portal'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Base UI + React component.
// This wraps the Ark UI + SolidJS primitive and preserves shadcn's Tailwind-based
// design-system API, variants, and styling.
// https://ui.shadcn.com/

/**
 * The root component that owns combobox state, filtering, and selection.
 *
 * @example Standard combobox
 * ```tsx
 * type Option = { value: string; label: string }
 *
 * const frameworks = createListCollection<Option>({
 *   items: [
 *     { value: "solid", label: "Solid" },
 *     { value: "react", label: "React" },
 *     { value: "vue", label: "Vue" },
 *   ],
 *   itemToString: (item) => item.label,
 *   itemToValue: (item) => item.value,
 * })
 *
 * <Combobox collection={frameworks} defaultValue={["solid"]} openOnClick>
 *   <ComboboxInput placeholder="Select a framework" />
 *   <ComboboxContent>
 *     <ComboboxEmpty>No framework found.</ComboboxEmpty>
 *     <ComboboxList>
 *       <ComboboxGroup>
 *         <ComboboxLabel>Frameworks</ComboboxLabel>
 *         <ComboboxCollection<Option>>
 *           {(item) => <ComboboxItem item={item}>{item.label}</ComboboxItem>}
 *         </ComboboxCollection>
 *       </ComboboxGroup>
 *     </ComboboxList>
 *   </ComboboxContent>
 * </Combobox>
 * ```
 *
 * @example Multiple selection with chips
 * ```tsx
 * type Option = { value: string; label: string }
 *
 * const languages = createListCollection<Option>({
 *   items: [
 *     { value: "typescript", label: "TypeScript" },
 *     { value: "javascript", label: "JavaScript" },
 *     { value: "rust", label: "Rust" },
 *   ],
 *   itemToString: (item) => item.label,
 *   itemToValue: (item) => item.value,
 * })
 *
 * <Combobox
 *   collection={languages}
 *   defaultValue={["typescript", "rust"]}
 *   closeOnSelect={false}
 *   multiple
 *   openOnClick
 * >
 *   <ComboboxChips>
 *     <ComboboxValue<Option> class="contents">
 *       {(items) => (
 *         <For each={items}>
 *           {(item) => (
 *             <ComboboxChip value={item.value}>{item.label}</ComboboxChip>
 *           )}
 *         </For>
 *       )}
 *     </ComboboxValue>
 *     <ComboboxChipsInput placeholder="Add a language" />
 *     <ComboboxTrigger />
 *   </ComboboxChips>
 *   <ComboboxContent>
 *     <ComboboxEmpty>No language found.</ComboboxEmpty>
 *     <ComboboxList>
 *       <ComboboxCollection<Option>>
 *         {(item) => <ComboboxItem item={item}>{item.label}</ComboboxItem>}
 *       </ComboboxCollection>
 *     </ComboboxList>
 *   </ComboboxContent>
 * </Combobox>
 * ```
 */
function Combobox<T extends CollectionItem>(
  props: ComboboxPrimitive.RootProps<T>,
) {
  const [local, others] = splitProps(props, ['children', 'positioning'])

  return (
    <ComboboxPrimitive.Root
      data-slot="combobox"
      positioning={{
        placement: 'bottom-start',
        gutter: 6,
        sameWidth: true,
        fitViewport: true,
        ...local.positioning,
      }}
      {...others}
    >
      {local.children}
    </ComboboxPrimitive.Root>
  )
}

type ComboboxValueProps<T extends CollectionItem = CollectionItem> = Omit<
  JSX.HTMLElementTags['span'],
  'children'
> & {
  children?: JSX.Element | ((items: Array<T>) => JSX.Element)
  placeholder?: JSX.Element
}

/** Renders the current selected value or a placeholder. */
function ComboboxValue<T extends CollectionItem = CollectionItem>(
  props: ComboboxValueProps<T>,
) {
  const [local, others] = splitProps(props, [
    'children',
    'class',
    'placeholder',
  ])
  const combobox = useComboboxContext()

  const selectedContent = () => {
    if (typeof local.children === 'function') {
      return local.children(combobox().selectedItems as Array<T>)
    }

    return local.children ?? combobox().valueAsString
  }

  return (
    <span
      data-slot="combobox-value"
      data-placeholder={!combobox().hasSelectedItems ? '' : undefined}
      class={local.class}
      {...others}
    >
      <Show when={combobox().hasSelectedItems} fallback={local.placeholder}>
        {selectedContent()}
      </Show>
    </span>
  )
}

/** The button that toggles the suggestions popup. */
function ComboboxTrigger(props: ComboboxPrimitive.TriggerProps) {
  const [local, others] = splitProps(props, ['children', 'class'])

  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      class={cn("[&_svg:not([class*='size-'])]:size-4", local.class)}
      {...others}
    >
      {local.children}
      <ChevronDownIcon class="pointer-events-none size-4 text-muted-foreground" />
    </ComboboxPrimitive.Trigger>
  )
}

/** Clears the current selection. */
function ComboboxClear(props: ComboboxPrimitive.ClearTriggerProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <ComboboxPrimitive.ClearTrigger
      data-slot="combobox-clear"
      class={local.class}
      {...others}
      asChild={(clearProps) => (
        <InputGroupButton
          {...clearProps()}
          data-slot="combobox-clear"
          variant="ghost"
          size="icon-xs"
          class={local.class}
        >
          <XIcon class="pointer-events-none" />
        </InputGroupButton>
      )}
    />
  )
}

type ComboboxInputProps = ComboboxPrimitive.InputProps & {
  showClear?: boolean
  showTrigger?: boolean
}

/** A styled text input with optional clear and popup trigger controls. */
function ComboboxInput(props: ComboboxInputProps) {
  const [local, others] = splitProps(props, [
    'children',
    'class',
    'disabled',
    'showClear',
    'showTrigger',
  ])

  const showClear = () => local.showClear ?? false
  const showTrigger = () => local.showTrigger ?? true

  return (
    <ComboboxPrimitive.Control
      asChild={(controlProps) => (
        <InputGroup {...controlProps()} class={cn('w-auto', local.class)}>
          <ComboboxPrimitive.Input
            {...others}
            asChild={(inputProps) => (
              <InputGroupInput
                {...inputProps()}
                disabled={local.disabled ?? false}
              />
            )}
          />
          <InputGroupAddon align="inline-end">
            <Show when={showTrigger()}>
              <ComboboxTrigger
                disabled={local.disabled}
                asChild={(triggerProps) => (
                  <InputGroupButton
                    {...triggerProps()}
                    data-slot="combobox-trigger"
                    size="icon-xs"
                    variant="ghost"
                    class="group-has-data-[slot=combobox-clear]/input-group:hidden data-[state=open]:bg-transparent"
                  />
                )}
              />
            </Show>
            <Show when={showClear()}>
              <ComboboxPrimitive.Context>
                {(combobox) => (
                  <Show when={combobox().hasSelectedItems}>
                    <ComboboxClear disabled={local.disabled} />
                  </Show>
                )}
              </ComboboxPrimitive.Context>
            </Show>
          </InputGroupAddon>
          {local.children}
        </InputGroup>
      )}
    />
  )
}

/** The portalled popup surface containing combobox suggestions. */
function ComboboxContent(props: ComboboxPrimitive.ContentProps) {
  const [local, others] = splitProps(props, ['children', 'class'])

  return (
    <Portal>
      <ComboboxPrimitive.Positioner
        data-slot="combobox-positioner"
        class="isolate z-50"
      >
        <ComboboxPrimitive.Content
          data-slot="combobox-content"
          class={cn(
            'group/combobox-content relative max-h-(--available-height) w-(--reference-width) max-w-(--available-width) min-w-(--reference-width) origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            local.class,
          )}
          {...others}
        >
          {local.children}
        </ComboboxPrimitive.Content>
      </ComboboxPrimitive.Positioner>
    </Portal>
  )
}

/** A scrollable listbox containing the filtered suggestions. */
function ComboboxList(props: ComboboxPrimitive.ListProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      class={cn(
        'no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0',
        local.class,
      )}
      {...others}
    />
  )
}

/** A selectable item from the root's Ark list collection. */
function ComboboxItem(props: ComboboxPrimitive.ItemProps) {
  const [local, others] = splitProps(props, ['children', 'class', 'item'])

  return (
    <ComboboxPrimitive.Item
      item={local.item}
      data-slot="combobox-item"
      class={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
      {...others}
    >
      <ComboboxPrimitive.ItemText>{local.children}</ComboboxPrimitive.ItemText>
      <ComboboxPrimitive.ItemIndicator class="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <CheckIcon class="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

/** Groups related suggestions. */
function ComboboxGroup(props: ComboboxPrimitive.ItemGroupProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <ComboboxPrimitive.ItemGroup
      data-slot="combobox-group"
      class={local.class}
      {...others}
    />
  )
}

/** A muted label for a ComboboxGroup. */
function ComboboxLabel(props: ComboboxPrimitive.ItemGroupLabelProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <ComboboxPrimitive.ItemGroupLabel
      data-slot="combobox-label"
      class={cn('px-2 py-1.5 text-xs text-muted-foreground', local.class)}
      {...others}
    />
  )
}

type ComboboxCollectionProps<T extends CollectionItem = CollectionItem> = Omit<
  JSX.HTMLElementTags['div'],
  'children'
> & {
  children: (item: T, index: Accessor<number>) => JSX.Element
}

/** Renders every item in the root's current (usually filtered) collection. */
function ComboboxCollection<T extends CollectionItem = CollectionItem>(
  props: ComboboxCollectionProps<T>,
) {
  const [local, others] = splitProps(props, ['children', 'class'])
  const combobox = useComboboxContext()

  return (
    <div data-slot="combobox-collection" class={local.class} {...others}>
      <For each={combobox().collection.items as Array<T>}>{local.children}</For>
    </div>
  )
}

/** Empty-state content shown when the filtered collection has no items. */
function ComboboxEmpty(props: ComboboxPrimitive.EmptyProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      class={cn(
        'hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex',
        local.class,
      )}
      {...others}
    />
  )
}

/** A visual divider between suggestion groups. */
function ComboboxSeparator(props: JSX.HTMLElementTags['div']) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      data-slot="combobox-separator"
      class={cn('-mx-1 my-1 h-px bg-border', local.class)}
      {...others}
    />
  )
}

/** A multi-select control that contains selected chips and an input. */
function ComboboxChips(props: ComboboxPrimitive.ControlProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <ComboboxPrimitive.Control
      data-slot="combobox-chips"
      class={cn(
        'flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40',
        local.class,
      )}
      {...others}
    />
  )
}

type ComboboxChipProps = Omit<JSX.HTMLElementTags['span'], 'children'> & {
  children?: JSX.Element
  disabled?: boolean
  showRemove?: boolean
  value: string
}

/** A selected value with an optional remove button. */
function ComboboxChip(props: ComboboxChipProps) {
  const [local, others] = splitProps(props, [
    'children',
    'class',
    'disabled',
    'showRemove',
    'value',
  ])
  const combobox = useComboboxContext()
  const showRemove = () => local.showRemove ?? true

  return (
    <span
      data-slot="combobox-chip"
      data-disabled={local.disabled ? '' : undefined}
      class={cn(
        'flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0',
        local.class,
      )}
      {...others}
    >
      {local.children}
      <Show when={showRemove()}>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          class="-ml-1 opacity-50 hover:opacity-100"
          data-slot="combobox-chip-remove"
          aria-label="Remove option"
          disabled={local.disabled || combobox().disabled}
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => combobox().clearValue(local.value)}
        >
          <XIcon class="pointer-events-none" />
        </Button>
      </Show>
    </span>
  )
}

/** The editable input used inside ComboboxChips. */
function ComboboxChipsInput(props: ComboboxPrimitive.InputProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      class={cn('min-w-16 flex-1 outline-none', local.class)}
      {...others}
    />
  )
}

export {
  Combobox,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
}

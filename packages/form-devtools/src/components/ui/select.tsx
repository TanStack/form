import { Select as SelectPrimitive, createListCollection } from '@ark-ui/solid'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-solid'
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  splitProps,
  useContext,
} from 'solid-js'
import { Portal } from './portal'
import type { Accessor, JSX } from 'solid-js'
import type { ListCollection } from '@ark-ui/solid'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Radix UI + React component.
// This wraps the Ark UI + SolidJS primitive and preserves shadcn's Tailwind-based
// design-system API, variants, and styling.
// https://ui.shadcn.com/

type SelectItemData = {
  value: string
  label: string
  disabled?: boolean
}

type RegisteredSelectItem = {
  id: symbol
  item: SelectItemData
}

type SelectContextValue = {
  collection: Accessor<ListCollection<SelectItemData>>
  removeItem: (id: symbol) => void
  upsertItem: (id: symbol, item: SelectItemData) => void
}

const SelectContext = createContext<SelectContextValue>()

function useSelectContext() {
  const context = useContext(SelectContext)

  if (!context) {
    throw new Error('Select components must be used within <Select>')
  }

  return context
}

function getItemLabel(value: string, children: JSX.Element, label?: string) {
  if (label) {
    return label
  }

  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }

  return value
}

type SelectProps = Omit<
  SelectPrimitive.RootProps<SelectItemData>,
  'collection'
> & {
  collection?: ListCollection<SelectItemData>
}

/**
 * The root component that owns select state and the available item collection.
 *
 * @example
 * ```tsx
 * <Select defaultValue={["general"]}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose area" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectScrollUpButton />
 *     <SelectGroup>
 *       <SelectLabel>Workspace</SelectLabel>
 *       <SelectItem value="general">General</SelectItem>
 *       <SelectSeparator />
 *       <SelectItem value="billing">Billing</SelectItem>
 *     </SelectGroup>
 *     <SelectScrollDownButton />
 *   </SelectContent>
 * </Select>
 * ```
 */
function Select(props: SelectProps) {
  const [local, others] = splitProps(props, [
    'children',
    'collection',
    'positioning',
  ])
  const [registeredItems, setRegisteredItems] = createSignal<
    Array<RegisteredSelectItem>
  >([])

  const internalCollection = createMemo(() =>
    createListCollection<SelectItemData>({
      items: registeredItems().map((entry) => entry.item),
      itemToString: (item) => item.label,
      itemToValue: (item) => item.value,
      isItemDisabled: (item) => !!item.disabled,
    }),
  )

  const collection = () => local.collection ?? internalCollection()

  const context: SelectContextValue = {
    collection,
    removeItem: (id) => {
      setRegisteredItems((items) => items.filter((item) => item.id !== id))
    },
    upsertItem: (id, item) => {
      setRegisteredItems((items) => {
        const index = items.findIndex((entry) => entry.id === id)

        if (index === -1) {
          return [...items, { id, item }]
        }

        const nextItems = items.slice()
        nextItems[index] = { id, item }
        return nextItems
      })
    },
  }

  return (
    <SelectContext.Provider value={context}>
      <SelectPrimitive.Root
        data-slot="select"
        collection={collection()}
        positioning={{ fitViewport: true, ...local.positioning }}
        {...others}
      >
        <SelectPrimitive.HiddenSelect />
        {local.children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  )
}

/**
 * Groups related SelectItem options within SelectContent.
 *
 * @example
 * ```tsx
 * <Select defaultValue={["general"]}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose area" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectScrollUpButton />
 *     <SelectGroup>
 *       <SelectLabel>Workspace</SelectLabel>
 *       <SelectItem value="general">General</SelectItem>
 *       <SelectSeparator />
 *       <SelectItem value="billing">Billing</SelectItem>
 *     </SelectGroup>
 *     <SelectScrollDownButton />
 *   </SelectContent>
 * </Select>
 * ```
 */
function SelectGroup(props: SelectPrimitive.ItemGroupProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <SelectPrimitive.ItemGroup
      data-slot="select-group"
      class={cn('scroll-my-1 p-1', local.class)}
      {...others}
    />
  )
}

/**
 * Displays the selected item label or placeholder inside a SelectTrigger.
 *
 * @example
 * ```tsx
 * <Select defaultValue={["general"]}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose area" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectScrollUpButton />
 *     <SelectGroup>
 *       <SelectLabel>Workspace</SelectLabel>
 *       <SelectItem value="general">General</SelectItem>
 *       <SelectSeparator />
 *       <SelectItem value="billing">Billing</SelectItem>
 *     </SelectGroup>
 *     <SelectScrollDownButton />
 *   </SelectContent>
 * </Select>
 * ```
 */
function SelectValue(props: SelectPrimitive.ValueTextProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <SelectPrimitive.ValueText
      data-slot="select-value"
      class={local.class}
      {...others}
    />
  )
}

type SelectTriggerProps = SelectPrimitive.TriggerProps & {
  size?: 'sm' | 'default'
}

/**
 * The button-like control that opens the SelectContent popover.
 *
 * @example
 * ```tsx
 * <Select defaultValue={["general"]}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose area" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectScrollUpButton />
 *     <SelectGroup>
 *       <SelectLabel>Workspace</SelectLabel>
 *       <SelectItem value="general">General</SelectItem>
 *       <SelectSeparator />
 *       <SelectItem value="billing">Billing</SelectItem>
 *     </SelectGroup>
 *     <SelectScrollDownButton />
 *   </SelectContent>
 * </Select>
 * ```
 */
function SelectTrigger(props: SelectTriggerProps) {
  const [local, others] = splitProps(props, ['class', 'size', 'children'])

  const size = () => local.size ?? 'default'

  return (
    <SelectPrimitive.Control data-slot="select-control" class="contents">
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        data-size={size()}
        class={cn(
          "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          local.class,
        )}
        {...others}
      >
        {local.children}
        <SelectPrimitive.Indicator data-slot="select-icon">
          <ChevronDownIcon class="pointer-events-none size-4 text-muted-foreground" />
        </SelectPrimitive.Indicator>
      </SelectPrimitive.Trigger>
    </SelectPrimitive.Control>
  )
}

type SelectContentProps = SelectPrimitive.ContentProps & {
  position?: 'item-aligned' | 'popper'
  align?: 'start' | 'center' | 'end'
}

/**
 * The floating listbox surface that contains SelectItem options.
 *
 * @example
 * ```tsx
 * <Select defaultValue={["general"]}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose area" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectScrollUpButton />
 *     <SelectGroup>
 *       <SelectLabel>Workspace</SelectLabel>
 *       <SelectItem value="general">General</SelectItem>
 *       <SelectSeparator />
 *       <SelectItem value="billing">Billing</SelectItem>
 *     </SelectGroup>
 *     <SelectScrollDownButton />
 *   </SelectContent>
 * </Select>
 * ```
 */
function SelectContent(props: SelectContentProps) {
  const [local, others] = splitProps(props, [
    'class',
    'children',
    'position',
    'align',
  ])

  const position = () => local.position ?? 'item-aligned'
  const align = () => local.align ?? 'center'

  return (
    <Portal>
      <SelectPrimitive.Positioner data-slot="select-positioner">
        <SelectPrimitive.Content
          data-slot="select-content"
          data-align={align()}
          data-align-trigger={position() === 'item-aligned'}
          class={cn(
            'relative z-50 max-h-[min(var(--available-height,20rem),20rem)] min-w-36 origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[placement^=bottom]:slide-in-from-top-2 data-[placement^=left]:slide-in-from-right-2 data-[placement^=right]:slide-in-from-left-2 data-[placement^=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            position() === 'popper' &&
              'data-[placement^=bottom]:translate-y-1 data-[placement^=left]:-translate-x-1 data-[placement^=right]:translate-x-1 data-[placement^=top]:-translate-y-1',
            local.class,
          )}
          {...others}
        >
          <SelectPrimitive.List
            data-slot="select-list"
            data-position={position()}
            class="max-h-[inherit] overflow-x-hidden overflow-y-auto data-[position=popper]:w-full data-[position=popper]:min-w-(--reference-width)"
          >
            {local.children}
          </SelectPrimitive.List>
        </SelectPrimitive.Content>
      </SelectPrimitive.Positioner>
    </Portal>
  )
}

/**
 * A muted label for a group of SelectItem options.
 *
 * @example
 * ```tsx
 * <Select defaultValue={["general"]}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose area" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectScrollUpButton />
 *     <SelectGroup>
 *       <SelectLabel>Workspace</SelectLabel>
 *       <SelectItem value="general">General</SelectItem>
 *       <SelectSeparator />
 *       <SelectItem value="billing">Billing</SelectItem>
 *     </SelectGroup>
 *     <SelectScrollDownButton />
 *   </SelectContent>
 * </Select>
 * ```
 */
function SelectLabel(props: SelectPrimitive.ItemGroupLabelProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <SelectPrimitive.ItemGroupLabel
      data-slot="select-label"
      class={cn('px-1.5 py-1 text-xs text-muted-foreground', local.class)}
      {...others}
    />
  )
}

type SelectItemProps = Omit<SelectPrimitive.ItemProps, 'children' | 'item'> & {
  children?: JSX.Element
  disabled?: boolean
  label?: string
  textValue?: string
  value: string
}

/**
 * A selectable option that registers itself with the parent Select collection.
 *
 * @example
 * ```tsx
 * <Select defaultValue={["general"]}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose area" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectScrollUpButton />
 *     <SelectGroup>
 *       <SelectLabel>Workspace</SelectLabel>
 *       <SelectItem value="general">General</SelectItem>
 *       <SelectSeparator />
 *       <SelectItem value="billing">Billing</SelectItem>
 *     </SelectGroup>
 *     <SelectScrollDownButton />
 *   </SelectContent>
 * </Select>
 * ```
 */
function SelectItem(props: SelectItemProps) {
  const [local, others] = splitProps(props, [
    'class',
    'children',
    'disabled',
    'label',
    'textValue',
    'value',
  ])
  const context = useSelectContext()
  const id = Symbol('select-item')

  const item = (): SelectItemData => ({
    value: local.value,
    label: getItemLabel(
      local.value,
      local.children,
      local.textValue ?? local.label,
    ),
    disabled: local.disabled,
  })

  createEffect(() => {
    context.upsertItem(id, item())
  })

  onCleanup(() => {
    context.removeItem(id)
  })

  const collectionItem = () => context.collection().find(local.value) ?? item()

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      item={collectionItem()}
      class={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        local.class,
      )}
      {...others}
    >
      <span class="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon class="pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{local.children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

/**
 * A visual divider between groups or related SelectItem options.
 *
 * @example
 * ```tsx
 * <Select defaultValue={["general"]}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose area" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectScrollUpButton />
 *     <SelectGroup>
 *       <SelectLabel>Workspace</SelectLabel>
 *       <SelectItem value="general">General</SelectItem>
 *       <SelectSeparator />
 *       <SelectItem value="billing">Billing</SelectItem>
 *     </SelectGroup>
 *     <SelectScrollDownButton />
 *   </SelectContent>
 * </Select>
 * ```
 */
function SelectSeparator(props: JSX.HTMLElementTags['div']) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      data-slot="select-separator"
      class={cn('pointer-events-none -mx-1 my-1 h-px bg-border', local.class)}
      {...others}
    />
  )
}

/**
 * An optional scroll affordance for overflowing SelectContent above the visible
 * list.
 *
 * @example
 * ```tsx
 * <Select defaultValue={["general"]}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose area" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectScrollUpButton />
 *     <SelectGroup>
 *       <SelectLabel>Workspace</SelectLabel>
 *       <SelectItem value="general">General</SelectItem>
 *       <SelectSeparator />
 *       <SelectItem value="billing">Billing</SelectItem>
 *     </SelectGroup>
 *     <SelectScrollDownButton />
 *   </SelectContent>
 * </Select>
 * ```
 */
function SelectScrollUpButton(props: JSX.HTMLElementTags['div']) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      aria-hidden="true"
      data-slot="select-scroll-up-button"
      class={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
      {...others}
    >
      <ChevronUpIcon />
    </div>
  )
}

/**
 * An optional scroll affordance for overflowing SelectContent below the visible
 * list.
 *
 * @example
 * ```tsx
 * <Select defaultValue={["general"]}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose area" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectScrollUpButton />
 *     <SelectGroup>
 *       <SelectLabel>Workspace</SelectLabel>
 *       <SelectItem value="general">General</SelectItem>
 *       <SelectSeparator />
 *       <SelectItem value="billing">Billing</SelectItem>
 *     </SelectGroup>
 *     <SelectScrollDownButton />
 *   </SelectContent>
 * </Select>
 * ```
 */
function SelectScrollDownButton(props: JSX.HTMLElementTags['div']) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      aria-hidden="true"
      data-slot="select-scroll-down-button"
      class={cn(
        "z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
      {...others}
    >
      <ChevronDownIcon />
    </div>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}

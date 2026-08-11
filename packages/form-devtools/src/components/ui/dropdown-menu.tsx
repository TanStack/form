import { Menu as DropdownMenuPrimitive } from '@ark-ui/solid'
import CheckIcon from 'lucide-solid/icons/check'
import ChevronRightIcon from 'lucide-solid/icons/chevron-right'
import { createUniqueId, splitProps } from 'solid-js'
import type { JSX } from 'solid-js'
import { Portal } from '@/components/ui/portal'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Radix UI + React component.
// This wraps the Ark UI + SolidJS primitive and preserves shadcn's Tailwind-based
// design-system API, variants, and styling.
// https://ui.shadcn.com/

type OptionalValueItemProps = {
  value?: string
}

/**
 * The root component that owns dropdown menu state and positioning.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger
 *     asChild={(triggerProps) => (
 *       <Button variant="outline" {...triggerProps()}>
 *         Open
 *       </Button>
 *     )}
 *   />
 *   <DropdownMenuContent>
 *     <DropdownMenuItem value="profile">Profile</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
function DropdownMenu(props: DropdownMenuPrimitive.RootProps) {
  const [local, others] = splitProps(props, ['children', 'positioning'])

  return (
    <DropdownMenuPrimitive.Root
      {...others}
      data-slot="dropdown-menu"
      positioning={{
        placement: 'bottom-start',
        gutter: 8,
        fitViewport: true,
        ...local.positioning,
      }}
    >
      {local.children}
    </DropdownMenuPrimitive.Root>
  )
}

/**
 * The control that opens and closes a DropdownMenu.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger
 *     asChild={(triggerProps) => (
 *       <Button variant="outline" {...triggerProps()}>
 *         Open
 *       </Button>
 *     )}
 *   />
 *   <DropdownMenuContent>
 *     <DropdownMenuItem value="profile">Profile</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
function DropdownMenuTrigger(props: DropdownMenuPrimitive.TriggerProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <DropdownMenuPrimitive.Trigger
      {...others}
      data-slot="dropdown-menu-trigger"
      class={local.class}
    />
  )
}

/**
 * The floating menu surface that contains DropdownMenuItem actions.
 *
 * @example
 * ```tsx
 * <DropdownMenu positioning={{ placement: "bottom-start" }}>
 *   <DropdownMenuTrigger
 *     asChild={(triggerProps) => (
 *       <Button variant="outline" {...triggerProps()}>
 *         Open
 *       </Button>
 *     )}
 *   />
 *   <DropdownMenuContent class="w-40">
 *     <DropdownMenuItem value="profile">Profile</DropdownMenuItem>
 *     <DropdownMenuItem value="settings">Settings</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
function DropdownMenuContent(props: DropdownMenuPrimitive.ContentProps) {
  const [local, others] = splitProps(props, ['children', 'class'])

  return (
    <Portal>
      <DropdownMenuPrimitive.Positioner data-slot="dropdown-menu-positioner">
        <DropdownMenuPrimitive.Content
          {...others}
          data-slot="dropdown-menu-content"
          class={cn(
            'outline-none z-50 max-h-(--available-height) min-w-[max(var(--reference-width),8rem)] origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:overflow-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            local.class,
          )}
        >
          {local.children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Positioner>
    </Portal>
  )
}

/**
 * Groups related DropdownMenuItem actions within DropdownMenuContent.
 *
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuGroup>
 *     <DropdownMenuLabel>Account</DropdownMenuLabel>
 *     <DropdownMenuItem value="profile">Profile</DropdownMenuItem>
 *   </DropdownMenuGroup>
 * </DropdownMenuContent>
 * ```
 */
function DropdownMenuGroup(props: DropdownMenuPrimitive.ItemGroupProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <DropdownMenuPrimitive.ItemGroup
      {...others}
      data-slot="dropdown-menu-group"
      class={local.class}
    />
  )
}

type DropdownMenuItemProps = Omit<DropdownMenuPrimitive.ItemProps, 'value'> &
  OptionalValueItemProps & {
    inset?: boolean
    variant?: 'default' | 'destructive'
  }

/**
 * A selectable action within DropdownMenuContent.
 *
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuItem value="profile">
 *     Profile
 *     <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut>
 *   </DropdownMenuItem>
 *   <DropdownMenuItem value="delete" variant="destructive">
 *     Delete
 *   </DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 */
function DropdownMenuItem(props: DropdownMenuItemProps) {
  const [local, others] = splitProps(props, [
    'class',
    'inset',
    'value',
    'variant',
  ])
  const fallbackValue = createUniqueId()

  const variant = () => local.variant ?? 'default'
  const value = () => local.value ?? fallbackValue

  return (
    <DropdownMenuPrimitive.Item
      {...others}
      value={value()}
      data-slot="dropdown-menu-item"
      data-inset={local.inset ? '' : undefined}
      data-variant={variant()}
      class={cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/10 data-[variant=destructive]:data-highlighted:text-destructive dark:data-[variant=destructive]:data-highlighted:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
        local.class,
      )}
    />
  )
}

type DropdownMenuCheckboxItemProps = Omit<
  DropdownMenuPrimitive.CheckboxItemProps,
  'checked' | 'value'
> &
  OptionalValueItemProps & {
    checked?: boolean
    inset?: boolean
  }

/**
 * A checkable menu item for toggling an option from DropdownMenuContent.
 *
 * @example
 * ```tsx
 * <DropdownMenu closeOnSelect={false}>
 *   <DropdownMenuTrigger>View</DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuCheckboxItem
 *       value="grid"
 *       checked={showGrid()}
 *       onCheckedChange={(checked) => setShowGrid(checked)}
 *     >
 *       Grid
 *     </DropdownMenuCheckboxItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
function DropdownMenuCheckboxItem(props: DropdownMenuCheckboxItemProps) {
  const [local, others] = splitProps(props, [
    'checked',
    'children',
    'class',
    'inset',
    'value',
  ])
  const fallbackValue = createUniqueId()

  const checked = () => local.checked ?? false
  const value = () => local.value ?? fallbackValue

  return (
    <DropdownMenuPrimitive.CheckboxItem
      {...others}
      checked={checked()}
      value={value()}
      data-slot="dropdown-menu-checkbox-item"
      data-inset={local.inset ? '' : undefined}
      class={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-highlighted:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
    >
      <span
        class="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {local.children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

/**
 * Groups mutually exclusive DropdownMenuRadioItem options.
 *
 * @example
 * ```tsx
 * <DropdownMenuRadioGroup
 *   value={density()}
 *   onValueChange={(details) => setDensity(details.value)}
 * >
 *   <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
 *   <DropdownMenuRadioItem value="comfortable">
 *     Comfortable
 *   </DropdownMenuRadioItem>
 * </DropdownMenuRadioGroup>
 * ```
 */
function DropdownMenuRadioGroup(
  props: DropdownMenuPrimitive.RadioItemGroupProps,
) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <DropdownMenuPrimitive.RadioItemGroup
      {...others}
      data-slot="dropdown-menu-radio-group"
      class={local.class}
    />
  )
}

type DropdownMenuRadioItemProps = DropdownMenuPrimitive.RadioItemProps & {
  inset?: boolean
}

/**
 * A radio-style menu item controlled by a DropdownMenuRadioGroup.
 *
 * @example
 * ```tsx
 * <DropdownMenuRadioGroup value="comfortable">
 *   <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
 *   <DropdownMenuRadioItem value="comfortable">
 *     Comfortable
 *   </DropdownMenuRadioItem>
 * </DropdownMenuRadioGroup>
 * ```
 */
function DropdownMenuRadioItem(props: DropdownMenuRadioItemProps) {
  const [local, others] = splitProps(props, ['children', 'class', 'inset'])

  return (
    <DropdownMenuPrimitive.RadioItem
      {...others}
      data-slot="dropdown-menu-radio-item"
      data-inset={local.inset ? '' : undefined}
      class={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-highlighted:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
    >
      <span
        class="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {local.children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

type DropdownMenuLabelProps = JSX.HTMLElementTags['div'] & {
  inset?: boolean
}

/**
 * A muted label for a group of dropdown menu actions.
 *
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuGroup>
 *     <DropdownMenuLabel>Account</DropdownMenuLabel>
 *     <DropdownMenuItem value="profile">Profile</DropdownMenuItem>
 *   </DropdownMenuGroup>
 * </DropdownMenuContent>
 * ```
 */
function DropdownMenuLabel(props: DropdownMenuLabelProps) {
  const [local, others] = splitProps(props, ['class', 'inset'])

  return (
    <div
      {...others}
      data-slot="dropdown-menu-label"
      data-inset={local.inset ? '' : undefined}
      class={cn(
        'px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7',
        local.class,
      )}
    />
  )
}

/**
 * A visual divider between groups of dropdown menu actions.
 *
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuItem value="profile">Profile</DropdownMenuItem>
 *   <DropdownMenuSeparator />
 *   <DropdownMenuItem value="logout">Log out</DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 */
function DropdownMenuSeparator(props: DropdownMenuPrimitive.SeparatorProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <DropdownMenuPrimitive.Separator
      {...others}
      data-slot="dropdown-menu-separator"
      class={cn('-mx-1 my-1 h-px bg-border', local.class)}
    />
  )
}

/**
 * Right-aligned shortcut text shown inside a DropdownMenuItem.
 *
 * @example
 * ```tsx
 * <DropdownMenuItem value="profile">
 *   Profile
 *   <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut>
 * </DropdownMenuItem>
 * ```
 */
function DropdownMenuShortcut(props: JSX.HTMLElementTags['span']) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <span
      {...others}
      data-slot="dropdown-menu-shortcut"
      class={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground group-data-highlighted/dropdown-menu-item:text-accent-foreground',
        local.class,
      )}
    />
  )
}

type DropdownMenuSubTriggerProps = DropdownMenuPrimitive.TriggerItemProps & {
  inset?: boolean
}

/**
 * The menu item that opens a nested dropdown menu.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
 *   <DropdownMenuSubContent>
 *     <DropdownMenuItem value="email">Email</DropdownMenuItem>
 *   </DropdownMenuSubContent>
 * </DropdownMenu>
 * ```
 */
function DropdownMenuSubTrigger(props: DropdownMenuSubTriggerProps) {
  const [local, others] = splitProps(props, ['children', 'class', 'inset'])

  return (
    <DropdownMenuPrimitive.TriggerItem
      {...others}
      data-slot="dropdown-menu-sub-trigger"
      data-inset={local.inset ? '' : undefined}
      class={cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
    >
      {local.children}
      <ChevronRightIcon class="ml-auto" />
    </DropdownMenuPrimitive.TriggerItem>
  )
}

/**
 * The floating content surface for a nested dropdown menu.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
 *   <DropdownMenuSubContent>
 *     <DropdownMenuItem value="email">Email</DropdownMenuItem>
 *     <DropdownMenuItem value="message">Message</DropdownMenuItem>
 *   </DropdownMenuSubContent>
 * </DropdownMenu>
 * ```
 */
function DropdownMenuSubContent(props: DropdownMenuPrimitive.ContentProps) {
  const [local, others] = splitProps(props, ['children', 'class'])

  return (
    <Portal>
      <DropdownMenuPrimitive.Positioner data-slot="dropdown-menu-sub-positioner">
        <DropdownMenuPrimitive.Content
          {...others}
          data-slot="dropdown-menu-sub-content"
          class={cn(
            'z-50 min-w-24 origin-(--transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            local.class,
          )}
        >
          {local.children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Positioner>
    </Portal>
  )
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}

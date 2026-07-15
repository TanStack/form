import { Popover as PopoverPrimitive } from '@ark-ui/solid'
import { splitProps } from 'solid-js'
import type { JSX } from 'solid-js'

import { cn } from '@/utils'

/**
 * The root component that coordinates popover trigger, anchor, and content.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverAnchor class="inline-block">Workspace</PopoverAnchor>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>
 *     <PopoverHeader>
 *       <PopoverTitle>Workspace</PopoverTitle>
 *       <PopoverDescription>Manage shared access.</PopoverDescription>
 *     </PopoverHeader>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
function Popover(props: PopoverPrimitive.RootProps) {
  const [local, others] = splitProps(props, ['children', 'portalled'])

  return (
    <PopoverPrimitive.Root
      data-slot="popover"
      portalled={local.portalled ?? false}
      {...others}
    >
      {local.children}
    </PopoverPrimitive.Root>
  )
}

/**
 * The control that opens and closes a Popover.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverAnchor class="inline-block">Workspace</PopoverAnchor>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>
 *     <PopoverHeader>
 *       <PopoverTitle>Workspace</PopoverTitle>
 *       <PopoverDescription>Manage shared access.</PopoverDescription>
 *     </PopoverHeader>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
function PopoverTrigger(props: PopoverPrimitive.TriggerProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      class={local.class}
      {...others}
    />
  )
}

/**
 * The floating surface rendered when a Popover is open.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverAnchor class="inline-block">Workspace</PopoverAnchor>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>
 *     <PopoverHeader>
 *       <PopoverTitle>Workspace</PopoverTitle>
 *       <PopoverDescription>Manage shared access.</PopoverDescription>
 *     </PopoverHeader>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
function PopoverContent(props: PopoverPrimitive.ContentProps) {
  const [local, others] = splitProps(props, ['children', 'class'])

  return (
    <PopoverPrimitive.Positioner data-slot="popover-positioner">
      <PopoverPrimitive.Content
        data-slot="popover-content"
        class={cn(
          'z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          local.class,
        )}
        {...others}
      >
        {local.children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Positioner>
  )
}

/**
 * An optional positioning anchor for aligning PopoverContent separately from the
 * trigger.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverAnchor class="inline-block">Workspace</PopoverAnchor>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>
 *     <PopoverHeader>
 *       <PopoverTitle>Workspace</PopoverTitle>
 *       <PopoverDescription>Manage shared access.</PopoverDescription>
 *     </PopoverHeader>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
function PopoverAnchor(props: PopoverPrimitive.AnchorProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <PopoverPrimitive.Anchor
      data-slot="popover-anchor"
      class={local.class}
      {...others}
    />
  )
}

/**
 * A compact header layout for PopoverTitle and PopoverDescription.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverAnchor class="inline-block">Workspace</PopoverAnchor>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>
 *     <PopoverHeader>
 *       <PopoverTitle>Workspace</PopoverTitle>
 *       <PopoverDescription>Manage shared access.</PopoverDescription>
 *     </PopoverHeader>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
function PopoverHeader(props: JSX.HTMLElementTags['div']) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      data-slot="popover-header"
      class={cn('flex flex-col gap-0.5 text-sm', local.class)}
      {...others}
    />
  )
}

/**
 * The accessible title for PopoverContent.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverAnchor class="inline-block">Workspace</PopoverAnchor>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>
 *     <PopoverHeader>
 *       <PopoverTitle>Workspace</PopoverTitle>
 *       <PopoverDescription>Manage shared access.</PopoverDescription>
 *     </PopoverHeader>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
function PopoverTitle(props: PopoverPrimitive.TitleProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      class={cn('font-medium', local.class)}
      {...others}
    />
  )
}

/**
 * Supporting descriptive text for PopoverContent.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverAnchor class="inline-block">Workspace</PopoverAnchor>
 *   <PopoverTrigger>Open</PopoverTrigger>
 *   <PopoverContent>
 *     <PopoverHeader>
 *       <PopoverTitle>Workspace</PopoverTitle>
 *       <PopoverDescription>Manage shared access.</PopoverDescription>
 *     </PopoverHeader>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
function PopoverDescription(props: PopoverPrimitive.DescriptionProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      class={cn('text-muted-foreground', local.class)}
      {...others}
    />
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}

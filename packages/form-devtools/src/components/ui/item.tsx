import { cva } from 'class-variance-authority'
import { ark } from '@ark-ui/solid/factory'
import { splitProps } from 'solid-js'
import type { JSX } from 'solid-js'
import type { VariantProps } from 'class-variance-authority'
import type { HTMLArkProps } from '@ark-ui/solid/factory'
import type { SeparatorProps } from '@/components/ui/separator'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Radix UI + React component.
// Item uses an Ark factory element for Solid's render-function asChild API;
// the remaining parts are styled, non-interactive DOM primitives.
// https://ui.shadcn.com/

type DivProps = JSX.HTMLElementTags['div']

function ItemGroup(props: DivProps) {
  const [local, others] = splitProps(props, ['class', 'role'])

  return (
    <div
      {...others}
      role={local.role ?? 'list'}
      data-slot="item-group"
      class={cn(
        'group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2',
        local.class,
      )}
    />
  )
}

function ItemSeparator(props: SeparatorProps) {
  const [local, others] = splitProps(props, [
    'class',
    'orientation',
    'data-slot',
  ])

  return (
    <Separator
      {...others}
      data-slot="item-separator"
      orientation={local.orientation ?? 'horizontal'}
      class={cn('my-2', local.class)}
    />
  )
}

const itemVariants = cva(
  'group/item flex w-full flex-wrap items-center rounded-lg border text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-muted',
  {
    variants: {
      variant: {
        default: 'border-transparent',
        outline: 'border-border',
        muted: 'border-transparent bg-muted/50',
      },
      size: {
        default: 'gap-2.5 px-3 py-2.5',
        sm: 'gap-2.5 px-3 py-2.5',
        xs: 'gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ItemProps = HTMLArkProps<'div'> & VariantProps<typeof itemVariants>

/**
 * A flexible row for displaying media, content, metadata, and actions.
 *
 * Use Ark's render-function `asChild` prop when the item should render as a
 * link or another element.
 */
function Item(props: ItemProps) {
  const [local, others] = splitProps(props, ['class', 'variant', 'size'])

  const variant = () => local.variant ?? 'default'
  const size = () => local.size ?? 'default'

  return (
    <ark.div
      {...others}
      data-slot="item"
      data-variant={variant()}
      data-size={size()}
      class={cn(
        itemVariants({ variant: variant(), size: size() }),
        local.class,
      )}
    />
  )
}

const itemMediaVariants = cva(
  'flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          'size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type ItemMediaProps = HTMLArkProps<'div'> &
  VariantProps<typeof itemMediaVariants>

function ItemMedia(props: ItemMediaProps) {
  const [local, others] = splitProps(props, ['class', 'variant'])

  const variant = () => local.variant ?? 'default'

  return (
    <ark.div
      {...others}
      data-slot="item-media"
      data-variant={variant()}
      class={cn(itemMediaVariants({ variant: variant() }), local.class)}
    />
  )
}

function ItemContent(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      {...others}
      data-slot="item-content"
      class={cn(
        'flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none',
        local.class,
      )}
    />
  )
}

function ItemTitle(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      {...others}
      data-slot="item-title"
      class={cn(
        'line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4',
        local.class,
      )}
    />
  )
}

type ItemDescriptionProps = JSX.HTMLElementTags['p']

function ItemDescription(props: ItemDescriptionProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <p
      {...others}
      data-slot="item-description"
      class={cn(
        'line-clamp-2 text-left text-sm leading-normal font-normal text-muted-foreground group-data-[size=xs]/item:text-xs [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        local.class,
      )}
    />
  )
}

function ItemActions(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      {...others}
      data-slot="item-actions"
      class={cn('flex items-center gap-2', local.class)}
    />
  )
}

function ItemHeader(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      {...others}
      data-slot="item-header"
      class={cn(
        'flex basis-full items-center justify-between gap-2',
        local.class,
      )}
    />
  )
}

function ItemFooter(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      {...others}
      data-slot="item-footer"
      class={cn(
        'flex basis-full items-center justify-between gap-2',
        local.class,
      )}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}

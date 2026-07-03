import { cva } from 'class-variance-authority'
import { ark } from '@ark-ui/solid/factory'
import { splitProps } from 'solid-js'
import type { VariantProps } from 'class-variance-authority'
import type { HTMLArkProps } from '@ark-ui/solid/factory'
import type { JSX } from 'solid-js'
import type { SeparatorProps } from '@/components/ui/separator'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Radix UI + React component.
// This wraps the Ark UI + SolidJS primitive and preserves shadcn's Tailwind-based
// design-system API, variants, and styling.
// https://ui.shadcn.com/

const buttonGroupVariants = cva(
  "group/button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
)

type ButtonGroupProps = JSX.HTMLElementTags['div'] &
  VariantProps<typeof buttonGroupVariants>

function ButtonGroup(props: ButtonGroupProps) {
  const [local, others] = splitProps(props, ['class', 'orientation'])

  const orientation = () => local.orientation ?? 'horizontal'

  return (
    <div
      {...others}
      role="group"
      data-slot="button-group"
      data-orientation={orientation()}
      class={cn(
        buttonGroupVariants({ orientation: orientation() }),
        local.class,
      )}
    />
  )
}

function ButtonGroupText(props: HTMLArkProps<'div'>) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <ark.div
      {...others}
      class={cn(
        "flex items-center gap-2 rounded-lg border bg-muted px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
    />
  )
}

function ButtonGroupSeparator(props: SeparatorProps) {
  const [local, others] = splitProps(props, ['class', 'orientation'])

  const orientation = () => local.orientation ?? 'vertical'

  return (
    <Separator
      {...others}
      data-slot="button-group-separator"
      orientation={orientation()}
      class={cn(
        'relative self-stretch bg-input data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto',
        local.class,
      )}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}

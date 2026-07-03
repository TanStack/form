import { ark } from '@ark-ui/solid/factory'
import { splitProps } from 'solid-js'
import type { HTMLArkProps } from '@ark-ui/solid/factory'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Radix UI + React component.
// This wraps the Ark UI + SolidJS primitive and preserves shadcn's Tailwind-based
// design-system API, variants, and styling.
// https://ui.shadcn.com/

type SeparatorOrientation = 'horizontal' | 'vertical'

type SeparatorProps = HTMLArkProps<'div'> & {
  orientation?: SeparatorOrientation
  decorative?: boolean
  'data-slot'?: string
}

function Separator(props: SeparatorProps) {
  const [local, others] = splitProps(props, [
    'class',
    'orientation',
    'decorative',
    'data-slot',
  ])

  const orientation = () => local.orientation ?? 'horizontal'
  const decorative = () => local.decorative ?? true

  return (
    <ark.div
      {...others}
      role={decorative() ? 'none' : 'separator'}
      aria-orientation={decorative() ? undefined : orientation()}
      data-slot={local['data-slot'] ?? 'separator'}
      data-orientation={orientation()}
      class={cn(
        'shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch',
        local.class,
      )}
    />
  )
}

export { Separator, type SeparatorProps }

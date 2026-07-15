import { ark } from '@ark-ui/solid/factory'
import { splitProps } from 'solid-js'
import type { HTMLArkProps } from '@ark-ui/solid/factory'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Radix UI + React component.
// This wraps an Ark UI factory element and preserves shadcn's Tailwind-based
// design-system API and styling.
// https://ui.shadcn.com/

type LabelProps = HTMLArkProps<'label'> & {
  'data-slot'?: string
}

/**
 * A styled label for native form controls.
 *
 * @example
 * ```tsx
 * <Label for="email">Email</Label>
 * ```
 */
function Label(props: LabelProps) {
  const [local, others] = splitProps(props, ['class', 'data-slot'])

  return (
    <ark.label
      {...others}
      data-slot={local['data-slot'] ?? 'label'}
      class={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-[disabled]:cursor-not-allowed peer-data-[disabled]:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50',
        local.class,
      )}
    />
  )
}

export { Label, type LabelProps }

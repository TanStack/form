import { ark } from '@ark-ui/solid'
import { splitProps } from 'solid-js'
import type { HTMLArkProps } from '@ark-ui/solid'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + React component.
// These are styled DOM primitives; stateful behavior can be layered on by
// wrapping them with Ark UI machines via asChild.
// https://ui.shadcn.com/

/**
 * A styled textarea field for collecting longer free-form text.
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Message" />
 * ```
 */
function Textarea(props: HTMLArkProps<'textarea'>) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <ark.textarea
      data-slot="textarea"
      class={cn(
        'flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
        local.class,
      )}
      {...others}
    />
  )
}

export { Textarea }

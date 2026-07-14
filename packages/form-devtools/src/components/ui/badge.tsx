import { cva } from 'class-variance-authority'
import { ark } from '@ark-ui/solid/factory'
import { splitProps } from 'solid-js'
import type { VariantProps } from 'class-variance-authority'
import type { HTMLArkProps } from '@ark-ui/solid/factory'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Radix UI + React component.
// This wraps an Ark UI factory element and preserves shadcn's Tailwind-based
// design-system API, variants, and styling.
// https://ui.shadcn.com/

const badgeVariants = cva(
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        secondary:
          'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        destructive:
          'bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20',
        outline:
          'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        ghost:
          'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type BadgeProps = HTMLArkProps<'span'> & VariantProps<typeof badgeVariants>

/**
 * A compact label for statuses, categories, and counts.
 *
 * Use Ark's render-function `asChild` prop when the badge should render as a
 * link or another element.
 *
 * Add `data-icon="inline-start"` or `data-icon="inline-end"` to child icons
 * and spinners so the badge adjusts its padding for their position. Customize
 * the badge's colors with Tailwind utilities passed through `class`.
 *
 * @example
 * ```tsx
 * <Badge variant="secondary">
 *   <CheckIcon data-icon="inline-start" />
 *   Verified
 * </Badge>
 *
 * <Badge
 *   class="bg-green-50 text-green-700 dark:bg-green-800 dark:text-green-100"
 * >
 *   Available
 * </Badge>
 * ```
 */
function Badge(props: BadgeProps) {
  const [local, others] = splitProps(props, ['class', 'variant'])

  const variant = () => local.variant ?? 'default'

  return (
    <ark.span
      {...others}
      data-slot="badge"
      data-variant={variant()}
      class={cn(badgeVariants({ variant: variant() }), local.class)}
    />
  )
}

export { Badge, badgeVariants, type BadgeProps }

import { cva } from 'class-variance-authority'
import { Toggle as TogglePrimitive } from '@ark-ui/solid'
import { splitProps } from 'solid-js'
import type { VariantProps } from 'class-variance-authority'
import type { ToggleRootProps } from '@ark-ui/solid'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Radix UI + React component.
// This wraps the Ark UI + SolidJS primitive and preserves shadcn's Tailwind-based
// design-system API, variants, and styling.
// https://ui.shadcn.com/

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-muted',
      },
      size: {
        default:
          'h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ToggleProps = ToggleRootProps & VariantProps<typeof toggleVariants>

/**
 * A pressable toggle button for showing selected or active state.
 *
 * @example
 * ```tsx
 * <ToggleRoot>Bookmark</ToggleRoot>
 * ```
 */
function ToggleRoot(props: ToggleProps) {
  const [local, toggleProps] = splitProps(props, ['class', 'variant', 'size'])

  const variant = () => local.variant ?? 'default'
  const size = () => local.size ?? 'default'

  return (
    <TogglePrimitive.Root
      {...toggleProps}
      data-slot="toggle"
      data-variant={variant()}
      data-size={size()}
      class={cn(
        toggleVariants({
          variant: variant(),
          size: size(),
        }),
        local.class,
      )}
    />
  )
}

export { ToggleRoot }

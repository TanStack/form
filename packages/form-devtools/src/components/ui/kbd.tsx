import { splitProps } from 'solid-js'
import type { JSX } from 'solid-js'
import { cn } from '@/utils'

type KbdProps = JSX.HTMLElementTags['kbd']

/**
 * A single keyboard key styled for shortcuts and command hints.
 *
 * @example
 * ```tsx
 * <KbdGroup>
 *   <Kbd>Ctrl</Kbd>
 *   <Kbd>K</Kbd>
 * </KbdGroup>
 * ```
 */
function Kbd(props: KbdProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <kbd
      data-slot="kbd"
      class={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
        local.class,
      )}
      {...others}
    />
  )
}

/**
 * A compact group for rendering related keyboard keys as one shortcut.
 *
 * @example
 * ```tsx
 * <KbdGroup>
 *   <Kbd>Ctrl</Kbd>
 *   <Kbd>K</Kbd>
 * </KbdGroup>
 * ```
 */
function KbdGroup(props: KbdProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <kbd
      data-slot="kbd-group"
      class={cn('inline-flex items-center gap-1', local.class)}
      {...others}
    />
  )
}

export { Kbd, KbdGroup }

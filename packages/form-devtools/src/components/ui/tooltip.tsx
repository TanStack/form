import { Tooltip as TooltipPrimitive } from '@ark-ui/solid'
import { createContext, splitProps, useContext } from 'solid-js'
import type { Accessor, JSX } from 'solid-js'
import { Portal } from '@/components/ui/portal'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Radix UI + React component.
// This wraps the Ark UI + SolidJS primitive and preserves shadcn's Tailwind-based
// design-system API, variants, and styling.
// https://ui.shadcn.com/

type TooltipProviderProps = {
  children?: JSX.Element
} & Pick<
  TooltipPrimitive.RootProps,
  'interactive' | 'openDelay' | 'positioning'
>

type TooltipPositioning = NonNullable<TooltipPrimitive.RootProps['positioning']>

type TooltipProviderContextValue = {
  interactive: Accessor<TooltipPrimitive.RootProps['interactive']>
  openDelay: Accessor<TooltipPrimitive.RootProps['openDelay']>
  positioning: Accessor<TooltipPrimitive.RootProps['positioning']>
}

const TooltipProviderContext = createContext<TooltipProviderContextValue>()

/**
 * Provides default timing, positioning, and interaction behavior for nested
 * tooltips.
 *
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger>Hover me</TooltipTrigger>
 *     <TooltipContent>Helpful context</TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 */
function TooltipProvider(props: TooltipProviderProps) {
  const [local] = splitProps(props, [
    'children',
    'interactive',
    'openDelay',
    'positioning',
  ])

  const value: TooltipProviderContextValue = {
    interactive: () => local.interactive,
    openDelay: () => local.openDelay,
    positioning: () => local.positioning,
  }

  return (
    <TooltipProviderContext.Provider value={value}>
      {local.children}
    </TooltipProviderContext.Provider>
  )
}

/**
 * The root component that coordinates tooltip trigger and content state.
 *
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger>Hover me</TooltipTrigger>
 *     <TooltipContent>Helpful context</TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 */
function Tooltip(props: TooltipPrimitive.RootProps) {
  const [local, others] = splitProps(props, [
    'children',
    'interactive',
    'openDelay',
    'positioning',
  ])
  const provider = useContext(TooltipProviderContext)

  const positioning = (): TooltipPositioning =>
    Object.assign({ gutter: 0 }, provider?.positioning(), local.positioning)

  return (
    <TooltipPrimitive.Root
      openDelay={local.openDelay ?? provider?.openDelay() ?? 0}
      interactive={local.interactive ?? provider?.interactive() ?? true}
      positioning={positioning()}
      {...others}
    >
      {local.children}
    </TooltipPrimitive.Root>
  )
}

/**
 * The element that opens its associated TooltipContent on hover or focus.
 *
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger>Hover me</TooltipTrigger>
 *     <TooltipContent>Helpful context</TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 */
function TooltipTrigger(props: TooltipPrimitive.TriggerProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      class={local.class}
      {...others}
    />
  )
}

/**
 * The floating tooltip surface shown for the associated TooltipTrigger.
 *
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger>Hover me</TooltipTrigger>
 *     <TooltipContent>Helpful context</TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 */
function TooltipContent(props: TooltipPrimitive.ContentProps) {
  const [local, others] = splitProps(props, ['children', 'class'])

  return (
    <Portal>
      <TooltipPrimitive.Positioner data-slot="tooltip-positioner">
        <TooltipPrimitive.Content
          data-slot="tooltip-content"
          class={cn(
            'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            local.class,
          )}
          {...others}
        >
          {local.children}
          <TooltipPrimitive.Arrow
            data-slot="tooltip-arrow"
            class="z-50 [--arrow-background:var(--foreground)] [--arrow-size:--spacing(2.5)]"
          >
            <TooltipPrimitive.ArrowTip
              data-slot="tooltip-arrow-tip"
              class="rounded-xs"
            />
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Positioner>
    </Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }

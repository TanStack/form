import { ScrollArea as ScrollAreaPrimitive } from '@ark-ui/solid'
import { splitProps } from 'solid-js'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Radix UI + React component.
// This wraps the Ark UI + SolidJS primitive and preserves shadcn's Tailwind-based
// design-system API, variants, and styling.
// https://ui.shadcn.com/

function ScrollArea(props: ScrollAreaPrimitive.RootProps) {
  const [local, others] = splitProps(props, ['class', 'children'])

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      class={cn('relative', local.class)}
      {...others}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        class="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
      >
        <ScrollAreaPrimitive.Content data-slot="scroll-area-content">
          {local.children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar(props: ScrollAreaPrimitive.ScrollbarProps) {
  const [local, others] = splitProps(props, ['class', 'orientation'])

  const orientation = () => local.orientation ?? 'vertical'

  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation()}
      orientation={orientation()}
      class={cn(
        'flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent',
        local.class,
      )}
      {...others}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        class="relative flex-1 rounded-full bg-border"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }

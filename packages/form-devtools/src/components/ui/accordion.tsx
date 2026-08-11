import { Accordion as AccordionPrimitive } from '@ark-ui/solid'
import ChevronDownIcon from 'lucide-solid/icons/chevron-down'
import ChevronUpIcon from 'lucide-solid/icons/chevron-up'
import { splitProps } from 'solid-js'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + Radix UI + React component.
// This wraps an Ark UI factory element and preserves shadcn's Tailwind-based
// design-system API, variants, and styling.
// https://ui.shadcn.com/

/**
 * The root container that coordinates accordion item expansion.
 *
 * @example
 * ```tsx
 * <Accordion defaultValue={["details"]} collapsible>
 *   <AccordionItem value="details">
 *     <AccordionTrigger>Details</AccordionTrigger>
 *     <AccordionContent>Accordion content</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
function Accordion(props: AccordionPrimitive.RootProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      class={cn('flex w-full flex-col', local.class)}
      {...others}
    />
  )
}

/** An individual accordion section with a trigger and collapsible content. */
function AccordionItem(props: AccordionPrimitive.ItemProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      class={cn('not-last:border-b', local.class)}
      {...others}
    />
  )
}

/** The button that expands or collapses its containing AccordionItem. */
function AccordionTrigger(props: AccordionPrimitive.ItemTriggerProps) {
  const [local, others] = splitProps(props, ['class', 'children'])

  return (
    <AccordionPrimitive.ItemTrigger
      data-slot="accordion-trigger"
      class={cn(
        'group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground w-full',
        local.class,
      )}
      {...others}
    >
      {local.children}
      <ChevronDownIcon
        data-slot="accordion-trigger-icon"
        class="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
      />
      <ChevronUpIcon
        data-slot="accordion-trigger-icon"
        class="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
      />
    </AccordionPrimitive.ItemTrigger>
  )
}

/** The panel revealed when its containing AccordionItem is expanded. */
function AccordionContent(props: AccordionPrimitive.ItemContentProps) {
  const [local, others] = splitProps(props, ['class', 'children'])

  return (
    <AccordionPrimitive.ItemContent
      data-slot="accordion-content"
      class="overflow-hidden text-sm [--radix-accordion-content-height:var(--height)] data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...others}
    >
      <div
        class={cn(
          'pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4',
          local.class,
        )}
      >
        {local.children}
      </div>
    </AccordionPrimitive.ItemContent>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }

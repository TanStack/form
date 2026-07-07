import { cva } from 'class-variance-authority'
import { ark } from '@ark-ui/solid/factory'
import { splitProps } from 'solid-js'
import type { JSX } from 'solid-js'
import type { VariantProps } from 'class-variance-authority'
import type { HTMLArkProps } from '@ark-ui/solid/factory'
import type { ButtonProps } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utils'

// Ported from the original shadcn/ui + React component.
// These are styled DOM primitives; stateful behavior can be layered on by
// wrapping them with Ark UI machines via asChild.
// https://ui.shadcn.com/

type DataSlotProp = {
  'data-slot'?: string
}

type InputGroupProps = HTMLArkProps<'div'> & DataSlotProp

/**
 * A styled container for visually grouping an input or textarea with addons.
 *
 * @example
 * ```tsx
 * <InputGroup>
 *   <InputGroupAddon>$</InputGroupAddon>
 *   <InputGroupInput placeholder="Amount" />
 * </InputGroup>
 * ```
 */
function InputGroup(props: InputGroupProps) {
  const [local, others] = splitProps(props, ['class', 'role', 'data-slot'])

  return (
    <ark.div
      {...others}
      data-slot={local['data-slot'] ?? 'input-group'}
      role={local.role ?? 'group'}
      class={cn(
        'group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 data-disabled:bg-input/50 data-disabled:opacity-50 data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][data-invalid]]:border-destructive has-[[data-slot][data-invalid]]:ring-3 has-[[data-slot][data-invalid]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:data-disabled:bg-input/80 dark:data-invalid:ring-destructive/40 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 dark:has-[[data-slot][data-invalid]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5',
        local.class,
      )}
    />
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 group-data-disabled/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        'inline-start':
          'order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]',
        'inline-end':
          'order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]',
        'block-start':
          'order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2',
        'block-end':
          'order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  },
)

type InputGroupAddonProps = HTMLArkProps<'div'> &
  DataSlotProp &
  VariantProps<typeof inputGroupAddonVariants>

/**
 * Static addon content positioned before, after, above, or below the control.
 *
 * @example
 * ```tsx
 * <InputGroupAddon align="inline-start">$</InputGroupAddon>
 * ```
 */
function InputGroupAddon(props: InputGroupAddonProps) {
  const [local, others] = splitProps(props, [
    'align',
    'class',
    'role',
    'data-slot',
  ])

  const align = () => local.align ?? 'inline-start'

  return (
    <ark.div
      {...others}
      role={local.role ?? 'group'}
      data-slot={local['data-slot'] ?? 'input-group-addon'}
      data-align={align()}
      class={cn(inputGroupAddonVariants({ align: align() }), local.class)}
    />
  )
}

const inputGroupButtonVariants = cva(
  'flex items-center gap-2 text-sm shadow-none',
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: '',
        'icon-xs':
          'size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0',
        'icon-sm': 'size-8 p-0 has-[>svg]:p-0',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  },
)

type InputGroupButtonProps = Omit<ButtonProps, 'size'> &
  VariantProps<typeof inputGroupButtonVariants>

/**
 * A button styled to sit inside an InputGroup addon.
 *
 * @example
 * ```tsx
 * <InputGroupButton>Apply</InputGroupButton>
 * ```
 */
function InputGroupButton(props: InputGroupButtonProps) {
  const [local, buttonProps] = splitProps(props, [
    'class',
    'type',
    'variant',
    'size',
  ])

  const size = () => local.size ?? 'xs'

  return (
    <Button
      {...buttonProps}
      type={local.type ?? 'button'}
      data-size={size()}
      variant={local.variant ?? 'ghost'}
      class={cn(inputGroupButtonVariants({ size: size() }), local.class)}
    />
  )
}

type InputGroupTextProps = HTMLArkProps<'span'>

/**
 * Text or icon content styled for use inside InputGroupAddon.
 *
 * @example
 * ```tsx
 * <InputGroupText>USD</InputGroupText>
 * ```
 */
function InputGroupText(props: InputGroupTextProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <ark.span
      {...others}
      class={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
    />
  )
}

type InputGroupInputProps = JSX.HTMLElementTags['input'] & DataSlotProp

/**
 * An Input styled to visually merge with an InputGroup.
 *
 * @example
 * ```tsx
 * <InputGroupInput placeholder="Email" />
 * ```
 */
function InputGroupInput(props: InputGroupInputProps) {
  const [local, others] = splitProps(props, ['class', 'data-slot'])

  return (
    <Input
      {...others}
      data-slot={local['data-slot'] ?? 'input-group-control'}
      class={cn(
        'flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 data-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent',
        local.class,
      )}
    />
  )
}

type InputGroupTextareaProps = JSX.HTMLElementTags['textarea'] & DataSlotProp

/**
 * A Textarea styled to visually merge with an InputGroup.
 *
 * @example
 * ```tsx
 * <InputGroupTextarea placeholder="Message" />
 * ```
 */
function InputGroupTextarea(props: InputGroupTextareaProps) {
  const [local, others] = splitProps(props, ['class', 'data-slot'])

  return (
    <Textarea
      {...others}
      data-slot={local['data-slot'] ?? 'input-group-control'}
      class={cn(
        'flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 data-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent',
        local.class,
      )}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
  type InputGroupProps,
  type InputGroupAddonProps,
  type InputGroupButtonProps,
  type InputGroupTextProps,
  type InputGroupInputProps,
  type InputGroupTextareaProps,
}

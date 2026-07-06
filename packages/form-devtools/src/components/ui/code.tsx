import { splitProps } from 'solid-js'
import type { JSX } from 'solid-js'
import { cn } from '@/utils'

type CodeProps = JSX.HTMLElementTags['code']

/**
 * Inline code text styled for identifiers, snippets, and short technical
 * values.
 *
 * @example
 * ```tsx
 * <Code>form.handleSubmit()</Code>
 * ```
 */
function Code(props: CodeProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <code
      data-slot="code"
      class={cn(
        "inline-flex w-fit items-center rounded-sm bg-muted px-1 py-0.75 font-mono text-xs font-medium text-muted-foreground in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
        local.class,
      )}
      {...others}
    />
  )
}

export { Code }

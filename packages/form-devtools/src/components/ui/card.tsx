import { cn } from '@/utils'
import { splitProps, type JSX } from 'solid-js'

// Ported from the original shadcn/ui + Radix UI + React component.
// This wraps the Ark UI + SolidJS primitive and preserves shadcn's Tailwind-based
// design-system API, variants, and styling.
// https://ui.shadcn.com/

type DivProps = JSX.HTMLElementTags['div']

type CardProps = JSX.HTMLElementTags['div'] & { size?: 'default' | 'sm' }

/**
 * A flexible container for grouped content, metadata, and actions.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Workspace</CardTitle>
 *     <CardDescription>Project health and recent activity.</CardDescription>
 *     <CardAction>Active</CardAction>
 *   </CardHeader>
 *   <CardContent>All systems are running normally.</CardContent>
 *   <CardFooter>Updated just now</CardFooter>
 * </Card>
 * ```
 */
function Card(props: CardProps) {
  const [local, others] = splitProps(props, ['class', 'size'])

  const size = () => local.size ?? 'default'

  return (
    <div
      data-slot="card"
      data-size={size()}
      class={cn(
        'group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
        local.class,
      )}
      {...others}
    />
  )
}

/**
 * The top section of a Card, usually containing title, description, and action
 * content.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Workspace</CardTitle>
 *     <CardDescription>Project health and recent activity.</CardDescription>
 *     <CardAction>Active</CardAction>
 *   </CardHeader>
 *   <CardContent>All systems are running normally.</CardContent>
 *   <CardFooter>Updated just now</CardFooter>
 * </Card>
 * ```
 */
function CardHeader(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      data-slot="card-header"
      class={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
        local.class,
      )}
      {...others}
    />
  )
}

/**
 * The primary heading inside a CardHeader.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Workspace</CardTitle>
 *     <CardDescription>Project health and recent activity.</CardDescription>
 *     <CardAction>Active</CardAction>
 *   </CardHeader>
 *   <CardContent>All systems are running normally.</CardContent>
 *   <CardFooter>Updated just now</CardFooter>
 * </Card>
 * ```
 */
function CardTitle(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      data-slot="card-title"
      class={cn(
        'font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm',
        local.class,
      )}
      {...others}
    />
  )
}

/**
 * Supporting text for the CardTitle.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Workspace</CardTitle>
 *     <CardDescription>Project health and recent activity.</CardDescription>
 *     <CardAction>Active</CardAction>
 *   </CardHeader>
 *   <CardContent>All systems are running normally.</CardContent>
 *   <CardFooter>Updated just now</CardFooter>
 * </Card>
 * ```
 */
function CardDescription(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      data-slot="card-description"
      class={cn('text-sm text-muted-foreground', local.class)}
      {...others}
    />
  )
}

/**
 * An action or status area aligned to the end of a CardHeader.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Workspace</CardTitle>
 *     <CardDescription>Project health and recent activity.</CardDescription>
 *     <CardAction>Active</CardAction>
 *   </CardHeader>
 *   <CardContent>All systems are running normally.</CardContent>
 *   <CardFooter>Updated just now</CardFooter>
 * </Card>
 * ```
 */
function CardAction(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      data-slot="card-action"
      class={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        local.class,
      )}
      {...others}
    />
  )
}

/**
 * The main body section of a Card.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Workspace</CardTitle>
 *     <CardDescription>Project health and recent activity.</CardDescription>
 *     <CardAction>Active</CardAction>
 *   </CardHeader>
 *   <CardContent>All systems are running normally.</CardContent>
 *   <CardFooter>Updated just now</CardFooter>
 * </Card>
 * ```
 */
function CardContent(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      data-slot="card-content"
      class={cn('px-(--card-spacing)', local.class)}
      {...others}
    />
  )
}

/**
 * The bottom section of a Card, commonly used for summary text or actions.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Workspace</CardTitle>
 *     <CardDescription>Project health and recent activity.</CardDescription>
 *     <CardAction>Active</CardAction>
 *   </CardHeader>
 *   <CardContent>All systems are running normally.</CardContent>
 *   <CardFooter>Updated just now</CardFooter>
 * </Card>
 * ```
 */
function CardFooter(props: DivProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      data-slot="card-footer"
      class={cn(
        'flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)',
        local.class,
      )}
      {...others}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

import { cn } from '@/utils'
import { splitProps, type JSX } from 'solid-js'

type SkeletonProps = JSX.HTMLElementTags['div']

/**
 * A placeholder block that indicates loading content.
 *
 * @example
 * ```tsx
 * <Skeleton class="h-4 w-40" />
 * ```
 */
function Skeleton(props: SkeletonProps) {
  const [local, others] = splitProps(props, ['class'])

  return (
    <div
      data-slot="skeleton"
      class={cn('animate-pulse rounded-md bg-muted', local.class)}
      {...others}
    />
  )
}

export { Skeleton }

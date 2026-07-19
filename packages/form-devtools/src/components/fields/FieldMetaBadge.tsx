import { cva } from 'class-variance-authority'
import { splitProps } from 'solid-js'
import { Badge } from '../ui/badge'
import type { VariantProps } from 'class-variance-authority'
import type { HTMLArkProps } from '@ark-ui/solid'
import { cn } from '@/utils'

const fieldMetaBadgeVariants = cva('', {
  variants: {
    tone: {
      neutral: 'bg-transparent text-foreground border-border',
      change: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      success:
        'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
      information:
        'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
      interaction: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
      failure: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
      caution:
        'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
})

type BadgeVariantsProps = VariantProps<typeof fieldMetaBadgeVariants>

export type FieldMetaBadgeKind =
  | 'dirty'
  | 'pristine'
  | 'valid'
  | 'invalid'
  | 'invalidHidden'
  | 'validating'
  | 'touched'
  | 'untouched'
  | 'blurred'
  | 'defaultValue'
  | 'nonDefaultValue'
  | 'unmounted'

const fieldMetaBadgeDefinitions: Record<
  FieldMetaBadgeKind,
  { label: string; tone: NonNullable<BadgeVariantsProps['tone']> }
> = {
  dirty: { label: 'Dirty', tone: 'change' },
  pristine: { label: 'Pristine', tone: 'neutral' },
  valid: { label: 'Valid', tone: 'success' },
  invalid: { label: 'Invalid', tone: 'failure' },
  invalidHidden: { label: 'Invalid (hidden)', tone: 'caution' },
  validating: { label: 'Validating', tone: 'information' },
  touched: { label: 'Touched', tone: 'interaction' },
  untouched: { label: 'Untouched', tone: 'neutral' },
  blurred: { label: 'Blurred', tone: 'interaction' },
  defaultValue: { label: 'Default value', tone: 'neutral' },
  nonDefaultValue: { label: 'Non-default value', tone: 'change' },
  unmounted: { label: 'Not rendered', tone: 'information' },
}

type FieldMetaBadgeProps = { kind: FieldMetaBadgeKind } & HTMLArkProps<'span'>

export function FieldMetaBadge(props: FieldMetaBadgeProps) {
  const [local, others] = splitProps(props, ['kind', 'class', 'children'])

  const definition = () => fieldMetaBadgeDefinitions[local.kind]

  return (
    <Badge
      class={cn(
        fieldMetaBadgeVariants({ tone: definition().tone }),
        local.class,
      )}
      {...others}
    >
      {local.children ?? definition().label}
    </Badge>
  )
}

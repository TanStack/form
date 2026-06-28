import { useFieldMetaBadgeStyles } from '../styles/field-meta-badge.styles'

type FieldMetaBadgeTone =
  | 'pristine'
  | 'success'
  | 'warning'
  | 'touched'
  | 'blurred'
  | 'danger'
type FieldMetaBadgeSize = 'sm' | 'md'

interface BadgeConfig {
  label: string
  tone: FieldMetaBadgeTone
}

export type FieldMetaBadgeVariant =
  | 'pristine'
  | 'dirty'
  | 'isDefaultValue'
  | 'isNotDefaultValue'
  | 'touched'
  | 'blurred'
  | 'valid'
  | 'isInvalid'
  | 'isInvalidHidden'

const variantMap = {
  pristine: {
    label: 'Pristine',
    tone: 'pristine',
  },
  dirty: {
    label: 'Dirty',
    tone: 'warning',
  },
  isDefaultValue: {
    label: 'Default value',
    tone: 'pristine',
  },
  isNotDefaultValue: {
    label: 'Changed value',
    tone: 'warning',
  },
  touched: {
    label: 'Touched',
    tone: 'touched',
  },
  blurred: {
    label: 'Blurred',
    tone: 'blurred',
  },
  valid: {
    label: 'Valid',
    tone: 'success',
  },
  isInvalid: {
    label: 'Invalid',
    tone: 'danger',
  },
  isInvalidHidden: {
    label: 'Invalid (hidden)',
    tone: 'warning',
  },
} satisfies Record<FieldMetaBadgeVariant, BadgeConfig> as Record<
  FieldMetaBadgeVariant,
  BadgeConfig
>

interface FieldMetaBadgeProps {
  variant: FieldMetaBadgeVariant
  size?: FieldMetaBadgeSize
}

export function FieldMetaBadge(props: FieldMetaBadgeProps) {
  const styles = useFieldMetaBadgeStyles()
  const badge = () => variantMap[props.variant]

  return (
    <span
      class={styles().badge}
      data-size={props.size ?? 'sm'}
      data-tone={badge().tone}
    >
      {badge().label}
    </span>
  )
}

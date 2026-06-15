import type { AnyFieldApi } from '@tanstack/react-form'

interface FieldInfoProps {
  field: AnyFieldApi
}

export function FieldError({ field }: FieldInfoProps) {
  return (
    <small role={field.meta.isInvalid ? 'alert' : undefined} aria-live="polite">
      {field.errors.map((e) => e.message).join('\n')}
    </small>
  )
}

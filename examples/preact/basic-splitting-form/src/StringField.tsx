import { FieldError } from './FieldError'
import type { FieldWithValue } from '@tanstack/preact-form'

interface StringFieldProps {
  field: FieldWithValue<string>
}

export function StringField(props: StringFieldProps) {
  const { field } = props

  return (
    <label className={field.meta.isValidating ? 'validating' : ''}>
      <span>First Name</span>

      <input
        name={field.name}
        value={field.value}
        onBlur={field.handleBlur}
        onInput={(e) => field.handleChange(e.currentTarget.value)}
        aria-invalid={field.meta.isInvalid}
      />
      <FieldError field={field} />
    </label>
  )
}

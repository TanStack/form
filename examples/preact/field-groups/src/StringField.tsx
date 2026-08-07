import { FieldError } from './FieldError'
import type { FieldWithValue } from '@tanstack/preact-form'

interface StringFieldProps {
  field: FieldWithValue<string>
  label: string
}

export function StringField(props: StringFieldProps) {
  const { field, label } = props

  return (
    <label
      className={field.meta.isValidating ? 'validating' : ''}
      style={{
        display: 'block',
      }}
    >
      <span>{label}</span>

      <input
        name={field.name}
        value={field.value}
        onBlur={field.handleBlur}
        onInput={(e) => field.handleChange(e.currentTarget.value)}
        aria-invalid={field.meta.isInvalid}
      />
      <br />
      <FieldError field={field} />
    </label>
  )
}

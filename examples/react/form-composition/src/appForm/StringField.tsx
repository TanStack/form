import { fieldComponent } from './createContexts'
import type { FieldWithValue } from '@tanstack/react-form'

interface StringFieldProps {
  field: FieldWithValue<string>
}

function StringField(props: StringFieldProps) {
  const { field } = props

  return (
    <label className={field.meta.isValidating ? 'validating' : ''}>
      <span>First Name</span>

      <input
        name={field.name}
        value={field.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={field.meta.isInvalid}
      />
    </label>
  )
}

export const AppFormStringField = fieldComponent.strict(StringField, 'field')

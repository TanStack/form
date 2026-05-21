import { fieldComponent } from './createContexts'
import type { FieldWithValue } from '@tanstack/react-form'

interface NumberFieldProps {
  field: FieldWithValue<number>
}

function NumberField(props: NumberFieldProps) {
  const { field } = props

  return (
    <label className={field.meta.isValidating ? 'validating' : ''}>
      <span>First Name</span>

      <input
        name={field.name}
        value={field.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
        aria-invalid={field.meta.isInvalid}
      />
    </label>
  )
}

export const AppFormNumberField = fieldComponent.strict(NumberField, 'field')

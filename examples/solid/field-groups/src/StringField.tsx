import { FieldError } from './FieldError'
import type { Accessor } from 'solid-js'
import type { FieldWithValue } from '@tanstack/solid-form'

interface StringFieldProps {
  field: Accessor<FieldWithValue<string>>
  label: string
}

export function StringField(props: StringFieldProps) {
  return (
    <label
      classList={{ validating: props.field().meta.isValidating }}
      style={{ display: 'block' }}
    >
      <span>{props.label}</span>
      <input
        name={props.field().name}
        value={props.field().value}
        onBlur={props.field().handleBlur}
        onInput={(event) =>
          props.field().handleChange(event.currentTarget.value)
        }
        aria-invalid={props.field().meta.isInvalid}
      />
      <br />
      <FieldError field={props.field} />
    </label>
  )
}

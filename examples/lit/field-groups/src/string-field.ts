import { html } from 'lit'
import { fieldError } from './field-error'
import type { FieldWithValue } from '@tanstack/lit-form'

export function stringField(
  field: FieldWithValue<string>,
  label: string,
  type: 'text' | 'date' = 'text',
) {
  return html`
    <label>
      <span>${label}</span>
      <input
        name=${field.name}
        type=${type}
        .value=${field.value}
        @blur=${() => field.handleBlur()}
        @input=${(event: InputEvent) =>
          field.handleChange((event.currentTarget as HTMLInputElement).value)}
        aria-invalid=${field.meta.isInvalid ? 'true' : 'false'}
      />
      ${fieldError(field)}
    </label>
  `
}

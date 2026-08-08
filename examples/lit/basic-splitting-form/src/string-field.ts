import { html } from 'lit'
import { fieldError } from './field-error'
import type { FieldWithValue } from '@tanstack/lit-form'

export function stringField(field: FieldWithValue<string>, label: string) {
  return html`
    <label class=${field.meta.isValidating ? 'validating' : ''}>
      <span>${label}</span>
      <input
        name=${field.name}
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

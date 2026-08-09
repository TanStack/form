import { html } from 'lit'
import type { FieldWithValue } from '@tanstack/lit-form'

export function textField(field: FieldWithValue<string>, label: string) {
  return html`
    <label>
      <span>${label}</span>
      <input
        name=${field.name}
        .value=${field.value}
        @input=${(event: InputEvent) =>
          field.handleChange((event.currentTarget as HTMLInputElement).value)}
        @blur=${() => field.handleBlur()}
        aria-invalid=${field.meta.isInvalid ? 'true' : 'false'}
      />
      ${field.errors.map(
        (error) => html`<small role="alert">${error.message}</small>`,
      )}
    </label>
  `
}

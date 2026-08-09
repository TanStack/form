import { html } from 'lit'
import type { FieldWithValue } from '@tanstack/lit-form'

export function textField(field: FieldWithValue<string>, label: string) {
  return html`
    <div>
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
      </label>
      ${field.errors.map(
        (error) => html`<div class="error" role="alert">${error.message}</div>`,
      )}
    </div>
  `
}

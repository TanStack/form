import { html, nothing } from 'lit'
import type { AnyFieldApi } from '@tanstack/lit-form'

export function fieldError(field: AnyFieldApi) {
  return html`<small
    role=${field.meta.isInvalid ? 'alert' : nothing}
    aria-live="polite"
  >
    ${field.errors.map((error) => error.message).join(', ')}
  </small>`
}

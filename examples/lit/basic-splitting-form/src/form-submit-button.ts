import { html } from 'lit'
import type { AnyLitFormApi } from '@tanstack/lit-form'

export function formSubmitButton(form: AnyLitFormApi) {
  return form.subscribe(
    (state) => [state.canSubmit, state.isSubmitting] as const,
    ([canSubmit, isSubmitting]) => html`
      <button type="submit" ?disabled=${!canSubmit || isSubmitting}>
        ${isSubmitting ? '...' : 'Submit'}
      </button>
    `,
  )
}

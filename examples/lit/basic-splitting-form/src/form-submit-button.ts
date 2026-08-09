import { html } from 'lit'
import type { LitFormType } from '@tanstack/lit-form'
import type { sharedFormOptions } from './shared-form'

export function formSubmitButton(form: LitFormType<typeof sharedFormOptions>) {
  return form.subscribe(
    (state) => [state.canSubmit, state.isSubmitting] as const,
    ([canSubmit, isSubmitting]) => html`
      <button type="submit" ?disabled=${!canSubmit || isSubmitting}>
        ${isSubmitting ? '...' : 'Submit'}
      </button>
    `,
  )
}

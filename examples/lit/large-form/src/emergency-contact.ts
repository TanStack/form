import { html } from 'lit'
import { textField } from './text-field'
import type { LitFormType } from '@tanstack/lit-form'
import type { peopleFormOptions } from './shared-form'

export function emergencyContactFields(
  form: LitFormType<typeof peopleFormOptions>,
) {
  return html`
    <section>
      <h2>Emergency Contact</h2>
      ${form.field({ name: 'emergencyContact.fullName' }, (field) =>
        textField(field, 'Full Name'),
      )}
      ${form.field({ name: 'emergencyContact.phone' }, (field) =>
        textField(field, 'Phone'),
      )}
    </section>
  `
}

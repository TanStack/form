import { html } from 'lit'
import { textField } from './text-field'
import type { LitFormType } from '@tanstack/lit-form'
import type { peopleFormOptions } from './shared-form'

export function addressFields(form: LitFormType<typeof peopleFormOptions>) {
  return html`
    <section>
      <h2>Address</h2>
      ${form.field({ name: 'address.line1' }, (field) =>
        textField(field, 'Address Line 1'),
      )}
      ${form.field({ name: 'address.line2' }, (field) =>
        textField(field, 'Address Line 2'),
      )}
      ${form.field({ name: 'address.city' }, (field) =>
        textField(field, 'City'),
      )}
      ${form.field({ name: 'address.state' }, (field) =>
        textField(field, 'State'),
      )}
      ${form.field({ name: 'address.zip' }, (field) =>
        textField(field, 'ZIP Code'),
      )}
    </section>
  `
}

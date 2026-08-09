import { html } from 'lit'
import { stringField } from './string-field'
import type { LitFormType } from '@tanstack/lit-form'
import type { sharedFormOptions } from './shared-form'

export function formSection(form: LitFormType<typeof sharedFormOptions>) {
  return html`
    ${form.field({ name: 'address.street' }, (field) =>
      stringField(field, 'Street'),
    )}
    ${form.field({ name: 'address.country' }, (field) =>
      stringField(field, 'Country'),
    )}
  `
}

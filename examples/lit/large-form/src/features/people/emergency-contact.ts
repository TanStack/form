import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { TanStackStoreSelector } from '@tanstack/lit-store'
import { getFormType } from '@tanstack/lit-form'
import { peopleFormOpts } from './shared-form.js'
import '../../components/text-field.js'

const formType = getFormType(peopleFormOpts)

@customElement('emergency-contact-fields')
export class EmergencyContactFields extends LitElement {
  @property({ attribute: false })
  form!: typeof formType

  _selector = new TanStackStoreSelector(this, () => this.form?.api.store)

  protected createRenderRoot() {
    return this
  }

  render() {
    return html`
      ${this.form.field(
        { name: 'emergencyContact.fullName' },
        (field) =>
          html`<text-field label="Full Name" .field=${field}></text-field>`,
      )}
      ${this.form.field(
        { name: 'emergencyContact.phone' },
        (field) =>
          html`<text-field label="Phone" .field=${field}></text-field>`,
      )}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'emergency-contact-fields': EmergencyContactFields
  }
}

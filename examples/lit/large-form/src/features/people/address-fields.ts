import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { TanStackStoreSelector } from '@tanstack/lit-store'
import { getFormType } from '@tanstack/lit-form'
import { peopleFormOpts } from './shared-form.js'
import '../../components/text-field.js'

const formType = getFormType(peopleFormOpts)

@customElement('address-fields')
export class AddressFields extends LitElement {
  @property({ attribute: false })
  form!: typeof formType

  _selector = new TanStackStoreSelector(this, () => this.form?.api.store)

  protected createRenderRoot() {
    return this
  }

  render() {
    return html`
      <div>
        <h2>Address</h2>
        ${this.form.field(
          { name: 'address.line1' },
          (field) =>
            html`<text-field
              label="Address Line 1"
              .field=${field}
            ></text-field>`,
        )}
        ${this.form.field(
          { name: 'address.line2' },
          (field) =>
            html`<text-field
              label="Address Line 2"
              .field=${field}
            ></text-field>`,
        )}
        ${this.form.field(
          { name: 'address.city' },
          (field) =>
            html`<text-field label="City" .field=${field}></text-field>`,
        )}
        ${this.form.field(
          { name: 'address.state' },
          (field) =>
            html`<text-field label="State" .field=${field}></text-field>`,
        )}
        ${this.form.field(
          { name: 'address.zip' },
          (field) =>
            html`<text-field label="ZIP Code" .field=${field}></text-field>`,
        )}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'address-fields': AddressFields
  }
}

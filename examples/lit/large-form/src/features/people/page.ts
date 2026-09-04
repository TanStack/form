import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'
import { peopleFormOpts } from './shared-form.js'
import './address-fields.js'
import './emergency-contact.js'
import '../../components/text-field.js'

@customElement('people-page')
export class PeoplePage extends LitElement {
  form = new TanStackFormController(this, {
    ...peopleFormOpts,
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  })

  protected createRenderRoot() {
    return this
  }

  render() {
    return html`
      <form
        @submit=${(e: Event) => {
          e.preventDefault()
          e.stopPropagation()
          this.form.api.handleSubmit()
        }}
      >
        <h1>Personal Information</h1>
        ${this.form.field(
          { name: 'fullName' },
          (field) =>
            html`<text-field label="Full Name" .field=${field}></text-field>`,
        )}
        ${this.form.field(
          { name: 'email' },
          (field) =>
            html`<text-field label="Email" .field=${field}></text-field>`,
        )}
        ${this.form.field(
          { name: 'phone' },
          (field) =>
            html`<text-field label="Phone" .field=${field}></text-field>`,
        )}

        <address-fields .form=${this.form}></address-fields>

        <h2>Emergency Contact</h2>
        <emergency-contact-fields .form=${this.form}></emergency-contact-fields>

        <button type="submit" ?disabled=${this.form.api.state.isSubmitting}>
          ${this.form.api.state.isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'people-page': PeoplePage
  }
}

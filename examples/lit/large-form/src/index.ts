import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'
import { addressFields } from './address-fields'
import { emergencyContactFields } from './emergency-contact'
import { peopleFormOptions } from './shared-form'
import { textField } from './text-field'
import './styles.css'

@customElement('tanstack-people-form')
export class TanStackPeopleForm extends LitElement {
  private form = new TanStackFormController(this, {
    ...peopleFormOptions,
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
        @submit=${(event: SubmitEvent) => {
          event.preventDefault()
          void this.form.api.handleSubmit()
        }}
      >
        <h1>Personal Information</h1>
        ${this.form.field({ name: 'fullName' }, (field) =>
          textField(field, 'Full Name'),
        )}
        ${this.form.field({ name: 'email' }, (field) =>
          textField(field, 'Email'),
        )}
        ${this.form.field({ name: 'phone' }, (field) =>
          textField(field, 'Phone'),
        )}
        ${addressFields(this.form)} ${emergencyContactFields(this.form)}
        ${this.form.subscribe(
          (state) => state.isSubmitting,
          (isSubmitting) => html`
            <button type="submit" ?disabled=${isSubmitting}>Submit</button>
          `,
        )}
      </form>
    `
  }
}

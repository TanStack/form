import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'
import { formSection } from './form-section'
import { formSubmitButton } from './form-submit-button'
import { sharedFormOptions } from './shared-form'
import { stringField } from './string-field'
import './styles.css'

@customElement('tanstack-split-form')
export class TanStackSplitForm extends LitElement {
  private form = new TanStackFormController(this, {
    ...sharedFormOptions,
    onSubmit: ({ value }) => {
      console.log(value)
    },
  })

  protected createRenderRoot() {
    return this
  }

  render() {
    return html`
      <h1>Split Form Example</h1>
      <form
        @submit=${(event: SubmitEvent) => {
          event.preventDefault()
          event.stopPropagation()
          void this.form.api.handleSubmit()
        }}
      >
        ${this.form.field({ name: 'firstName' }, (field) =>
          stringField(field, 'First Name'),
        )}
        ${this.form.field({ name: 'lastName' }, (field) =>
          stringField(field, 'Last Name'),
        )}
        ${formSection(this.form)} ${formSubmitButton(this.form)}
        <button
          type="reset"
          @click=${(event: Event) => {
            event.preventDefault()
            this.form.api.reset()
          }}
        >
          Reset
        </button>
      </form>
    `
  }
}

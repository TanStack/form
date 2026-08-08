import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'
import {
  step1Schema,
  step2Schema,
  stepValidator,
  wizardFormOptions,
} from './shared-form'
import { textField } from './text-field'
import './styles.css'

@customElement('tanstack-form-wizard')
export class TanStackFormWizard extends LitElement {
  private step = 0
  private form = new TanStackFormController(this, {
    ...wizardFormOptions,
    onSubmit: ({ value }) => {
      alert(`Form submitted: ${JSON.stringify(value)}`)
    },
  })

  protected createRenderRoot() {
    return this
  }

  render() {
    return html`
      <h1>Multi-step Wizard</h1>
      ${this.step === 0 ? this.renderStepOne() : this.renderStepTwo()}
    `
  }

  private renderStepOne() {
    return this.form.formGroup(
      {
        name: 'step1',
        validators: [stepValidator(step1Schema)],
        onSubmit: () => {
          this.step = 1
          this.requestUpdate()
        },
      },
      (group) => html`
        <form
          @submit=${(event: SubmitEvent) => {
            event.preventDefault()
            event.stopPropagation()
            void group.handleSubmit()
          }}
        >
          ${group.field({ name: 'name' }, (field) =>
            textField(field, 'Step 1 Name'),
          )}
          ${this.submitButton('Next')}
        </form>
      `,
    )
  }

  private renderStepTwo() {
    return this.form.formGroup(
      {
        name: 'step2',
        validators: [stepValidator(step2Schema)],
        onSubmit: () => {
          void this.form.api.handleSubmit()
        },
      },
      (group) => html`
        <form
          @submit=${(event: SubmitEvent) => {
            event.preventDefault()
            event.stopPropagation()
            void group.handleSubmit()
          }}
        >
          ${group.field({ name: 'name' }, (field) =>
            textField(field, 'Step 2 Name'),
          )}
          <div class="actions">
            <button
              type="button"
              @click=${() => {
                this.step = 0
                this.requestUpdate()
              }}
            >
              Back
            </button>
            ${this.submitButton('Submit')}
          </div>
        </form>
      `,
    )
  }

  private submitButton(label: string) {
    return this.form.subscribe(
      (state) => state.isSubmitting,
      (isSubmitting) => html`
        <button type="submit" ?disabled=${isSubmitting}>${label}</button>
      `,
    )
  }
}

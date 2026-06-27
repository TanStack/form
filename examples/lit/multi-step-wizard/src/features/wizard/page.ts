import { LitElement, html, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { TanStackFormController, revalidateLogic } from '@tanstack/lit-form'
import { z } from 'zod'
import { wizardFormOpts, step1Schema, step2Schema } from './shared-form.js'
import './step1-subform.js'
import './step2-subform.js'

@customElement('wizard-page')
export class WizardPage extends LitElement {
  @state()
  private step = 0

  form = new TanStackFormController(this, {
    ...wizardFormOpts,
    validationLogic: revalidateLogic(),
    validators: {
      // onDynamic is only used when `form.handleSubmit` is called itself.
      // When the form group's `handleSubmit` is called, it will only validate
      // the current step's schema. This means that this schema will not be
      // called when the user submits the form group, but instead when they
      // submit the entire form.
      onDynamic: z.object({
        step1: step1Schema,
        step2: step2Schema,
      }),
    },
    onSubmit: ({ value }) => {
      alert(`Form submitted: ${JSON.stringify(value)}`)
    },
  })

  protected createRenderRoot() {
    return this
  }

  private setStep = (step: number) => {
    this.step = step
  }

  render() {
    return html`
      ${this.step === 0
        ? html`<step1-form
            .form=${this.form}
            .step=${this.step}
            .setStep=${this.setStep}
          ></step1-form>`
        : nothing}
      ${this.step === 1
        ? html`<step2-form
            .form=${this.form}
            .step=${this.step}
            .setStep=${this.setStep}
          ></step2-form>`
        : nothing}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wizard-page': WizardPage
  }
}

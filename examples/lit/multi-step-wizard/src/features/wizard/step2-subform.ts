import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { TanStackStoreSelector } from '@tanstack/lit-store'
import { getFormType } from '@tanstack/lit-form'
import { wizardFormOpts, step2Schema } from './shared-form.js'
import '../../components/text-field.js'

const formType = getFormType(wizardFormOpts)

@customElement('step2-form')
export class Step2Form extends LitElement {
  @property({ attribute: false })
  form!: typeof formType

  @property({ type: Number })
  step = 1

  @property({ attribute: false })
  setStep: (step: number) => void = () => {}

  _selector = new TanStackStoreSelector(this, () => this.form?.api.store)

  protected createRenderRoot() {
    return this
  }

  render() {
    return this.form.group(
      {
        name: 'step2',
        validators: {
          onDynamic: step2Schema,
        },
        onGroupSubmit: () => {
          this.form.api.handleSubmit()
        },
      },
      (formGroup) => html`
        <form
          @submit=${(e: Event) => {
            e.preventDefault()
            e.stopPropagation()
            formGroup.handleSubmit()
          }}
        >
          ${this.form.field(
            { name: 'step2.name' },
            (field) =>
              html`<text-field
                label="Step 2 Name"
                .field=${field}
              ></text-field>`,
          )}

          <button type="button" @click=${() => this.setStep(this.step - 1)}>
            Back
          </button>
          <button type="submit">Submit</button>
        </form>
      `,
    )
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'step2-form': Step2Form
  }
}

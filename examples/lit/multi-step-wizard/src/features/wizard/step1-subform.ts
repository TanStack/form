import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { TanStackStoreSelector } from '@tanstack/lit-store'
import { getFormType } from '@tanstack/lit-form'
import { wizardFormOpts, step1Schema } from './shared-form.js'
import '../../components/text-field.js'

const formType = getFormType(wizardFormOpts)

@customElement('step1-form')
export class Step1Form extends LitElement {
  @property({ attribute: false })
  form!: typeof formType

  @property({ type: Number })
  step = 0

  @property({ attribute: false })
  setStep: (step: number) => void = () => {}

  _selector = new TanStackStoreSelector(this, () => this.form?.api.store)

  protected createRenderRoot() {
    return this
  }

  render() {
    return this.form.group(
      {
        name: 'step1',
        validators: {
          onDynamic: step1Schema,
        },
        onGroupSubmit: () => {
          this.setStep(this.step + 1)
        },
        onGroupSubmitInvalid: () => {
          // Just like a form, you can also handle invalid submits at the group
          // level, which is useful for multi-step wizards to prevent going to
          // the next step if the current step is invalid.
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
            { name: 'step1.name' },
            (field) =>
              html`<text-field
                label="Step 1 Name"
                .field=${field}
              ></text-field>`,
          )}

          <button type="submit">Submit</button>
          <!-- formGroup contains errorMaps and errors, just like forms and fields -->
          <pre>${JSON.stringify(formGroup.state.meta.errorMap, null, 2)}</pre>
        </form>
      `,
    )
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'step1-form': Step1Form
  }
}

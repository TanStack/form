import { LitElement, html, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'
import type { AnyFieldApi } from '@tanstack/lit-form'

function fieldInfo(field: AnyFieldApi) {
  return html`
    ${
      field.meta.isTouched && field.meta.isInvalid
        ? html`<em role="alert">
            ${field.errors.map((error) => error.message).join(', ')}
          </em>`
        : nothing
    }
    ${field.meta.isValidating ? 'Validating...' : nothing}
  `
}

@customElement('tanstack-form-demo')
export class TanStackFormDemo extends LitElement {
  private form = new TanStackFormController(this, {
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  protected createRenderRoot() {
    return this
  }

  render() {
    return html`
      <h1>Simple Form Example</h1>
      <form
        @submit=${(event: SubmitEvent) => {
          event.preventDefault()
          event.stopPropagation()
          void this.form.api.handleSubmit()
        }}
      >
        <div>
          ${this.form.field(
            {
              name: 'firstName',
              validators: [
                {
                  run: ({ value }) =>
                    !value
                      ? 'A first name is required'
                      : value.length < 3
                        ? 'First name must be at least 3 characters'
                        : undefined,
                  triggers: ['change'],
                },
                {
                  run: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    return value.includes('error')
                      ? 'No "error" allowed in first name'
                      : undefined
                  },
                  triggers: ['change'],
                  triggerDebounceMs: 500,
                },
              ],
            },
            (field) => html`
              <label for=${field.name}>First Name:</label>
              <input
                id=${field.name}
                name=${field.name}
                .value=${field.value}
                @blur=${() => field.handleBlur()}
                @input=${(event: InputEvent) =>
                  field.handleChange(
                    (event.currentTarget as HTMLInputElement).value,
                  )}
                aria-invalid=${field.meta.isInvalid ? 'true' : 'false'}
              />
              ${fieldInfo(field)}
            `,
          )}
        </div>
        <div>
          ${this.form.field(
            { name: 'lastName' },
            (field) => html`
              <label for=${field.name}>Last Name:</label>
              <input
                id=${field.name}
                name=${field.name}
                .value=${field.value}
                @blur=${() => field.handleBlur()}
                @input=${(event: InputEvent) =>
                  field.handleChange(
                    (event.currentTarget as HTMLInputElement).value,
                  )}
                aria-invalid=${field.meta.isInvalid ? 'true' : 'false'}
              />
              ${fieldInfo(field)}
            `,
          )}
        </div>
        ${this.form.subscribe(
          (state) => [state.canSubmit, state.isSubmitting] as const,
          ([canSubmit, isSubmitting]) => html`
            <button type="submit" ?disabled=${!canSubmit || isSubmitting}>
              ${isSubmitting ? '...' : 'Submit'}
            </button>
            <button
              type="reset"
              @click=${(event: Event) => {
                event.preventDefault()
                this.form.api.reset()
              }}
            >
              Reset
            </button>
          `,
        )}
      </form>
    `
  }
}

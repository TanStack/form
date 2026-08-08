import { LitElement, html, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'
import type { AnyFieldApi } from '@tanstack/lit-form'
import './styles.css'

function fieldError(field: AnyFieldApi) {
  return html`<small
    role=${field.meta.isInvalid ? 'alert' : nothing}
    aria-live="polite"
    >${field.errors.map((error) => error.message).join('\n')}</small
  >`
}

@customElement('tanstack-basic-form')
export class TanStackBasicForm extends LitElement {
  private form = new TanStackFormController(this, {
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    onSubmit: ({ value, createValidationError }) => {
      console.log(value)
      return createValidationError({
        fields: {
          firstName: 'Name already exists',
          lastName: 'Name already exists',
        },
      })
    },
  })

  protected createRenderRoot() {
    return this
  }

  render() {
    return html`
      <h1>Basic Form Example</h1>
      <form
        @submit=${(event: SubmitEvent) => {
          event.preventDefault()
          event.stopPropagation()
          void this.form.api.handleSubmit()
        }}
      >
        ${this.form.field(
          {
            name: 'firstName',
            validators: [
              {
                run: ({ value }) => {
                  if (!value) return 'A first name is required'
                  if (value.length < 3) return 'First name is too short'
                },
                triggers: ['change', 'blur'],
                triggerDebounceMs: 300,
              },
              {
                run: async ({ value }) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  return value.toLowerCase().includes('error')
                    ? 'No "error" allowed in first name'
                    : undefined
                },
                triggers: ['change'],
                bailIfInvalid: true,
              },
            ],
          },
          (field) => html`
            <label class=${field.meta.isValidating ? 'validating' : ''}>
              <span>First Name</span>
              <input
                name=${field.name}
                .value=${field.value}
                @blur=${() => field.handleBlur()}
                @input=${(event: InputEvent) =>
                  field.handleChange(
                    (event.currentTarget as HTMLInputElement).value,
                  )}
                aria-invalid=${field.meta.isInvalid ? 'true' : 'false'}
              />
              ${fieldError(field)}
            </label>
          `,
        )}
        ${this.form.field(
          { name: 'lastName' },
          (field) => html`
            <label class=${field.meta.isValidating ? 'validating' : ''}>
              <span>Last Name</span>
              <input
                name=${field.name}
                .value=${field.value}
                @blur=${() => field.handleBlur()}
                @input=${(event: InputEvent) =>
                  field.handleChange(
                    (event.currentTarget as HTMLInputElement).value,
                  )}
                aria-invalid=${field.meta.isInvalid ? 'true' : 'false'}
              />
              ${fieldError(field)}
            </label>
          `,
        )}
        ${this.form.subscribe(
          (state) => [state.canSubmit, state.isSubmitting] as const,
          ([canSubmit, isSubmitting]) => html`
            <button type="submit" ?disabled=${!canSubmit || isSubmitting}>
              ${isSubmitting ? '...' : 'Submit'}
            </button>
          `,
        )}
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

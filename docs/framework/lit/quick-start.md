---
id: quick-start
title: Quick Start
---

TanStack Form is a headless, type-safe form library. It owns form state and
validation while leaving markup, styling, and component choice to you.

Install the Lit adapter:

```bash
npm install @tanstack/lit-form
```

## Create a form

Create a `TanStackFormController` as a field on your Lit element. The controller
requires complete `defaultValues`; their shape becomes the inferred form value
type.

```ts
import { LitElement, html } from 'lit'
import { TanStackFormController } from '@tanstack/lit-form'

class ProfileForm extends LitElement {
  private form = new TanStackFormController(this, {
    defaultValues: {
      fullName: '',
      age: 0,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  render() {
    return html`
      <form
        @submit=${(event: SubmitEvent) => {
          event.preventDefault()
          void this.form.api.handleSubmit()
        }}
      >
        ${this.form.field(
          {
            name: 'fullName',
            validators: [
              {
                triggers: ['change', 'blur'],
                run: ({ value }) =>
                  value.trim() ? undefined : 'Enter your full name',
              },
            ],
          },
          (field) => html`
            <label>
              Full name
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
              ${field.errors.map(
                (error) => html`<span role="alert">${error.message}</span>`,
              )}
            </label>
          `,
        )}
        ${this.form.field(
          {
            name: 'age',
            validators: [
              {
                triggers: ['change'],
                run: ({ value }) =>
                  value >= 13 ? undefined : 'You must be at least 13',
              },
            ],
          },
          (field) => html`
            <label>
              Age
              <input
                name=${field.name}
                type="number"
                .value=${String(field.value)}
                @blur=${() => field.handleBlur()}
                @input=${(event: InputEvent) =>
                  field.handleChange(
                    (event.currentTarget as HTMLInputElement).valueAsNumber,
                  )}
                aria-invalid=${field.meta.isInvalid ? 'true' : 'false'}
              />
            </label>
          `,
        )}
        ${this.form.subscribe(
          (state) => [state.canSubmit, state.isSubmitting] as const,
          ([canSubmit, isSubmitting]) => html`
            <button type="submit" ?disabled=${!canSubmit || isSubmitting}>
              ${isSubmitting ? 'Saving…' : 'Save'}
            </button>
          `,
        )}
      </form>
    `
  }
}

customElements.define('profile-form', ProfileForm)
```

The important pieces are:

- `defaultValues` define the complete initial value and drive type inference.
- `form.field(...)` subscribes only its Lit child part to one field. Its render
  callback exposes `field.value`, `field.meta`, and event handlers.
- Validators are ordered objects with a `run` function and explicit
  `triggers`.
- `form.subscribe(...)` updates only its child part when the selected form state
  changes.
- The public form API is available through `form.api`; calling
  `form.api.handleSubmit()` validates before running `onSubmit`.

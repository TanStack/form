import { LitElement, html, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import { type } from 'arktype'
import { Schema as S } from 'effect'
import * as v from 'valibot'
import { z } from 'zod'
import { TanStackFormController } from '@tanstack/lit-form'
import type { AnyFieldApi } from '@tanstack/lit-form'

const ZodSchema = z.object({
  firstName: z
    .string()
    .min(3, '[Zod] You must have a length of at least 3')
    .startsWith('A', "[Zod] First name must start with 'A'"),
  lastName: z.string().min(3, '[Zod] You must have a length of at least 3'),
})

const ValibotSchema = v.object({
  firstName: v.pipe(
    v.string(),
    v.minLength(3, '[Valibot] You must have a length of at least 3'),
    v.startsWith('A', "[Valibot] First name must start with 'A'"),
  ),
  lastName: v.pipe(
    v.string(),
    v.minLength(3, '[Valibot] You must have a length of at least 3'),
  ),
})

const ArkTypeSchema = type({
  firstName: 'string >= 3',
  lastName: 'string >= 3',
})

const EffectSchema = S.standardSchemaV1(
  S.Struct({
    firstName: S.String.pipe(
      S.minLength(3),
      S.annotations({
        message: () => '[Effect/Schema] You must have a length of at least 3',
      }),
    ),
    lastName: S.String.pipe(
      S.minLength(3),
      S.annotations({
        message: () => '[Effect/Schema] You must have a length of at least 3',
      }),
    ),
  }),
)

// Swap the validator below to any of these standard-schema implementations.
void ValibotSchema
void ArkTypeSchema
void EffectSchema

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

@customElement('tanstack-schema-form')
export class TanStackSchemaForm extends LitElement {
  private form = new TanStackFormController(this, {
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    validators: [
      {
        run: ZodSchema,
        triggers: ['change'],
      },
    ],
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  protected createRenderRoot() {
    return this
  }

  render() {
    return html`
      <h1>Standard Schema Form Example</h1>
      <form
        @submit=${(event: SubmitEvent) => {
          event.preventDefault()
          event.stopPropagation()
          void this.form.api.handleSubmit()
        }}
      >
        ${this.renderStringField('firstName', 'First Name')}
        ${this.renderStringField('lastName', 'Last Name')}
        ${this.form.subscribe(
          (state) => [state.canSubmit, state.isSubmitting] as const,
          ([canSubmit, isSubmitting]) => html`
            <button type="submit" ?disabled=${!canSubmit || isSubmitting}>
              ${isSubmitting ? '...' : 'Submit'}
            </button>
          `,
        )}
      </form>
    `
  }

  private renderStringField(name: 'firstName' | 'lastName', label: string) {
    return this.form.field(
      { name },
      (field) => html`
        <div>
          <label for=${field.name}>${label}:</label>
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
        </div>
      `,
    )
  }
}

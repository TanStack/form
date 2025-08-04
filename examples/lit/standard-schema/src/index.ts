import { LitElement, html, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'

import { TanStackFormController } from '@tanstack/lit-form'
import { repeat } from 'lit/directives/repeat.js'

import { type } from 'arktype'
import * as v from 'valibot'
import { z } from 'zod'
import { Schema as S } from 'effect'

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

@customElement('tanstack-form-demo')
export class TanStackFormDemo extends LitElement {
  #form = new TanStackFormController(this, {
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    validators: {
      // DEMO: You can switch between schemas seamlessly
      onChange: ZodSchema,
      // onChange: ValibotSchema,
      // onChange: ArkTypeSchema,
      // onChange: EffectSchema,
    },
    onSubmit({ value }) {
      // Do something with form data
      console.log(value)
    },
  })

  render() {
    return html`
      <form
        @submit=${(e: Event) => {
          e.preventDefault()
          e.stopPropagation()
          this.#form.api.handleSubmit()
        }}
      >
          ${this.#form.field(
            {
              name: `firstName`,
            },
            (field) => {
              return html` <div>
                <label for="${field.name}">First Name:</label>
                <input
                  id="${field.name}"
                  name="${field.name}"
                  .value="${field.state.value}"
                  @blur="${() => field.handleBlur()}"
                  @input="${(e: Event) => {
                    const target = e.target as HTMLInputElement
                    field.handleChange(target.value)
                  }}"
                />
                ${field.state.meta.isTouched && !field.state.meta.isValid
                  ? html`${repeat(
                      field.state.meta.errors,
                      (__, idx) => idx,
                      (error) => {
                        return html`<div style="color: red;">
                          ${error?.message}
                        </div>`
                      },
                    )}`
                  : nothing}
                ${field.state.meta.isValidating
                  ? html`<p>Validating...</p>`
                  : nothing}
              </div>`
            },
          )}
        </div>
        <div>
          ${this.#form.field(
            {
              name: `lastName`,
            },
            (field) => {
              return html` <div>
                <label for="${field.name}">Last Name:</label>
                <input
                  id="${field.name}"
                  name="${field.name}"
                  .value="${field.state.value}"
                  @blur="${() => field.handleBlur()}"
                  @input="${(e: Event) => {
                    const target = e.target as HTMLInputElement
                    field.handleChange(target.value)
                  }}"
                />
                ${field.state.meta.isTouched && !field.state.meta.isValid
                  ? html`${repeat(
                      field.state.meta.errors,
                      (__, idx) => idx,
                      (error) => {
                        return html`<div style="color: red;">
                          ${error?.message}
                        </div>`
                      },
                    )}`
                  : nothing}
                ${field.state.meta.isValidating
                  ? html`<p>Validating...</p>`
                  : nothing}
              </div>`
            },
          )}
        </div>

        <button type="submit" ?disabled=${this.#form.api.state.isSubmitting}>
          ${this.#form.api.state.isSubmitting ? '...' : 'Submit'}
        </button>
        <button
          type="button"
          @click=${() => {
            this.#form.api.reset()
          }}
        >
          Reset
        </button>
      </form>
    `
  }
}

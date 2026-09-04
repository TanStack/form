import { LitElement, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { TanStackStoreSelector } from '@tanstack/lit-store'
import type { AnyFieldApi } from '@tanstack/lit-form'

@customElement('text-field')
export class TextField extends LitElement {
  @property({ attribute: false })
  field!: AnyFieldApi

  @property({ type: String })
  label = ''

  _selector = new TanStackStoreSelector(this, () => this.field?.store)

  // Render into light DOM so the surrounding form picks up the inputs naturally
  protected createRenderRoot() {
    return this
  }

  render() {
    const field = this.field
    return html`
      <div>
        <label for=${field.name}>
          <div>${this.label}</div>
          <input
            id=${field.name}
            name=${field.name}
            .value=${String(field.state.value ?? '')}
            @blur=${() => field.handleBlur()}
            @input=${(e: Event) =>
              field.handleChange((e.target as HTMLInputElement).value)}
          />
        </label>
        ${field.state.meta.isTouched && field.state.meta.errors.length
          ? repeat(
              field.state.meta.errors,
              (_, idx) => idx,
              (error: unknown) => {
                const message =
                  error && typeof error === 'object' && 'message' in error
                    ? String((error as { message: unknown }).message)
                    : String(error)
                return html`<div style="color: red">${message}</div>`
              },
            )
          : nothing}
        ${field.state.meta.isValidating ? html`<p>Validating...</p>` : nothing}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'text-field': TextField
  }
}

import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { TanStackFormController } from '@tanstack/lit-form'
import './styles.css'

@customElement('tanstack-array-form')
export class TanStackArrayForm extends LitElement {
  private form = new TanStackFormController(this, {
    defaultValues: {
      items: Array.from({ length: 50 }, () => ''),
    },
    onSubmit: ({ value }) => {
      console.log(value)
      alert(`Submitted ${value.items.length} items.`)
    },
  })

  protected createRenderRoot() {
    return this
  }

  private updateItems() {
    const input = this.querySelector<HTMLInputElement>('#itemsAmount')
    if (!input || Number.isNaN(input.valueAsNumber)) return
    const amount = Math.min(10_000, Math.max(0, input.valueAsNumber))
    this.form.api.reset({
      items: Array.from({ length: amount }, () => ''),
    })
  }

  render() {
    return html`
      <h1>Arrays in Form Example</h1>
      <label for="itemsAmount">
        Enter the amount of items to render with the form.<br />
        Updating it resets the form.
      </label>
      <input
        id="itemsAmount"
        type="number"
        value="50"
        min="0"
        step="1"
        max="10000"
      />
      <button type="button" @click=${() => this.updateItems()}>Update</button>

      ${this.form.subscribe(
        (state) => state.values.items.length,
        (amount) => html`<h2>Item amount: ${amount.toLocaleString()}</h2>`,
      )}
      <form
        @submit=${(event: SubmitEvent) => {
          event.preventDefault()
          event.stopPropagation()
          void this.form.api.handleSubmit()
        }}
      >
        <button type="submit">Submit</button>
        <button
          type="button"
          @click=${() => this.form.api.pushFieldValue('items', 'New Field')}
        >
          Create item
        </button>
        ${this.form.arrayField(
          { name: 'items' },
          (array) => html`
            <ul>
              ${array.value.map(
                (_item, index) => html`
                  <li>
                    ${this.form.field(
                      { name: `items[${index}]` },
                      (field) => html`
                        <label>
                          <span>Field ${index}</span>
                          <input
                            name=${field.name}
                            .value=${field.value}
                            @blur=${() => field.handleBlur()}
                            @input=${(event: InputEvent) =>
                              field.handleChange(
                                (event.currentTarget as HTMLInputElement).value,
                              )}
                          />
                        </label>
                      `,
                    )}
                  </li>
                `,
              )}
            </ul>
          `,
        )}
      </form>
    `
  }
}

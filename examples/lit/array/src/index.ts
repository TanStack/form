import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { TanStackFormController } from '@tanstack/lit-form'
import { repeat } from 'lit/directives/repeat.js'

interface Person {
  name: string
  age: number
}

const defaultPeople: { people: Array<Person> } = { people: [] }

@customElement('tanstack-form-demo')
export class TanStackFormDemo extends LitElement {
  #form = new TanStackFormController(this, {
    defaultValues: defaultPeople,
    onSubmit({ value }) {
      alert(JSON.stringify(value))
    },
  })

  render() {
    return html`
      <div>
        <form
          @submit=${(e: Event) => {
            e.preventDefault()
            e.stopPropagation()
            this.#form.api.handleSubmit()
          }}
        >
          ${this.#form.field(
            {
              name: 'people',
            },
            (peopleField) => {
              return html`<div>
                ${repeat(
                  peopleField.state.value,
                  (_, index) => index,
                  (_, index) => {
                    return html`
                      ${this.#form.field(
                        {
                          name: `people[${index}].name`,
                        },
                        (field) => {
                          return html`<div>
                            <div>
                              <label>
                                <div>Name for person ${index}</div>
                                <input
                                  type="text"
                                  placeholder="First Name"
                                  .value=${field.state.value}
                                  @blur=${() => field.handleBlur()}
                                  @input=${(e: Event) => {
                                    const target = e.target as HTMLInputElement
                                    field.handleChange(target.value)
                                  }}
                                />
                              </label>
                            </div>
                          </div>`
                        },
                      )}
                    `
                  },
                )}

                <button
                  type="button"
                  @click=${() => {
                    peopleField.pushValue({
                      name: '',
                      age: 0,
                    })
                  }}
                >
                  Add person
                </button>
              </div> `
            },
          )}

          <button type="submit" ?disabled=${this.#form.api.state.isSubmitting}>
            ${this.#form.api.state.isSubmitting ? '...' : 'Submit'}
          </button>
        </form>
      </div>
    `
  }
}

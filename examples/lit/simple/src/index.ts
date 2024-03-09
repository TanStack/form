import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { TanstackFormController, bind } from '@tanstack/lit-form'
import { repeat } from 'lit/directives/repeat.js'
import { styles } from './styles.js'
import type { FormOptions } from '@tanstack/lit-form'

interface Employee {
  firstName: string
  lastName: string
  employed: boolean
  jobTitle: string
  about: string
}

interface Data {
  employees: Partial<Employee>[]
}

const formConfig: FormOptions<Data> = {}

@customElement('tanstack-form-demo')
export class TanstackFormDemo extends LitElement {
  static styles = styles

  #form = new TanstackFormController(this, formConfig)

  render() {
    return html`
      <form
        id="form"
        @submit=${(e: Event) => {
          e.preventDefault()
        }}
      >
        <h1>Tanstack Form - Lit Demo</h1>
        ${this.#form.field(
          {
            name: 'employees',
            defaultValue: [],
          },
          (employeesField) => {
            return html`${repeat(
                employeesField.getValue(),
                (_, index) => index,
                (_, index) => {
                  return html`
                    ${this.#form.field(
                      {
                        name: `employees.${index}.firstName`,
                        validators: {
                          onChange: ({ value }: { value: string }) => {
                            return value && value.length < 3
                              ? 'Not long enough'
                              : undefined
                          },
                        },
                      },
                      (field) => {
                        return html` <div>
                          <label>First Name</label>
                          <input
                            type="text"
                            placeholder="First Name"
                            ${bind(field)}
                          />
                        </div>`
                      },
                    )}
                    ${this.#form.field(
                      { name: `employees.${index}.lastName` },
                      (lastNameField) => {
                        return html` <div>
                          <label>Last Name</label>
                          <input
                            type="text"
                            placeholder="Last Name"
                            ${bind(lastNameField)}
                          />
                        </div>`
                      },
                    )}
                    ${this.#form.field(
                      { name: `employees.${index}.about` },
                      (aboutField) => {
                        return html` <div>
                          <label>About</label>
                          <textarea
                            style="width: 100%"
                            ${bind(aboutField)}
                          ></textarea>
                        </div>`
                      },
                    )}
                    ${this.#form.field(
                      { name: `employees.${index}.employed` },
                      (employedField) => {
                        return html`<div>
                            <label>Employed?</label>
                            <input
                              type="checkbox"
                              @input="${() =>
                                employedField.handleChange(
                                  !employedField.getValue(),
                                )}"
                              .checked="${employedField.getValue()}"
                              @blur="${() => employedField.handleBlur()}"
                            />
                          </div>
                          ${employedField.getValue()
                            ? this.#form.field(
                                {
                                  name: `employees.${index}.jobTitle`,
                                  validators: {
                                    onChange: ({
                                      value,
                                    }: {
                                      value: string
                                    }) => {
                                      return value.length === 0
                                        ? 'Needs to have a job here'
                                        : null
                                    },
                                  },
                                },
                                (jobTitleField) => {
                                  return html` <div>
                                    <label>Job Title</label>
                                    <input
                                      type="text"
                                      placeholder="Job Title"
                                      ${bind(jobTitleField)}
                                    />
                                  </div>`
                                },
                              )
                            : ''} `
                      },
                    )}
                  `
                },
              )}

              <div>
                <button
                  type="button"
                  @click=${() => {
                    employeesField.pushValue({
                      firstName: '',
                      lastName: '',
                      employed: false,
                    })
                  }}
                >
                  Add employee
                </button>
              </div> `
          },
        )}

        <div>
          <button type="submit" ?disabled=${this.#form.api.state.isSubmitting}>
            ${this.#form.api.state.isSubmitting ? html` Submitting` : 'Submit'}
          </button>
          <button
            type="button"
            id="reset"
            @click=${() => {
              this.#form.api.reset()
            }}
          >
            Reset
          </button>
        </div>
      </form>
      <pre>${JSON.stringify(this.#form.api.state, null, 2)}</pre>
    `
  }
}

import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@material/web/textfield/filled-text-field.js'
import '@material/web/checkbox/checkbox.js'
import '@material/web/select/filled-select.js'
import '@material/web/select/select-option.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/outlined-button.js'

import { styles } from './styles.js'
import type { FormOptions } from '@tanstack/lit-form'
import { TanstackFormController } from '@tanstack/lit-form'
import { bind } from './custom-bind'
import { repeat } from 'lit/directives/repeat.js'

interface Employee {
  firstName: string
  lastName: string
  employed: boolean
  jobTitle: string
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
                          <md-filled-text-field
                            type="text"
                            placeholder="First Name"
                            ${bind(field)}
                          ></md-filled-text-field>
                        </div>`
                      },
                    )}
                    ${this.#form.field(
                      { name: `employees.${index}.lastName` },
                      (lastNameField) => {
                        return html` <div>
                          <label>Last Name</label>
                          <md-filled-text-field
                            type="text"
                            placeholder="Last Name"
                            ${bind(lastNameField)}
                          ></md-filled-text-field>
                        </div>`
                      },
                    )}
                    ${this.#form.field(
                      { name: `employees.${index}.employed` },
                      (employedField) => {
                        return html`<div>
                            <label>Employed?</label>
                            <md-checkbox
                              type="checkbox"
                              @input="${() =>
                                employedField.handleChange(
                                  !employedField.getValue(),
                                )}"
                              .checked="${employedField.getValue()}"
                              @blur="${() => employedField.handleBlur()}"
                            ></md-checkbox>
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
                                    <md-filled-text-field
                                      type="text"
                                      placeholder="Job Title"
                                      ${bind(jobTitleField)}
                                    ></md-filled-text-field>
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
                <md-outlined-button
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
                </md-outlined-button>
              </div> `
          },
        )}

        <div>
          <md-filled-button
            type="submit"
            ?disabled=${this.#form.api.state.isSubmitting}
          >
            ${this.#form.api.state.isSubmitting ? html` Submitting` : 'Submit'}
          </md-filled-button>
          <md-outlined-button
            type="button"
            id="reset"
            @click=${() => {
              this.#form.api.reset()
            }}
          >
            Reset
          </md-outlined-button>
        </div>
      </form>
      <pre>${JSON.stringify(this.#form.api.state, null, 2)}</pre>
    `
  }
}

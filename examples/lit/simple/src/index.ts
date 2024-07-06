import { LitElement, html, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'

import { TanStackFormController } from '@tanstack/lit-form'
import { repeat } from 'lit/directives/repeat.js'
import { styles } from './styles.js'

interface Employee {
  firstName: string
  lastName: string
  employed: boolean
  jobTitle?: string
  about?: string
}

@customElement('tanstack-form-demo')
export class TanStackFormDemo extends LitElement {
  static styles = styles

  #form = new TanStackFormController(this, {
    defaultValues: {
      employees: [] as Employee[],
    },
  })

  render() {
    return html`
      <form
        id="form"
        @submit=${(e: Event) => {
          e.preventDefault()
        }}
      >
        <h1>TanStack Form - Lit Demo</h1>
        ${this.#form.field(
          {
            name: 'employees',
            defaultValue: [],
          },
          (employeesField) => {
            return html`${repeat(
                employeesField.state.value,
                (_, index) => index,
                (_, index) => {
                  return html`
                    ${this.#form.field(
                      {
                        name: `employees[${index}].firstName`,
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
                          <div class="container">
                            <label>First Name</label>
                            <input
                              type="text"
                              placeholder="First Name"
                              .value="${field.state.value}"
                              @blur="${() => field.handleBlur()}"
                              @input="${(e: Event) => {
                                const target = e.target as HTMLInputElement
                                field.handleChange(target.value)
                              }}"
                            />
                          </div>
                          ${field.state.meta.isTouched &&
                          field.state.meta.errors.length
                            ? html`${repeat(
                                field.state.meta.errors,
                                (__, idx) => idx,
                                (error) => {
                                  return html`<div class="container">
                                    ${error}
                                  </div>`
                                },
                              )}`
                            : nothing}
                        </div>`
                      },
                    )}
                    ${this.#form.field(
                      { name: `employees[${index}].lastName` },
                      (lastNameField) => {
                        return html` <div class="container">
                          <label>Last Name</label>
                          <input
                            type="text"
                            placeholder="Last Name"
                            .value="${lastNameField.state.value}"
                            @blur="${() => lastNameField.handleBlur()}"
                            @input="${(e: Event) => {
                              const target = e.target as HTMLInputElement
                              lastNameField.handleChange(target.value)
                            }}"
                          />
                        </div>`
                      },
                    )}
                    ${this.#form.field(
                      { name: `employees[${index}].about`, defaultValue: '' },
                      (aboutField) => {
                        return html` <div class="container">
                          <label>About</label>
                          <textarea
                            style="width: 100%"
                            .value="${aboutField.state.value}"
                            @blur="${() => aboutField.handleBlur()}"
                            @input="${(e: Event) => {
                              const target = e.target as HTMLInputElement
                              aboutField.handleChange(target.value)
                            }}"
                          ></textarea>
                        </div>`
                      },
                    )}
                    ${this.#form.field(
                      { name: `employees[${index}].employed` },
                      (employedField) => {
                        return html`<div class="container">
                            <label>Employed?</label>
                            <input
                              type="checkbox"
                              @input="${() =>
                                employedField.handleChange(
                                  !employedField.state.value,
                                )}"
                              .checked="${employedField.state.value}"
                              @blur="${() => employedField.handleBlur()}"
                            />
                          </div>
                          ${employedField.state.value
                            ? this.#form.field(
                                {
                                  name: `employees[${index}].jobTitle`,
                                  defaultValue: '',
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
                                    <div class="container">
                                      <label>Job Title</label>
                                      <input
                                        type="text"
                                        placeholder="Job Title"
                                        .value="${jobTitleField.state.value}"
                                        @blur="${() =>
                                          jobTitleField.handleBlur()}"
                                        @input="${(e: Event) => {
                                          const target =
                                            e.target as HTMLInputElement
                                          jobTitleField.handleChange(
                                            target.value,
                                          )
                                        }}"
                                      />
                                    </div>
                                    ${jobTitleField.state.meta.isTouched &&
                                    jobTitleField.state.meta.errors.length
                                      ? html`${repeat(
                                          jobTitleField.state.meta.errors,
                                          (__, idx) => idx,
                                          (error) => {
                                            return html`<div class="container">
                                              ${error}
                                            </div>`
                                          },
                                        )}`
                                      : nothing}
                                  </div>`
                                },
                              )
                            : ''} `
                      },
                    )}
                  `
                },
              )}

              <div class="container">
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

        <div class="container">
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

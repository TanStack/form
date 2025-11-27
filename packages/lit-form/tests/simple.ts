import { LitElement, html } from 'lit'
import { TanStackFormController } from '../src/index.js'

interface Employee {
  firstName: string
  lastName: string
  color?: '#FF0000' | '#00FF00' | '#0000FF'
  employed: boolean
  jobTitle: string
}

export const sampleData: Employee = {
  firstName: 'Christian',
  lastName: '',
  employed: false,
  jobTitle: '',
}

const formConfig = {
  defaultValues: sampleData,
}

export class TestForm extends LitElement {
  form = new TanStackFormController(this, formConfig)

  render() {
    return html`
      <form
        id="form"
        @submit=${(e: Event) => {
          e.preventDefault()
        }}
      >
        <h1>TanStack Form - Lit Demo</h1>

        ${this.form.field(
          {
            name: `firstName`,
            validators: {
              onChange: ({ value }) =>
                value.length < 3 ? 'Not long enough' : undefined,
            },
          },
          (field) => {
            return html` <div>
              <label>First Name</label>
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                .value=${field.state.value}
                @blur=${() => field.handleBlur()}
                @input=${(e: Event) => {
                  const target = e.target as HTMLInputElement
                  field.handleChange(target.value)
                }}
              />
            </div>`
          },
        )}
        ${this.form.field(
          {
            name: `lastName`,
            validators: {
              onChange: ({ value }) =>
                value.length < 3 ? 'Not long enough' : undefined,
            },
          },
          (field) => {
            return html` <div>
              <label>Last Name</label>
              <input
                id="lastName"
                type="text"
                placeholder="Last Name"
                .value=${field.state.value}
                @blur=${() => field.handleBlur()}
                @input=${(e: Event) => {
                  const target = e.target as HTMLInputElement
                  field.handleChange(target.value)
                }}
              />
            </div>`
          },
        )}
        ${this.form.field({ name: `color` }, (field) => {
          return html` <div>
            <label>Favorite Color</label>
            <select
              .value=${field.state.value}
              @blur=${() => field.handleBlur()}
              @input=${(e: Event) => {
                const target = e.target as HTMLInputElement
                field.handleChange(
                  target.value as '#FF0000' | '#00FF00' | '#0000FF',
                )
              }}
            >
              <option value="#FF0000">Red</option>
              <option value="#00FF00">Green</option>
              <option value="#0000FF">Blue</option>
            </select>
          </div>`
        })}
        ${this.form.field({ name: `employed` }, (field) => {
          return html`
            <div>
              <label>Employed?</label>
              <input
                @input=${() => field.handleChange(!field.state.value)}
                .checked=${field.state.value}
                @blur=${() => field.handleBlur()}
                id="employed"
                .type=${'checkbox'}
              />
            </div>
            ${field.state.value
              ? this.form.field(
                  {
                    name: `jobTitle`,
                    validators: {
                      onChange: ({ value }) =>
                        value.length === 0 ? 'Needs to have a job here' : null,
                    },
                  },
                  (subField) => {
                    return html` <div>
                      <label>Job Title</label>
                      <input
                        type="text"
                        id="jobTitle"
                        placeholder="Job Title"
                        .value=${subField.state.value}
                        @blur=${() => subField.handleBlur()}
                        @input=${(e: Event) => {
                          const target = e.target as HTMLInputElement
                          subField.handleChange(target.value)
                        }}
                      />
                    </div>`
                  },
                )
              : ''}
          `
        })}
      </form>
        <div>
          <button
            type="submit"
            ?disabled=${this.form.api.state.isSubmitting}
            >${this.form.api.state.isSubmitting ? html` Submitting` : 'Submit'}
          </button>
          <button
            type="button"
            id="reset"
            @click=${() => {
              this.form.api.reset()
            }}
          >
            Reset
          </button>
        </div>
      </form>
      <pre>${JSON.stringify(this.form.api.state, null, 2)}</pre>
    `
  }
}

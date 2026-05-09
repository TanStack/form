/// <reference lib="dom" />
import { beforeEach, describe, expect, it } from 'vitest'
import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { LitElement, html } from 'lit'
import { TanStackFormController } from '../src/index.js'
import { defineOnce, mount } from './utils'

interface Employee {
  firstName: string
  lastName: string
  color?: '#FF0000' | '#00FF00' | '#0000FF'
  employed: boolean
  jobTitle: string
}

const sampleData: Employee = {
  firstName: 'Christian',
  lastName: '',
  employed: false,
  jobTitle: '',
}

class TestForm extends LitElement {
  form = new TanStackFormController(this, {
    defaultValues: sampleData,
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
                .value="${field.state.value}"
                @blur="${() => field.handleBlur()}"
                @input="${(e: Event) => {
                  const target = e.target as HTMLInputElement
                  field.handleChange(target.value)
                }}"
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
                .value="${field.state.value}"
                @blur="${() => field.handleBlur()}"
                @input="${(e: Event) => {
                  const target = e.target as HTMLInputElement
                  field.handleChange(target.value)
                }}"
              />
            </div>`
          },
        )}
        ${this.form.field({ name: `color` }, (field) => {
          return html` <div>
            <label>Favorite Color</label>
            <select
              .value="${field.state.value}"
              @blur="${() => field.handleBlur()}"
              @input="${(e: Event) => {
                const target = e.target as HTMLInputElement
                field.handleChange(
                  target.value as '#FF0000' | '#00FF00' | '#0000FF',
                )
              }}"
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
                @input="${() => field.handleChange(!field.state.value)}"
                .checked="${field.state.value}"
                @blur="${() => field.handleBlur()}"
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
                        .value="${subField.state.value}"
                        @blur="${() => subField.handleBlur()}"
                        @input="${(e: Event) => {
                          const target = e.target as HTMLInputElement
                          subField.handleChange(target.value)
                        }}"
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

defineOnce('test-form', TestForm)
describe('Lit Tests', () => {
  let element: TestForm
  beforeEach(async () => {
    element = await mount<TestForm>('test-form')
  })

  it('should have initial values', async () => {
    expect(
      await element.shadowRoot!.querySelector<HTMLInputElement>('#firstName'),
    ).toHaveValue(sampleData.firstName)
    expect(
      await element.shadowRoot!.querySelector<HTMLInputElement>('#lastName'),
    ).toHaveValue('')
    const form = element.form!
    expect(form.api.getFieldValue('firstName')).toBe(sampleData.firstName)
    expect(form.api.getFieldMeta('firstName')?.isTouched).toBeFalsy()
    expect(form.api.getFieldValue('lastName')).toBe('')
    expect(form.api.getFieldMeta('lastName')?.isTouched).toBeFalsy()
  })
  it('should mirror user input', async () => {
    const lastName =
      await element.shadowRoot!.querySelector<HTMLInputElement>('#lastName')!
    const lastNameValue = 'Jobs'
    await userEvent.type(lastName, lastNameValue)

    const form = element.form!
    expect(form.api.getFieldValue('lastName')).toBe(lastNameValue)
    expect(form.api.getFieldMeta('lastName')?.isTouched).toBeTruthy()
  })
  it('Reset form to initial value', async () => {
    const firstName =
      await element.shadowRoot!.querySelector<HTMLInputElement>('#firstName')!
    await userEvent.type(firstName, '-Joseph')

    expect(firstName).toHaveValue('Christian-Joseph')

    const form = element.form
    await element
      .shadowRoot!.querySelector<HTMLButtonElement>('#reset')
      ?.click()
    expect(form.api.getFieldValue('firstName')).toBe(sampleData.firstName)
  })

  it('should display validation', async () => {
    const lastName =
      await element.shadowRoot!.querySelector<HTMLInputElement>('#lastName')!
    const lastNameValue = 'Jo'
    await userEvent.type(lastName, lastNameValue)
    expect(lastName).toHaveValue('Jo')
    const form = element.form
    expect(form.api.getFieldMeta('lastName')?.errors[0]).toBe('Not long enough')

    await userEvent.type(lastName, lastNameValue)

    expect(await lastName.getAttribute('error-text')).toBeFalsy()
    expect(form.api.getFieldValue('lastName')).toBe('JoJo')
    expect(form.api.getFieldMeta('lastName')?.isTouched).toBeTruthy()
    expect(form.api.getFieldMeta('lastName')?.errors.length).toBeFalsy()
  })
})

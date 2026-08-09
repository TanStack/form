/// <reference lib="dom" />
import { LitElement, html } from 'lit'
import '@testing-library/jest-dom'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import {
  TanStackFormController,
  formOptions,
  getFieldGroupHelpers,
  getFormType,
} from '../src/index.js'
import { defineOnce, mount } from './utils.js'
import type { LitFormType } from '../src/index.js'

const personFormOptions = formOptions({
  defaultValues: {
    firstName: 'Ada',
    lastName: '',
    items: [{ id: 'one', name: 'First' }],
    profile: { name: '' },
  },
})

class TestFormElement extends LitElement {
  submit = vi.fn()
  formMount = vi.fn()
  fieldMount = vi.fn()
  fieldUnmount = vi.fn()
  updateCount = 0

  form = new TanStackFormController(this, {
    ...personFormOptions,
    onSubmit: ({ value }) => this.submit(value),
    listeners: [
      {
        triggers: ['mount'],
        run: this.formMount,
      },
    ],
  })

  updateFirstName(firstName: string) {
    this.form.update({
      ...personFormOptions,
      defaultValues: {
        ...personFormOptions.defaultValues,
        firstName,
      },
      onSubmit: ({ value }) => this.submit(value),
      listeners: [
        {
          triggers: ['mount'],
          run: this.formMount,
        },
      ],
    })
  }

  protected updated() {
    this.updateCount++
  }

  render() {
    return html`
      <form
        @submit=${(event: SubmitEvent) => {
          event.preventDefault()
          void this.form.api.handleSubmit()
        }}
      >
        ${this.form.field(
          {
            name: 'firstName',
            listeners: [
              { triggers: ['mount'], run: this.fieldMount },
              { triggers: ['unmount'], run: this.fieldUnmount },
            ],
          },
          (field) => {
            return html`
              <label>
                First name
                <input
                  id="firstName"
                  .value=${field.value}
                  @blur=${() => field.handleBlur()}
                  @input=${(event: InputEvent) =>
                    field.handleChange(
                      (event.currentTarget as HTMLInputElement).value,
                    )}
                />
              </label>
            `
          },
        )}
        ${this.form.field(
          {
            name: 'lastName',
            validators: [
              {
                triggers: ['change'],
                run: ({ value }) =>
                  value.length >= 3 ? undefined : 'Use at least 3 characters',
              },
            ],
          },
          (field) => html`
            <label>
              Last name
              <input
                id="lastName"
                .value=${field.value}
                @blur=${() => field.handleBlur()}
                @input=${(event: InputEvent) =>
                  field.handleChange(
                    (event.currentTarget as HTMLInputElement).value,
                  )}
              />
            </label>
            ${field.errors.map(
              (error) => html`<span class="last-error">${error.message}</span>`,
            )}
          `,
        )}
        ${this.form.subscribe(
          (state) => state.isSubmitting,
          (isSubmitting) => html`
            <button id="submit" type="submit" ?disabled=${isSubmitting}>
              ${isSubmitting ? 'Submitting' : 'Submit'}
            </button>
          `,
        )}
        <button id="reset" type="button" @click=${() => this.form.api.reset()}>
          Reset
        </button>
      </form>
    `
  }
}

class ArrayFormElement extends LitElement {
  form = new TanStackFormController(this, personFormOptions)

  render() {
    return html`
      ${this.form.arrayField({ name: 'items' }, (array) => {
        return html`
          <output id="count">${array.value.length}</output>
          ${array.value.map((_item, index) =>
            this.form.field(
              { name: `items[${index}].name` },
              (field) => html`<input class="item" .value=${field.value} />`,
            ),
          )}
        `
      })}
      <button
        id="add"
        @click=${() =>
          this.form.api.pushFieldValue('items', {
            id: crypto.randomUUID(),
            name: 'Next',
          })}
      >
        Add
      </button>
    `
  }
}

class FormGroupElement extends LitElement {
  step = 0
  groupSubmit = vi.fn(() => {
    this.step++
    this.requestUpdate()
  })
  form = new TanStackFormController(this, personFormOptions)

  render() {
    return html`
      ${this.form.formGroup(
        {
          name: 'profile',
          validators: [
            {
              triggers: [],
              run: ({ value }) =>
                value.name.length >= 2 ? undefined : 'Enter a name',
            },
          ],
          onSubmit: this.groupSubmit,
        },
        (group) => html`
          <form
            @submit=${(event: SubmitEvent) => {
              event.preventDefault()
              void group.handleSubmit()
            }}
          >
            ${group.field({ name: 'name' }, (field) => {
              return html`
                <input
                  id="profileName"
                  .value=${field.value}
                  @input=${(event: InputEvent) =>
                    field.handleChange(
                      (event.currentTarget as HTMLInputElement).value,
                    )}
                />
              `
            })}
            ${group.state.errors.map(
              (error) =>
                html`<span class="group-error">${error.message}</span>`,
            )}
            <button id="continue" type="submit">Continue</button>
          </form>
        `,
      )}
      <output id="step">${this.step}</output>
    `
  }
}

const { defineFields, helper, withFields } = getFieldGroupHelpers()
const reusableNameFields = defineFields({
  value: helper.strict<string>(),
})
const ReusableNameField = withFields(
  reusableNameFields,
  (props: { fields: typeof reusableNameFields; label: string }) =>
    props.fields.field(
      { name: 'value' },
      (field) => html`
        <label>
          ${props.label}
          <input
            id="reusableName"
            .value=${field.value}
            @input=${(event: InputEvent) =>
              field.handleChange(
                (event.currentTarget as HTMLInputElement).value,
              )}
          />
        </label>
      `,
    ),
  'fields',
)

class ReusableFieldGroupElement extends LitElement {
  form = new TanStackFormController(this, {
    defaultValues: { profile: { name: '' }, count: 0 },
  })

  render() {
    return ReusableNameField({
      form: this.form,
      fields: { value: 'profile.name' },
      label: 'Name',
    })
  }
}

defineOnce('test-lit-form', TestFormElement)
defineOnce('test-lit-array-form', ArrayFormElement)
defineOnce('test-lit-form-group', FormGroupElement)
defineOnce('test-lit-reusable-field-group', ReusableFieldGroupElement)

describe('TanStackFormController', () => {
  it('owns v2 fields and mirrors user input', async () => {
    const element = await mount<TestFormElement>('test-lit-form')
    const firstName =
      element.shadowRoot!.querySelector<HTMLInputElement>('#firstName')!
    const lastName =
      element.shadowRoot!.querySelector<HTMLInputElement>('#lastName')!

    expect(firstName).toHaveValue('Ada')
    expect(lastName).toHaveValue('')

    await userEvent.type(lastName, 'Lovelace')

    expect(element.form.api.getFieldValue('lastName')).toBe('Lovelace')
  })

  it('updates field parts without rerendering the host', async () => {
    const element = await mount<TestFormElement>('test-lit-form')
    const updateCount = element.updateCount

    await userEvent.type(
      element.shadowRoot!.querySelector<HTMLInputElement>('#lastName')!,
      'Lovelace',
    )

    expect(element.updateCount).toBe(updateCount)
    expect(element.shadowRoot!.querySelector('.last-error')).toBeNull()
  })

  it('renders v2 validation issues and resets fields', async () => {
    const element = await mount<TestFormElement>('test-lit-form')
    const user = userEvent.setup()
    const firstName =
      element.shadowRoot!.querySelector<HTMLInputElement>('#firstName')!
    const lastName =
      element.shadowRoot!.querySelector<HTMLInputElement>('#lastName')!

    await user.type(lastName, 'Li')
    expect(element.shadowRoot!.querySelector('.last-error')).toHaveTextContent(
      'Use at least 3 characters',
    )
    await user.type(firstName, ' Lovelace')
    await user.click(element.shadowRoot!.querySelector('#reset')!)
    await element.updateComplete
    expect(firstName).toHaveValue('Ada')
  })

  it('submits through the form API', async () => {
    const element = await mount<TestFormElement>('test-lit-form')
    const user = userEvent.setup()
    await user.type(
      element.shadowRoot!.querySelector<HTMLInputElement>('#lastName')!,
      'Lovelace',
    )
    await user.click(element.shadowRoot!.querySelector('#submit')!)
    await vi.waitFor(() => expect(element.submit).toHaveBeenCalledOnce())
  })

  it('updates untouched defaults without replacing the controller', async () => {
    const element = await mount<TestFormElement>('test-lit-form')
    const form = element.form

    element.updateFirstName('Grace')
    await element.updateComplete

    expect(element.form).toBe(form)
    expect(
      element.shadowRoot!.querySelector<HTMLInputElement>('#firstName'),
    ).toHaveValue('Grace')
  })

  it('mounts and reconnects form and field subscriptions', async () => {
    const element = await mount<TestFormElement>('test-lit-form')
    expect(element.formMount).toHaveBeenCalledOnce()
    expect(element.fieldMount).toHaveBeenCalledOnce()

    element.remove()
    await Promise.resolve()
    expect(element.fieldUnmount).toHaveBeenCalledOnce()

    document.body.appendChild(element)
    element.requestUpdate()
    await element.updateComplete
    expect(element.formMount).toHaveBeenCalledTimes(2)
    expect(element.fieldMount).toHaveBeenCalledTimes(2)
  })

  it('renders structural array updates through arrayField', async () => {
    const element = await mount<ArrayFormElement>('test-lit-array-form')
    expect(element.shadowRoot!.querySelector('#count')).toHaveTextContent('1')

    await userEvent.click(element.shadowRoot!.querySelector('#add')!)

    expect(element.shadowRoot!.querySelector('#count')).toHaveTextContent('2')
    expect(element.shadowRoot!.querySelectorAll('.item')).toHaveLength(2)
  })

  it('validates and submits a scoped form group', async () => {
    const element = await mount<FormGroupElement>('test-lit-form-group')
    const user = userEvent.setup()

    await user.click(element.shadowRoot!.querySelector('#continue')!)
    expect(element.shadowRoot!.querySelector('.group-error')).toHaveTextContent(
      'Enter a name',
    )
    expect(element.groupSubmit).not.toHaveBeenCalled()

    await user.type(
      element.shadowRoot!.querySelector<HTMLInputElement>('#profileName')!,
      'Ada',
    )
    await user.click(element.shadowRoot!.querySelector('#continue')!)

    await vi.waitFor(() => expect(element.groupSubmit).toHaveBeenCalledOnce())
    expect(element.shadowRoot!.querySelector('#step')).toHaveTextContent('1')
  })

  it('maps reusable virtual fields to concrete form paths', async () => {
    const element = await mount<ReusableFieldGroupElement>(
      'test-lit-reusable-field-group',
    )

    await userEvent.type(
      element.shadowRoot!.querySelector<HTMLInputElement>('#reusableName')!,
      'Ada',
    )

    expect(element.form.api.getFieldValue('profile.name')).toBe('Ada')
  })

  it('derives reusable controller types from formOptions', () => {
    type ReusableForm = LitFormType<typeof personFormOptions>
    const reusableForm = getFormType(personFormOptions)
    expectTypeOf(reusableForm).toEqualTypeOf<ReusableForm>()

    class Parent extends LitElement {
      form = new TanStackFormController(this, {
        ...personFormOptions,
        onSubmit: () => undefined,
      })
    }

    expectTypeOf<Parent['form']>().toExtend<ReusableForm>()
  })
})

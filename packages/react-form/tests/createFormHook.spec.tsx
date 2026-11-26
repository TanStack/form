import React from 'react'
import { render } from 'vitest-browser-react'
import { describe, expect, it, vi } from 'vitest'
import { createFormHook, getFormHookHelpers } from '../src'
import type { FieldWithValue } from '../src'

describe('createFormHook', () => {
  it('provides registered components to fields created during mount validation', async () => {
    const SharedComponent = () => <span>Shared field component</span>
    const { useAppForm } = createFormHook({
      fieldComponents: { SharedComponent },
      formComponents: {},
    })

    function Component() {
      const form = useAppForm({
        defaultValues: { name: '' },
        validators: [
          {
            triggers: ['mount'],
            run: () => ({ fields: { name: 'Name is required' } }),
          },
        ],
      })

      return (
        <form.Field name="name">
          {(field) => {
            const { SharedComponent: DestructuredComponent } = field
            return <DestructuredComponent />
          }}
        </form.Field>
      )
    }

    const { getByText } = await render(<Component />)

    expect(getByText('Shared field component')).toBeInTheDocument()
  })

  it('provides field context to field components inside an ArrayField', async () => {
    function ItemCount({ field }: { field: FieldWithValue<Array<string>> }) {
      return <span>Items: {field.value.length}</span>
    }

    const { fieldComponent } = getFormHookHelpers()
    const { useAppForm } = createFormHook({
      fieldComponents: {
        ItemCount: fieldComponent.strict()({
          component: ItemCount,
          replaceProperty: 'field',
        }),
      },
      formComponents: {},
    })

    function Component() {
      const form = useAppForm({
        defaultValues: { tags: ['a', 'b'], group: { tags: ['c'] } },
      })

      return (
        <>
          <form.ArrayField name="tags">
            {(field) => (
              <>
                <field.ItemCount />
                <button type="button" onClick={() => field.pushValue('c')}>
                  Add
                </button>
              </>
            )}
          </form.ArrayField>
          <form.FormGroup name="group">
            {(group) => (
              <group.ArrayField name="tags">
                {(field) => <field.ItemCount />}
              </group.ArrayField>
            )}
          </form.FormGroup>
        </>
      )
    }

    const { getByText } = await render(<Component />)

    expect(getByText('Items: 2')).toBeInTheDocument()
    expect(getByText('Items: 1')).toBeInTheDocument()
    await getByText('Add').click()
    expect(getByText('Items: 3')).toBeInTheDocument()
  })

  it('supports nested field components alongside flat form components', async () => {
    function FieldValue({ field }: { field: FieldWithValue<string> }) {
      return <span>Field value: {field.value}</span>
    }

    function FormHeading() {
      return <h1>Form heading</h1>
    }

    const { fieldComponent } = getFormHookHelpers()
    const FieldValueWithContext = fieldComponent.strict()({
      component: FieldValue,
      replaceProperty: 'field',
    })
    const { useAppForm } = createFormHook({
      fieldComponents: {
        display: {
          values: {
            FieldValue: FieldValueWithContext,
          },
        },
      },
      formComponents: {
        FormHeading,
      },
    })

    function Component() {
      const form = useAppForm({ defaultValues: { name: 'Tony' } })

      return (
        <>
          <form.FormHeading />
          <form.Field name="name">
            {(field) => <field.display.values.FieldValue />}
          </form.Field>
        </>
      )
    }

    const { getByText } = await render(<Component />)

    expect(getByText('Form heading')).toBeInTheDocument()
    expect(getByText('Field value: Tony')).toBeInTheDocument()
  })

  it('supports destructuring registered form components', async () => {
    const SharedComponent = () => <span>Shared component</span>
    const { useAppForm } = createFormHook({
      fieldComponents: {},
      formComponents: { SharedComponent },
    })

    /* eslint-disable @eslint-react/static-components -- False positive, component's created once */
    function Component() {
      const form = useAppForm({ defaultValues: { name: '' } })
      const { SharedComponent: DestructuredComponent } = form

      return <DestructuredComponent />
    }
    /* eslint-enable @eslint-react/static-components */

    const { getByText } = await render(<Component />)

    expect(getByText('Shared component')).toBeInTheDocument()
  })

  it('merges default and local form and field listeners in the requested order', async () => {
    const formCalls: Array<string> = []
    const fieldCalls: Array<string> = []
    const { useAppForm } = createFormHook({
      fieldComponents: {},
      formComponents: {},
      defaultFormOptions: {
        listenersMerge: 'append',
        listeners: [
          {
            triggers: ['change'],
            run: () => formCalls.push('default'),
          },
        ],
      },
      defaultFieldOptions: {
        listenersMerge: 'prepend',
        listeners: [
          {
            triggers: ['change'],
            run: () => fieldCalls.push('default'),
          },
        ],
      },
    })

    function Component() {
      const form = useAppForm({
        defaultValues: { name: '' },
        listeners: [
          {
            triggers: ['change'],
            run: () => formCalls.push('local'),
          },
        ],
      })

      return (
        <form.Field
          name="name"
          listeners={[
            {
              triggers: ['change'],
              run: () => fieldCalls.push('local'),
            },
          ]}
        >
          {(field) => (
            <input
              aria-label="Name"
              value={field.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          )}
        </form.Field>
      )
    }

    const { getByRole } = await render(<Component />)
    await getByRole('textbox', { name: 'Name' }).fill('updated')

    expect(formCalls).toEqual(['default', 'local'])
    expect(fieldCalls).toEqual(['local', 'default'])
  })

  it('uses default form group options and permits all override forms', async () => {
    const defaultOnSubmitInvalid = vi.fn()
    const overriddenOnSubmitInvalid = vi.fn()
    const defaultValidator = vi.fn(() => 'invalid')
    const overriddenValidator = vi.fn(() => 'invalid')
    const undefinedValidator = vi.fn(() => 'invalid')
    const { useAppForm } = createFormHook({
      fieldComponents: {},
      formComponents: {},
      defaultFormGroupOptions: {
        onSubmitInvalid: defaultOnSubmitInvalid,
      },
    })

    function Component() {
      const form = useAppForm({
        defaultValues: {
          defaultGroup: { name: '' },
          overriddenGroup: { name: '' },
          undefinedGroup: { name: '' },
        },
      })

      return (
        <>
          <form.FormGroup
            name="defaultGroup"
            validators={[{ triggers: [], run: defaultValidator }]}
          >
            {(group) => (
              <button onClick={() => void group.handleSubmit()}>
                Submit default group
              </button>
            )}
          </form.FormGroup>
          <form.FormGroup
            name="overriddenGroup"
            validators={[{ triggers: [], run: overriddenValidator }]}
            onSubmitInvalid={overriddenOnSubmitInvalid}
          >
            {(group) => (
              <button onClick={() => void group.handleSubmit()}>
                Submit overridden group
              </button>
            )}
          </form.FormGroup>
          <form.FormGroup
            name="undefinedGroup"
            validators={[{ triggers: [], run: undefinedValidator }]}
            onSubmitInvalid={undefined}
          >
            {(group) => (
              <button onClick={() => void group.handleSubmit()}>
                Submit undefined group
              </button>
            )}
          </form.FormGroup>
        </>
      )
    }

    const { getByRole } = await render(<Component />)

    await getByRole('button', { name: 'Submit default group' }).click()
    await vi.waitFor(() =>
      expect(defaultOnSubmitInvalid).toHaveBeenCalledOnce(),
    )

    await getByRole('button', { name: 'Submit overridden group' }).click()
    await vi.waitFor(() =>
      expect(overriddenOnSubmitInvalid).toHaveBeenCalledOnce(),
    )
    expect(defaultOnSubmitInvalid).toHaveBeenCalledOnce()

    await getByRole('button', { name: 'Submit undefined group' }).click()
    await vi.waitFor(() => {
      expect(undefinedValidator).toHaveBeenCalledOnce()
      expect(defaultOnSubmitInvalid).toHaveBeenCalledOnce()
      expect(overriddenOnSubmitInvalid).toHaveBeenCalledOnce()
    })
  })
})

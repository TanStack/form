import { render } from 'vitest-browser-react'
import { describe, expect, it } from 'vitest'
import React, { useState } from 'react'
import { useForm } from '../src'

describe('useForm', () => {
  it('uses a supplied formId', async () => {
    function Component() {
      const form = useForm({
        formId: 'signup-form',
        defaultValues: { name: '' },
      })

      return <form id={form.formId} aria-label="Signup" />
    }

    const screen = await render(<Component />)

    expect(screen.getByRole('form', { name: 'Signup' })).toHaveAttribute(
      'id',
      'signup-form',
    )
  })

  it('creates a stable formId when one is not supplied', async () => {
    function Component() {
      const form = useForm({ defaultValues: { name: '' } })

      return <form id={form.formId} aria-label="Signup" />
    }

    const screen = await render(<Component />)
    const formElement = screen.getByRole('form', { name: 'Signup' })
    const formId = formElement.element().id

    expect(formId.length).toBeGreaterThan(0)

    await screen.rerender(<Component />)

    expect(formElement).toHaveAttribute('id', formId)
  })

  it('should support async defaultValues with useState', async () => {
    function Component() {
      const [defaultValues, setDefaultValues] = useState({ name: 'initial' })
      const form = useForm({ defaultValues })

      return (
        <>
          <form.Field name="name">
            {(field) => (
              <label>
                Name
                <input
                  value={field.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </label>
            )}
          </form.Field>
          <button onClick={() => setDefaultValues({ name: 'async-value' })}>
            Load defaults
          </button>
        </>
      )
    }

    const screen = await render(<Component />)
    const name = screen.getByRole('textbox', { name: 'Name' })

    expect(name).toHaveValue('initial')

    await screen.getByRole('button', { name: 'Load defaults' }).click()

    expect(name).toHaveValue('async-value')
  })

  it('should not overwrite a touched field with async defaultValues', async () => {
    function Component() {
      const [defaultValues, setDefaultValues] = useState({
        name: 'initial',
        age: 0,
      })
      const form = useForm({ defaultValues })

      return (
        <>
          <form.Field name="name">
            {(field) => (
              <label>
                Name
                <input
                  value={field.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </label>
            )}
          </form.Field>
          <form.Field name="age">
            {(field) => (
              <label>
                Age
                <input
                  type="number"
                  value={field.value}
                  onChange={(event) =>
                    field.handleChange(event.target.valueAsNumber)
                  }
                />
              </label>
            )}
          </form.Field>
          <button
            onClick={() => setDefaultValues({ name: 'new-default', age: 99 })}
          >
            Load defaults
          </button>
        </>
      )
    }

    const screen = await render(<Component />)
    const name = screen.getByRole('textbox', { name: 'Name' })
    const age = screen.getByRole('spinbutton', { name: 'Age' })

    expect(name).toHaveValue('initial')
    expect(age).toHaveValue(0)

    await name.fill('touched')

    expect(name).toHaveValue('touched')

    await screen.getByRole('button', { name: 'Load defaults' }).click()

    expect(name).toHaveValue('touched')
    expect(age).toHaveValue(99)
  })

  it('should overwrite field B if only field A was touched and B is not a child of A', async () => {
    function Component() {
      const [defaultValues, setDefaultValues] = useState({
        a: { nested: 'initial-a' },
        b: 'initial-b',
      })
      const form = useForm({ defaultValues })

      return (
        <>
          <form.Field name="a.nested">
            {(field) => (
              <label>
                Field A
                <input
                  value={field.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </label>
            )}
          </form.Field>
          <form.Field name="b">
            {(field) => (
              <label>
                Field B
                <input
                  value={field.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </label>
            )}
          </form.Field>
          <button
            onClick={() =>
              setDefaultValues({ a: { nested: 'new-a' }, b: 'new-b' })
            }
          >
            Load defaults
          </button>
        </>
      )
    }

    const screen = await render(<Component />)
    const fieldA = screen.getByRole('textbox', { name: 'Field A' })
    const fieldB = screen.getByRole('textbox', { name: 'Field B' })

    expect(fieldA).toHaveValue('initial-a')
    expect(fieldB).toHaveValue('initial-b')

    await fieldA.fill('touched-a')

    expect(fieldA).toHaveValue('touched-a')

    await screen.getByRole('button', { name: 'Load defaults' }).click()

    expect(fieldA).toHaveValue('touched-a')
    expect(fieldB).toHaveValue('new-b')
  })

  it('updates form.Subscribe selectors for isDefaultValue', async () => {
    function Component() {
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })

      return (
        <>
          <button onClick={() => form.setFieldValue('name', 'rodney-mullen')}>
            Change name
          </button>
          <button onClick={() => form.setFieldValue('name', 'tony-hawk')}>
            Restore name
          </button>
          <form.Subscribe selector={(state) => state.isDefaultValue}>
            {(isDefaultValue) => (
              <output data-testid="is-default-value">
                {String(isDefaultValue)}
              </output>
            )}
          </form.Subscribe>
        </>
      )
    }

    const screen = await render(<Component />)

    expect(screen.getByTestId('is-default-value')).toHaveTextContent('true')

    await screen.getByRole('button', { name: 'Change name' }).click()
    expect(screen.getByTestId('is-default-value')).toHaveTextContent('false')

    await screen.getByRole('button', { name: 'Restore name' }).click()
    expect(screen.getByTestId('is-default-value')).toHaveTextContent('true')
  })
})

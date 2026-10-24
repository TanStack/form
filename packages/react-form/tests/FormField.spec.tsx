import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import React, { useState } from 'react'
import { useForm } from '../src'

describe('Form fields', () => {
  it('does not repeat mount or unmount listeners during parent rerenders', async () => {
    const onMount = vi.fn()
    const onUnmount = vi.fn()

    function Component() {
      const [count, setCount] = useState(0)
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })

      return (
        <>
          <button onClick={() => setCount(count + 1)}>Rerender {count}</button>
          <form.Field
            name="name"
            listeners={[
              { triggers: ['mount'], run: onMount },
              { triggers: ['unmount'], run: onUnmount },
            ]}
          >
            {(field) => <span data-testid="name">{field.value}</span>}
          </form.Field>
        </>
      )
    }

    const screen = await render(<Component />)

    expect(screen.getByTestId('name')).toHaveTextContent('tony-hawk')
    expect(onMount.mock.calls.length - onUnmount.mock.calls.length).toBe(1)

    const initialMountCount = onMount.mock.calls.length
    const initialUnmountCount = onUnmount.mock.calls.length

    const rerender = screen.getByRole('button', { name: /Rerender/ })
    await rerender.click()

    expect(rerender).toHaveTextContent('Rerender 1')
    expect(onMount).toHaveBeenCalledTimes(initialMountCount)
    expect(onUnmount).toHaveBeenCalledTimes(initialUnmountCount)

    await screen.unmount()

    expect(onMount.mock.calls.length - onUnmount.mock.calls.length).toBe(0)
    expect(onUnmount).toHaveBeenCalledTimes(initialUnmountCount + 1)
  })

  it('should have the correct name and value', async () => {
    function Component() {
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })
      return (
        <form.Field name="name">
          {(field) => (
            <>
              <label htmlFor={field.name}>
                {field.name}
                <input
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            </>
          )}
        </form.Field>
      )
    }

    const screen = await render(<Component />)
    const input = screen.getByLabelText('name')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('tony-hawk')

    await input.clear()
    await userEvent.type(input, 'new-value')
    expect(input).toHaveValue('new-value')
  })

  it('rerenders an ArrayField when its own errors change', async () => {
    let renders = 0

    function Component() {
      const form = useForm({
        defaultValues: { items: [{ label: 'A' }] },
        errorVisibility: ({ state }) => state.submissionAttempts > 0,
      })

      return (
        <>
          <button onClick={() => form.handleSubmit()}>Submit</button>
          <form.ArrayField
            name="items"
            validators={[
              {
                triggers: [],
                run: ({ value }) =>
                  value.length < 2 ? 'Add another item' : undefined,
              },
            ]}
          >
            {(field) => {
              renders++
              return (
                <output data-testid="array">
                  {field.errors.map((error) => error.message).join(',')}
                </output>
              )
            }}
          </form.ArrayField>
          <form.Field
            name="items[0].label"
            validators={[
              {
                triggers: ['change'],
                run: async ({ value }) =>
                  value === 'AB' ? 'Too long' : undefined,
              },
            ]}
          >
            {(field) => (
              <>
                <input
                  aria-label="label"
                  value={field.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <span data-testid="label-error">
                  {field.meta.original.errors
                    .map((error) => error.message)
                    .join(',')}
                </span>
              </>
            )}
          </form.Field>
        </>
      )
    }

    const screen = await render(<Component />)
    const initialRenders = renders

    await userEvent.type(screen.getByLabelText('label'), 'B')

    await vi.waitFor(() =>
      expect(screen.getByTestId('label-error')).toHaveTextContent('Too long'),
    )
    expect(renders).toBe(initialRenders)

    await screen.getByRole('button', { name: 'Submit' }).click()

    await vi.waitFor(() =>
      expect(screen.getByTestId('array')).toHaveTextContent('Add another item'),
    )
  })

  it('should have the correct meta when changing the field', async () => {
    function Component() {
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })
      return (
        <form.Field name="name">
          {(field) => (
            <>
              <label htmlFor={field.name}>
                {field.name}
                <input
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
              <input
                type="checkbox"
                data-testid="isTouched"
                readOnly
                checked={field.meta.isTouched}
              />
              <input
                type="checkbox"
                data-testid="isDirty"
                readOnly
                checked={field.meta.isDirty}
              />
            </>
          )}
        </form.Field>
      )
    }

    const screen = await render(<Component />)
    const input = screen.getByLabelText('name')
    const isTouchedCheckbox = screen.getByTestId('isTouched')
    const isDirtyCheckbox = screen.getByTestId('isDirty')

    expect(isTouchedCheckbox).not.toBeChecked()
    expect(isDirtyCheckbox).not.toBeChecked()
    await userEvent.type(input, 'foo')
    expect(isTouchedCheckbox).toBeChecked()
    expect(isDirtyCheckbox).toBeChecked()
  })

  it('should update isDefaultValue when changing back to the default value', async () => {
    function Component() {
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })
      return (
        <form.Field name="name">
          {(field) => (
            <>
              <label htmlFor={field.name}>
                {field.name}
                <input
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
              <span data-testid="isDefaultValue">
                {String(field.meta.isDefaultValue)}
              </span>
              <span data-testid="isDirty">{String(field.meta.isDirty)}</span>
            </>
          )}
        </form.Field>
      )
    }

    const screen = await render(<Component />)
    const input = screen.getByLabelText('name')

    expect(screen.getByTestId('isDefaultValue')).toHaveTextContent('true')
    await input.clear()
    await userEvent.type(input, 'rodney-mullen')
    expect(screen.getByTestId('isDefaultValue')).toHaveTextContent('false')

    await input.clear()
    await userEvent.type(input, 'tony-hawk')
    expect(screen.getByTestId('isDefaultValue')).toHaveTextContent('true')
    expect(screen.getByTestId('isDirty')).toHaveTextContent('true')
  })

  it('should recreate mounted fields after form reset', async () => {
    function Component() {
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })
      return (
        <>
          <form.Field name="name">
            {(field) => (
              <label htmlFor={field.name}>
                {field.name}
                <input
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          </form.Field>
          <button onClick={() => form.reset()} data-testid="reset">
            Reset
          </button>
        </>
      )
    }

    const screen = await render(<Component />)
    const input = screen.getByLabelText('name')

    await input.clear()
    await userEvent.type(input, 'before-reset')
    expect(input).toHaveValue('before-reset')

    await screen.getByTestId('reset').click()
    expect(input).toHaveValue('tony-hawk')

    await input.clear()
    await userEvent.type(input, 'after-reset')
    expect(input).toHaveValue('after-reset')
  })
})

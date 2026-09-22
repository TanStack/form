import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import React, { useEffect, useState } from 'react'
import { useForm } from '../src'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'

describe('Form fields', () => {
  it('should mount the field to the dom', async () => {
    function Component() {
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })
      return (
        <form.Field name="name">
          {(field) => <span data-testid="name">{field.value}</span>}
        </form.Field>
      )
    }

    const screen = await render(<Component />)
    const input = screen.getByTestId('name')

    expect(input).toHaveTextContent('tony-hawk')
  })

  it('does not re-register fields during unrelated parent rerenders', async () => {
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

  it('rerenders an ArrayField for a same-length replacement', async () => {
    let renders = 0

    function Component() {
      const form = useForm({
        defaultValues: { items: [{ label: 'A' }] },
      })

      return (
        <>
          <button onClick={() => form.setFieldValue('items', [{ label: 'B' }])}>
            Replace array
          </button>
          <button onClick={() => form.setFieldValue('items[0].label', 'C')}>
            Update child
          </button>
          <form.ArrayField name="items">
            {(field) => {
              renders++
              return (
                <output data-testid="array">{field.value[0]!.label}</output>
              )
            }}
          </form.ArrayField>
        </>
      )
    }

    const screen = await render(<Component />)
    const initialRenders = renders

    await screen.getByRole('button', { name: 'Replace array' }).click()

    expect(screen.getByTestId('array')).toHaveTextContent('B')
    expect(renders).toBeGreaterThan(initialRenders)

    const replacementRenders = renders

    await screen.getByRole('button', { name: 'Update child' }).click()

    expect(renders).toBe(replacementRenders)
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

  it('does not rerender unchanged field render props when another field changes', async () => {
    const renderCounts = {
      first: 0,
      middle: 0,
      last: 0,
    }

    function Component() {
      const form = useForm({
        defaultValues: {
          first: 'first',
          middle: 'middle',
          last: 'last',
        },
      })

      return (
        <>
          <form.Field name="first">
            {(field) => {
              renderCounts.first++
              return (
                <label htmlFor={field.name}>
                  {field.name}
                  <input
                    id={field.name}
                    value={field.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </label>
              )
            }}
          </form.Field>
          <form.Field name="middle">
            {(field) => {
              renderCounts.middle++
              return (
                <label htmlFor={field.name}>
                  {field.name}
                  <input
                    id={field.name}
                    value={field.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </label>
              )
            }}
          </form.Field>
          <form.Field name="last">
            {(field) => {
              renderCounts.last++
              return (
                <label htmlFor={field.name}>
                  {field.name}
                  <input
                    id={field.name}
                    value={field.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </label>
              )
            }}
          </form.Field>
        </>
      )
    }

    const screen = await render(<Component />)
    const initialCounts = { ...renderCounts }
    const middleInput = screen.getByLabelText('middle')

    await middleInput.fill('updated')

    expect(middleInput).toHaveValue('updated')
    expect(renderCounts.first).toBe(initialCounts.first)
    expect(renderCounts.last).toBe(initialCounts.last)
    expect(renderCounts.middle).toBeGreaterThan(initialCounts.middle)
  })

  it('rerenders a field when its meta changes without changing its value', async () => {
    const renderCounts = {
      first: 0,
      last: 0,
    }

    function Component() {
      const form = useForm({
        defaultValues: {
          first: 'first',
          last: 'last',
        },
      })

      return (
        <>
          <form.Field name="first">
            {(field) => {
              renderCounts.first++
              return (
                <>
                  <label htmlFor={field.name}>
                    {field.name}
                    <input
                      id={field.name}
                      value={field.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                  </label>
                  <span data-testid="first-blurred">
                    {String(field.meta.isBlurred)}
                  </span>
                </>
              )
            }}
          </form.Field>
          <form.Field name="last">
            {(field) => {
              renderCounts.last++
              return (
                <label htmlFor={field.name}>
                  {field.name}
                  <input
                    id={field.name}
                    value={field.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </label>
              )
            }}
          </form.Field>
        </>
      )
    }

    const screen = await render(<Component />)
    const initialCounts = { ...renderCounts }

    const firstInput = screen.getByLabelText('first')
    await firstInput.click()
    firstInput.element().blur()

    await expect
      .element(screen.getByTestId('first-blurred'))
      .toHaveTextContent('true')
    expect(renderCounts.first).toBeGreaterThan(initialCounts.first)
    expect(renderCounts.last).toBe(initialCounts.last)
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

  it('should remove unused field nodes', async () => {
    const formApi = { current: null as AnyInternalFormApi | null }

    function Component() {
      const [show, setShow] = useState(true)
      const form = useForm({ defaultValues: { foo: { bar: 'Value' } } })

      useEffect(() => {
        formApi.current = form as never
      })

      return (
        <>
          {show && (
            <form.Field name="foo.bar">
              {({ value }) => <span data-testid="field">{value}</span>}
            </form.Field>
          )}
          <button onClick={() => setShow(false)} data-testid="off">
            Turn off
          </button>
        </>
      )
    }

    const screen = await render(<Component />)
    const field = screen.getByTestId('field')

    expect(field).toBeInTheDocument()
    // Field exists before unmount
    expect(formApi.current?._tryGetFieldApi('foo.bar')).not.toBeNull()

    await screen.getByTestId('off').click()

    await expect.element(field).not.toBeInTheDocument()
    await vi.waitFor(
      () => {
        expect(formApi.current?._tryGetFieldApi('foo.bar')).toBeNull()
      },
      { interval: 50, timeout: 500 },
    )
  })
})

import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/preact'
import Preact, { useEffect, useState } from 'preact/compat'
import { userEvent } from '@testing-library/user-event'
import { useForm } from '../src'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'

const user = userEvent.setup()

describe('Form fields', () => {
  it('should mount the field to the dom', () => {
    function Component() {
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })
      return (
        <form.Field name="name">
          {(field) => <span data-testid="name">{field.value}</span>}
        </form.Field>
      )
    }

    const { getByTestId } = render(<Component />)
    const input = getByTestId('name')

    expect(input).toHaveTextContent('tony-hawk')
  })

  it('does not re-register fields during unrelated parent rerenders', () => {
    const onMount = vi.fn()
    const onUnmount = vi.fn()

    function Component() {
      const [count, setCount] = useState(0)
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })

      return (
        <>
          <button data-testid="rerender" onClick={() => setCount(count + 1)}>
            {count}
          </button>
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

    const { getByTestId, unmount } = render(<Component />)

    expect(getByTestId('name')).toHaveTextContent('tony-hawk')
    expect(onMount.mock.calls.length - onUnmount.mock.calls.length).toBe(1)

    const initialMountCount = onMount.mock.calls.length
    const initialUnmountCount = onUnmount.mock.calls.length

    fireEvent.click(getByTestId('rerender'))

    expect(getByTestId('rerender')).toHaveTextContent('1')
    expect(onMount).toHaveBeenCalledTimes(initialMountCount)
    expect(onUnmount).toHaveBeenCalledTimes(initialUnmountCount)

    unmount()

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
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
                />
              </label>
            </>
          )}
        </form.Field>
      )
    }

    const { getByLabelText } = render(<Component />)
    const input = getByLabelText('name')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('tony-hawk')

    await user.clear(input)
    await user.type(input, 'new-value')
    expect(input).toHaveValue('new-value')
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
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
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

    const { getByLabelText, getByTestId } = render(<Component />)
    const input = getByLabelText('name')
    const isTouchedCheckbox = getByTestId('isTouched')
    const isDirtyCheckbox = getByTestId('isDirty')

    expect(isTouchedCheckbox).not.toBeChecked()
    expect(isDirtyCheckbox).not.toBeChecked()
    await user.type(input, 'foo')
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
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
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

    const { getByLabelText, getByTestId } = render(<Component />)
    const input = getByLabelText('name')

    expect(getByTestId('isDefaultValue')).toHaveTextContent('true')
    await user.clear(input)
    await user.type(input, 'rodney-mullen')
    expect(getByTestId('isDefaultValue')).toHaveTextContent('false')

    await user.clear(input)
    await user.type(input, 'tony-hawk')
    expect(getByTestId('isDefaultValue')).toHaveTextContent('true')
    expect(getByTestId('isDirty')).toHaveTextContent('true')
  })

  it('does not rerender unchanged field render props when another field changes', () => {
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
                    onChange={(event) =>
                      field.handleChange(event.currentTarget.value)
                    }
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
                    onChange={(event) =>
                      field.handleChange(event.currentTarget.value)
                    }
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
                    onChange={(event) =>
                      field.handleChange(event.currentTarget.value)
                    }
                  />
                </label>
              )
            }}
          </form.Field>
        </>
      )
    }

    const { getByLabelText } = render(<Component />)
    const initialCounts = { ...renderCounts }
    const middleInput = getByLabelText('middle')

    fireEvent.change(middleInput, { target: { value: 'updated' } })

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
                        field.handleChange(event.currentTarget.value)
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
                    onChange={(event) =>
                      field.handleChange(event.currentTarget.value)
                    }
                  />
                </label>
              )
            }}
          </form.Field>
        </>
      )
    }

    const { getByLabelText, getByTestId } = render(<Component />)
    const initialCounts = { ...renderCounts }

    const firstInput = getByLabelText('first')
    await user.click(firstInput)
    await user.click(document.body)

    expect(getByTestId('first-blurred')).toHaveTextContent('true')
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
                  onChange={(e) => field.handleChange(e.currentTarget.value)}
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

    const { getByLabelText, getByTestId } = render(<Component />)
    const input = getByLabelText('name')

    await user.clear(input)
    await user.type(input, 'before-reset')
    expect(input).toHaveValue('before-reset')

    await user.click(getByTestId('reset'))
    expect(input).toHaveValue('tony-hawk')

    await user.clear(input)
    await user.type(input, 'after-reset')
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

    const { getByTestId } = render(<Component />)
    const field = getByTestId('field')

    expect(field).toBeInTheDocument()
    // Field exists before unmount
    expect(formApi.current?._tryGetFieldApi('foo.bar')).not.toBeNull()

    await user.click(getByTestId('off'))

    expect(field).not.toBeInTheDocument()
    await vi.waitFor(
      () => {
        expect(formApi.current?._tryGetFieldApi('foo.bar')).toBeNull()
      },
      { interval: 50, timeout: 500 },
    )
  })
})

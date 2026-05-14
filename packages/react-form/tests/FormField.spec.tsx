import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import React, { useEffect, useState } from 'react'
import { userEvent } from '@testing-library/user-event'
import { useForm } from '../src'
import type { AnyInternalFormApi } from '@tanstack/form-core-v2/internals'

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

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/preact'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Preact, { useState } from 'preact/compat'
import { useForm } from '../src'

describe('useForm', () => {
  it('should mount the form to the dom', () => {
    function Component() {
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })

      return (
        <form.Field name="name">
          {(field) => (
            <label>
              Name
              <input
                value={field.value}
                onChange={(event) =>
                  field.handleChange(event.currentTarget.value)
                }
              />
            </label>
          )}
        </form.Field>
      )
    }

    render(<Component />)

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(
      'tony-hawk',
    )
  })

  it('uses a supplied formId', () => {
    function Component() {
      const form = useForm({
        formId: 'signup-form',
        defaultValues: { name: '' },
      })

      return <form id={form.formId} aria-label="Signup" />
    }

    render(<Component />)

    expect(screen.getByRole('form', { name: 'Signup' })).toHaveAttribute(
      'id',
      'signup-form',
    )
  })

  it('creates a stable formId when one is not supplied', () => {
    function Component() {
      const form = useForm({ defaultValues: { name: '' } })

      return <form id={form.formId} aria-label="Signup" />
    }

    const { rerender } = render(<Component />)
    const formId = screen.getByRole('form', { name: 'Signup' }).id

    expect(formId.length).toBeGreaterThan(0)

    rerender(<Component />)

    expect(screen.getByRole('form', { name: 'Signup' })).toHaveAttribute(
      'id',
      formId,
    )
  })

  it('should support async defaultValues with useState', async () => {
    const user = userEvent.setup()

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
                  onChange={(event) =>
                    field.handleChange(event.currentTarget.value)
                  }
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

    render(<Component />)

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('initial')

    await user.click(screen.getByRole('button', { name: 'Load defaults' }))

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(
        'async-value',
      )
    })
  })

  it('should not overwrite a touched field with async defaultValues', async () => {
    const user = userEvent.setup()

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
                  onChange={(event) =>
                    field.handleChange(event.currentTarget.value)
                  }
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
                    field.handleChange(event.currentTarget.valueAsNumber)
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

    render(<Component />)

    const name = screen.getByRole('textbox', { name: 'Name' })
    expect(name).toHaveValue('initial')
    expect(screen.getByRole('spinbutton', { name: 'Age' })).toHaveValue(0)

    await user.clear(name)
    await user.type(name, 'touched')
    expect(name).toHaveValue('touched')

    await user.click(screen.getByRole('button', { name: 'Load defaults' }))

    await waitFor(() => {
      expect(name).toHaveValue('touched')
      expect(screen.getByRole('spinbutton', { name: 'Age' })).toHaveValue(99)
    })
  })

  it('should overwrite field B if only field A was touched and B is not a child of A', async () => {
    const user = userEvent.setup()

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
                  onChange={(event) =>
                    field.handleChange(event.currentTarget.value)
                  }
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
                  onChange={(event) =>
                    field.handleChange(event.currentTarget.value)
                  }
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

    render(<Component />)

    const fieldA = screen.getByRole('textbox', { name: 'Field A' })
    expect(fieldA).toHaveValue('initial-a')
    expect(screen.getByRole('textbox', { name: 'Field B' })).toHaveValue(
      'initial-b',
    )

    await user.clear(fieldA)
    await user.type(fieldA, 'touched-a')
    expect(fieldA).toHaveValue('touched-a')

    await user.click(screen.getByRole('button', { name: 'Load defaults' }))

    await waitFor(() => {
      expect(fieldA).toHaveValue('touched-a')
      expect(screen.getByRole('textbox', { name: 'Field B' })).toHaveValue(
        'new-b',
      )
    })
  })

  it('does not render with pre-validation state for synchronous runOnMount validation', () => {
    const renderStates: Array<{
      errors: Array<string>
      isValid: boolean
      canSubmit: boolean
    }> = []

    function Component() {
      const form = useForm({
        defaultValues: { name: '' },
        validators: [
          {
            runOnMount: true,
            triggers: [],
            run: () => 'Name is required',
          },
        ],
      })

      return (
        <form.Subscribe
          selector={(state) => ({
            errors: state.errors.map((error) => error.message),
            isValid: state.isValid,
            canSubmit: state.canSubmit,
          })}
        >
          {(state) => {
            renderStates.push(state)
            return (
              <output data-testid="form-state">
                {state.errors.join(',')}|{String(state.isValid)}|
                {String(state.canSubmit)}
              </output>
            )
          }}
        </form.Subscribe>
      )
    }

    render(<Component />)

    expect(screen.getByTestId('form-state')).toHaveTextContent(
      'Name is required|false|false',
    )
    expect(renderStates.length).toBeGreaterThan(0)
    for (const state of renderStates) {
      expect(state).toEqual({
        errors: ['Name is required'],
        isValid: false,
        canSubmit: false,
      })
    }
  })

  it('updates form.Subscribe selectors for isDefaultValue', () => {
    function Component() {
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })

      return (
        <>
          <button
            data-testid="change"
            onClick={() => form.setFieldValue('name', 'rodney-mullen')}
          />
          <button
            data-testid="restore"
            onClick={() => form.setFieldValue('name', 'tony-hawk')}
          />
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

    render(<Component />)

    expect(screen.getByTestId('is-default-value')).toHaveTextContent('true')

    fireEvent.click(screen.getByTestId('change'))
    expect(screen.getByTestId('is-default-value')).toHaveTextContent('false')

    fireEvent.click(screen.getByTestId('restore'))
    expect(screen.getByTestId('is-default-value')).toHaveTextContent('true')
  })

  it('does not crash when asynchronous runOnMount validation resolves after unmount', async () => {
    let resolveValidation!: (value: string) => void
    const validator = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveValidation = resolve
        }),
    )

    function Component() {
      const form = useForm({
        defaultValues: { name: '' },
        validators: [
          {
            runOnMount: true,
            triggers: [],
            run: validator,
          },
        ],
      })

      return (
        <form.Subscribe selector={(state) => state.isValidating}>
          {(isValidating) => (
            <output data-testid="is-validating">{String(isValidating)}</output>
          )}
        </form.Subscribe>
      )
    }

    const { unmount } = render(<Component />)

    expect(validator).toHaveBeenCalledOnce()
    expect(screen.getByTestId('is-validating')).toHaveTextContent('true')

    unmount()

    await expect(
      act(async () => {
        resolveValidation('Async mount error')
        await Promise.resolve()
      }),
    ).resolves.toBeUndefined()
  })
})

import { render } from 'vitest-browser-preact'
import { describe, expect, it, vi } from 'vitest'
import { useState } from 'preact/compat'
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

    const screen = render(<Component />)

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

    const screen = render(<Component />)

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

    const screen = render(<Component />)
    const formElement = screen.getByRole('form', { name: 'Signup' })
    const formId = formElement.element().id

    expect(formId.length).toBeGreaterThan(0)

    screen.rerender(<Component />)

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

    const screen = render(<Component />)
    const name = screen.getByRole('textbox', { name: 'Name' })

    await expect.element(name).toHaveValue('initial')

    await screen.getByRole('button', { name: 'Load defaults' }).click()

    await expect.element(name).toHaveValue('async-value')
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

    const screen = render(<Component />)
    const name = screen.getByRole('textbox', { name: 'Name' })
    const age = screen.getByRole('spinbutton', { name: 'Age' })

    await expect.element(name).toHaveValue('initial')
    await expect.element(age).toHaveValue(0)

    await name.fill('touched')

    await expect.element(name).toHaveValue('touched')

    await screen.getByRole('button', { name: 'Load defaults' }).click()

    await expect.element(age).toHaveValue(99)
    await expect.element(name).toHaveValue('touched')
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

    const screen = render(<Component />)
    const fieldA = screen.getByRole('textbox', { name: 'Field A' })
    const fieldB = screen.getByRole('textbox', { name: 'Field B' })

    await expect.element(fieldA).toHaveValue('initial-a')
    await expect.element(fieldB).toHaveValue('initial-b')

    await fieldA.fill('touched-a')

    await expect.element(fieldA).toHaveValue('touched-a')

    await screen.getByRole('button', { name: 'Load defaults' }).click()

    await expect.element(fieldB).toHaveValue('new-b')
    await expect.element(fieldA).toHaveValue('touched-a')
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

    const screen = render(<Component />)

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

    const screen = render(<Component />)

    await expect
      .element(screen.getByTestId('is-default-value'))
      .toHaveTextContent('true')

    await screen.getByRole('button', { name: 'Change name' }).click()
    await expect
      .element(screen.getByTestId('is-default-value'))
      .toHaveTextContent('false')

    await screen.getByRole('button', { name: 'Restore name' }).click()
    await expect
      .element(screen.getByTestId('is-default-value'))
      .toHaveTextContent('true')
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

    const screen = render(<Component />)

    expect(validator).toHaveBeenCalledOnce()
    await expect
      .element(screen.getByTestId('is-validating'))
      .toHaveTextContent('true')

    screen.unmount()

    await expect(
      (async () => {
        resolveValidation('Async mount error')
        await Promise.resolve()
      })(),
    ).resolves.toBeUndefined()
  })
})

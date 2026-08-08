import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/preact'
import { describe, expect, it, vi } from 'vitest'
import Preact, { useState } from 'preact/compat'
import { useForm } from '../src'

describe('useForm', () => {
  it('should mount the form to the dom', () => {
    const { result } = renderHook(() => {
      const form = useForm({ defaultValues: { name: 'tony-hawk' } })

      return form
    })

    expect(result.current.state.values).toEqual({ name: 'tony-hawk' })
  })

  it('uses a supplied formId', () => {
    const { result } = renderHook(() =>
      useForm({
        formId: 'signup-form',
        defaultValues: { name: '' },
      }),
    )

    expect(result.current.formId).toBe('signup-form')
  })

  it('creates a stable formId when one is not supplied', () => {
    const { result, rerender } = renderHook(() =>
      useForm({ defaultValues: { name: '' } }),
    )
    const formId = result.current.formId

    expect(formId).toBeTypeOf('string')
    expect(formId.length).toBeGreaterThan(0)

    rerender()

    expect(result.current.formId).toBe(formId)
  })

  it('should support async defaultValues with useState', () => {
    const { result } = renderHook(() => {
      const [defaultValues, setDefaultValues] = useState({ name: 'initial' })
      const form = useForm({ defaultValues })
      return { form, setDefaultValues }
    })

    expect(result.current.form.state.values).toEqual({ name: 'initial' })

    act(() => {
      result.current.setDefaultValues({ name: 'async-value' })
    })

    expect(result.current.form.state.values).toEqual({ name: 'async-value' })
  })

  it('should not overwrite a touched field with async defaultValues', () => {
    const { result } = renderHook(() => {
      const [defaultValues, setDefaultValues] = useState({
        name: 'initial',
        age: 0,
      })
      const form = useForm({ defaultValues })
      return { form, setDefaultValues }
    })

    // Touch the name field
    act(() => {
      result.current.form.setFieldValue('name', 'touched')
    })

    // Update defaultValues - name is touched so should NOT be overwritten
    act(() => {
      result.current.setDefaultValues({ name: 'new-default', age: 99 })
    })

    expect(result.current.form.state.values.name).toBe('touched')
    expect(result.current.form.state.values.age).toBe(99)
  })

  it('should overwrite field B if only field A was touched and B is not a child of A', async () => {
    const { result } = renderHook(() => {
      const [defaultValues, setDefaultValues] = useState({
        a: { nested: 'initial-a' },
        b: 'initial-b',
      })
      const form = useForm({ defaultValues })
      return { form, setDefaultValues }
    })

    // Touch field A
    act(() => {
      result.current.form.setFieldValue('a.nested', 'touched-a')
    })

    await vi.waitFor(() => {
      expect(result.current.form.state.values.a.nested).toBe('touched-a')
    })

    // Update defaultValues
    act(() => {
      result.current.setDefaultValues({
        a: { nested: 'new-a' },
        b: 'new-b',
      })
    })

    await vi.waitFor(() => {
      // A should keep its touched value, B should be overwritten
      expect(result.current.form.state.values.a.nested).toBe('touched-a')
      expect(result.current.form.state.values.b).toBe('new-b')
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

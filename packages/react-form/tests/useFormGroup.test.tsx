import { describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useForm } from '../src/index'

const user = userEvent.setup()

describe('form.FormGroup', () => {
  it('should call onGroupSubmit but not the form onSubmit when submitting the group', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()

    function Comp() {
      const form = useForm({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
        onSubmit,
      })

      return (
        <form.FormGroup name="step1" onGroupSubmit={onGroupSubmit}>
          {(group) => (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                group.handleSubmit()
              }}
            >
              <form.Field
                name="step1.name"
                children={(field) => (
                  <input
                    data-testid="step1-name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              />
              <button type="submit" data-testid="submit-group">
                Submit Group
              </button>
            </form>
          )}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Comp />)
    await user.click(getByTestId('submit-group'))

    await waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should expose group state value reactively', async () => {
    function Comp() {
      const form = useForm({
        defaultValues: {
          step1: { name: 'initial' },
          step2: { name: 'other' },
        },
      })

      return (
        <form.FormGroup name="step1">
          {(group) => (
            <>
              <form.Field
                name="step1.name"
                children={(field) => (
                  <input
                    data-testid="step1-name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              />
              <pre data-testid="group-value">
                {JSON.stringify(group.state.value)}
              </pre>
            </>
          )}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Comp />)
    expect(getByTestId('group-value').textContent).toBe('{"name":"initial"}')

    await user.clear(getByTestId('step1-name'))
    await user.type(getByTestId('step1-name'), 'updated')

    await waitFor(() =>
      expect(getByTestId('group-value').textContent).toBe('{"name":"updated"}'),
    )
  })

  it('should call onGroupSubmitInvalid when group-level validation fails', async () => {
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    function Comp() {
      const form = useForm({
        defaultValues: {
          step1: { name: '' },
          step2: { name: 'test2' },
        },
        onSubmit,
      })

      return (
        <form.FormGroup
          name="step1"
          validators={{
            onSubmit: ({ value }) =>
              !value.name ? 'Name is required' : undefined,
          }}
          onGroupSubmit={onGroupSubmit}
          onGroupSubmitInvalid={onGroupSubmitInvalid}
        >
          {(group) => (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                group.handleSubmit()
              }}
            >
              <form.Field
                name="step1.name"
                children={(field) => (
                  <input
                    data-testid="step1-name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              />
              <button type="submit" data-testid="submit-group">
                Submit Group
              </button>
              <pre data-testid="group-error">
                {String(group.state.meta.errorMap.onSubmit ?? '')}
              </pre>
            </form>
          )}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Comp />)
    await user.click(getByTestId('submit-group'))

    await waitFor(() => expect(onGroupSubmitInvalid).toHaveBeenCalledTimes(1))
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    await waitFor(() =>
      expect(getByTestId('group-error').textContent).toBe('Name is required'),
    )
  })

  it('should ignore form-level field errors outside the group when submitting the group', async () => {
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    function Comp() {
      const form = useForm({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
        validators: {
          onSubmit: () => ({
            fields: {
              'step2.name': 'Required',
            },
          }),
        },
      })

      return (
        <form.FormGroup
          name="step1"
          onGroupSubmit={onGroupSubmit}
          onGroupSubmitInvalid={onGroupSubmitInvalid}
        >
          {(group) => (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                group.handleSubmit()
              }}
            >
              <form.Field
                name="step1.name"
                children={(field) => (
                  <input
                    data-testid="step1-name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                )}
              />
              <button type="submit" data-testid="submit-group">
                Submit Group
              </button>
            </form>
          )}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Comp />)
    await user.click(getByTestId('submit-group'))

    await waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onGroupSubmitInvalid).not.toHaveBeenCalled()
  })

  it('should pass submit meta through handleSubmit', async () => {
    const onGroupSubmit = vi.fn()

    function Comp() {
      const form = useForm({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      })

      return (
        <form.FormGroup
          name="step1"
          onGroupSubmit={onGroupSubmit}
          onSubmitMeta={{} as { source: string }}
        >
          {(group) => (
            <button
              type="button"
              data-testid="submit-group"
              onClick={() => group.handleSubmit({ source: 'button' })}
            >
              Submit Group
            </button>
          )}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Comp />)
    await user.click(getByTestId('submit-group'))

    await waitFor(() => expect(onGroupSubmit).toHaveBeenCalledTimes(1))
    expect(onGroupSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        value: { name: 'test' },
        meta: { source: 'button' },
      }),
    )
  })

  it('should rerender group.state.meta.isSubmitting during an async submit', async () => {
    let resolveSubmit!: () => void
    const onGroupSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve
        }),
    )

    function Comp() {
      const form = useForm({
        defaultValues: {
          step1: { name: 'test' },
          step2: { name: 'test2' },
        },
      })

      return (
        <form.FormGroup name="step1" onGroupSubmit={onGroupSubmit}>
          {(group) => (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void group.handleSubmit()
              }}
            >
              <button
                type="submit"
                data-testid="submit-group"
                disabled={group.state.meta.isSubmitting}
              >
                {group.state.meta.isSubmitting ? 'Saving...' : 'Continue'}
              </button>
            </form>
          )}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Comp />)
    const button = getByTestId('submit-group') as HTMLButtonElement
    expect(button.textContent).toBe('Continue')
    expect(button.disabled).toBe(false)

    await user.click(button)

    await waitFor(() => expect(button.textContent).toBe('Saving...'))
    expect(button.disabled).toBe(true)

    resolveSubmit()

    await waitFor(() => expect(button.textContent).toBe('Continue'))
    expect(button.disabled).toBe(false)
    expect(onGroupSubmit).toHaveBeenCalledTimes(1)
  })
})

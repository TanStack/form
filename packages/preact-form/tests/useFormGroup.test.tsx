import { describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/preact'
import { userEvent } from '@testing-library/user-event'
import { useState } from 'preact/hooks'
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
                    onInput={(e) => field.handleChange(e.currentTarget.value)}
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
                    onInput={(e) => field.handleChange(e.currentTarget.value)}
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
                    onInput={(e) => field.handleChange(e.currentTarget.value)}
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
                    onInput={(e) => field.handleChange(e.currentTarget.value)}
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

  it('should not rerender group children when a field changes and group state is not read', async () => {
    const renderGroupChildren = vi.fn()

    function Comp() {
      const form = useForm({
        defaultValues: {
          step1: { firstName: '', lastName: '' },
        },
      })

      return (
        <form.FormGroup name="step1">
          {() => {
            renderGroupChildren()
            return (
              <form.Field
                name="step1.firstName"
                children={(field) => (
                  <input
                    data-testid="first-name"
                    value={field.state.value}
                    onInput={(e) => field.handleChange(e.currentTarget.value)}
                  />
                )}
              />
            )
          }}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Comp />)
    const rendersAfterMount = renderGroupChildren.mock.calls.length

    await user.type(getByTestId('first-name'), 'abc')

    expect(getByTestId('first-name')).toHaveValue('abc')
    expect(renderGroupChildren).toHaveBeenCalledTimes(rendersAfterMount)
  })

  it('should rerender for group meta it reads but not for unrelated value changes', async () => {
    const renderGroupChildren = vi.fn()

    function Comp() {
      const form = useForm({
        defaultValues: {
          step1: { firstName: '' },
        },
      })

      return (
        <form.FormGroup
          name="step1"
          validators={{
            onChange: ({ value }) =>
              value.firstName.includes('!')
                ? 'No exclamation marks'
                : undefined,
          }}
        >
          {(group) => {
            renderGroupChildren()
            return (
              <>
                <form.Field
                  name="step1.firstName"
                  children={(field) => (
                    <input
                      data-testid="first-name"
                      value={field.state.value}
                      onInput={(e) => field.handleChange(e.currentTarget.value)}
                    />
                  )}
                />
                <pre data-testid="group-errors">
                  {JSON.stringify(group.state.meta.errorMap)}
                </pre>
              </>
            )
          }}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Comp />)
    const rendersAfterMount = renderGroupChildren.mock.calls.length

    await user.type(getByTestId('first-name'), 'abc')
    expect(renderGroupChildren).toHaveBeenCalledTimes(rendersAfterMount)

    await user.type(getByTestId('first-name'), '!')
    await waitFor(() =>
      expect(getByTestId('group-errors')).toHaveTextContent(
        'No exclamation marks',
      ),
    )
  })

  it('should read the current group value in handlers without subscribing up front', async () => {
    const onRead = vi.fn()

    function Comp() {
      const form = useForm({
        defaultValues: {
          step1: { firstName: '' },
        },
      })

      return (
        <form.FormGroup name="step1">
          {(group) => (
            <>
              <form.Field
                name="step1.firstName"
                children={(field) => (
                  <input
                    data-testid="first-name"
                    value={field.state.value}
                    onInput={(e) => field.handleChange(e.currentTarget.value)}
                  />
                )}
              />
              <button
                data-testid="read-value"
                onClick={() => onRead(group.state.value)}
              />
            </>
          )}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Comp />)

    await user.type(getByTestId('first-name'), 'abc')
    await user.click(getByTestId('read-value'))

    expect(onRead).toHaveBeenCalledWith({ firstName: 'abc' })
  })

  it('should expose the group store state through group.state', async () => {
    const onRead = vi.fn()

    function Comp() {
      const form = useForm({
        defaultValues: {
          step1: { firstName: 'initial' },
        },
      })

      return (
        <form.FormGroup name="step1">
          {(group) => (
            <button data-testid="read-state" onClick={() => onRead(group)} />
          )}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Comp />)
    await user.click(getByTestId('read-state'))

    const group = onRead.mock.calls[0]![0]
    expect(group.state).toEqual(group.store.state)
    expect(group.state.meta).toEqual(group.store.state.meta)
    expect(structuredClone(group.state)).toEqual(group.store.state)
  })

  it('should update group meta that is first read after it changed', async () => {
    function Comp() {
      const form = useForm({
        defaultValues: {
          step1: { firstName: '' },
        },
      })
      const [showValidity, setShowValidity] = useState(false)

      return (
        <>
          <button
            data-testid="show-validity"
            onClick={() => setShowValidity(true)}
          />
          <form.FormGroup
            name="step1"
            validators={{
              onChange: ({ value }) =>
                value.firstName.includes('!')
                  ? 'No exclamation marks'
                  : undefined,
            }}
          >
            {(group) => (
              <>
                <form.Field
                  name="step1.firstName"
                  children={(field) => (
                    <input
                      data-testid="first-name"
                      value={field.state.value}
                      onInput={(e) => field.handleChange(e.currentTarget.value)}
                    />
                  )}
                />
                {showValidity && (
                  <span data-testid="group-valid">
                    {String(group.state.meta.isValid)}
                  </span>
                )}
              </>
            )}
          </form.FormGroup>
        </>
      )
    }

    const { getByTestId } = render(<Comp />)

    await user.type(getByTestId('first-name'), '!')
    await user.click(getByTestId('show-validity'))
    expect(getByTestId('group-valid')).toHaveTextContent('false')

    await user.clear(getByTestId('first-name'))
    await waitFor(() =>
      expect(getByTestId('group-valid')).toHaveTextContent('true'),
    )
  })

  it('should rerender for group meta read in a handler right after changing it', async () => {
    const onRead = vi.fn()

    function Comp() {
      const form = useForm({
        defaultValues: {
          step1: { firstName: '' },
        },
      })

      return (
        <form.FormGroup
          name="step1"
          validators={{
            onChange: ({ value }) =>
              value.firstName.includes('!')
                ? 'No exclamation marks'
                : undefined,
          }}
        >
          {(group) => (
            <>
              <form.Field
                name="step1.firstName"
                children={(field) => (
                  <button
                    data-testid="invalidate"
                    onClick={() => {
                      field.handleChange('!')
                      onRead(group.state.meta.isValid)
                    }}
                  />
                )}
              />
              <span data-testid="group-valid">
                {String(group.state.meta.isValid)}
              </span>
            </>
          )}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Comp />)
    expect(getByTestId('group-valid')).toHaveTextContent('true')

    await user.click(getByTestId('invalidate'))

    expect(onRead).toHaveBeenCalledWith(false)
    await waitFor(() =>
      expect(getByTestId('group-valid')).toHaveTextContent('false'),
    )
  })

  it('should rerender for group meta first read by an independently rerendering child', async () => {
    function GroupValidity({ readIsValid }: { readIsValid: () => boolean }) {
      const [showValidity, setShowValidity] = useState(false)

      return (
        <>
          <button
            data-testid="show-validity"
            onClick={() => setShowValidity(true)}
          />
          {showValidity && (
            <span data-testid="group-valid">{String(readIsValid())}</span>
          )}
        </>
      )
    }

    function Comp() {
      const form = useForm({
        defaultValues: {
          step1: { firstName: '' },
        },
      })

      return (
        <form.FormGroup
          name="step1"
          validators={{
            onChange: ({ value }) =>
              value.firstName.includes('!')
                ? 'No exclamation marks'
                : undefined,
          }}
        >
          {(group) => (
            <>
              <form.Field
                name="step1.firstName"
                children={(field) => (
                  <input
                    data-testid="first-name"
                    value={field.state.value}
                    onInput={(e) => field.handleChange(e.currentTarget.value)}
                  />
                )}
              />
              <GroupValidity readIsValid={() => group.state.meta.isValid} />
            </>
          )}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Comp />)

    await user.click(getByTestId('show-validity'))
    expect(getByTestId('group-valid')).toHaveTextContent('true')

    await user.type(getByTestId('first-name'), '!')
    await waitFor(() =>
      expect(getByTestId('group-valid')).toHaveTextContent('false'),
    )
  })
})

import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React, { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useForm } from '../src'
import { FormGroup } from '../src/form-group'

const user = userEvent.setup()

describe('Form groups', () => {
  it('renders a group with descendant fields and updates its value', async () => {
    function Component() {
      const form = useForm({ defaultValues: { step: { name: 'Alice' } } })

      return (
        <FormGroup form={form} name="step">
          {(group) => (
            <>
              <group.Subscribe selector={(state) => state.value.name}>
                {(name) => <span data-testid="group-value">{name}</span>}
              </group.Subscribe>
              <form.Field name="step.name">
                {(field) => (
                  <input
                    aria-label="Name"
                    value={field.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                )}
              </form.Field>
            </>
          )}
        </FormGroup>
      )
    }

    const { getByLabelText, getByTestId } = render(<Component />)

    expect(getByTestId('group-value')).toHaveTextContent('Alice')

    await user.clear(getByLabelText('Name'))
    await user.type(getByLabelText('Name'), 'Bob')

    expect(getByTestId('group-value')).toHaveTextContent('Bob')
  })

  it('submits a group and re-renders its errors', async () => {
    function Component() {
      const form = useForm({ defaultValues: { step: { name: '' } } })

      return (
        <FormGroup
          form={form}
          name="step"
          validators={[
            {
              triggers: [],
              run: ({ value }) =>
                value.name ? undefined : { message: 'Name is required' },
            },
          ]}
        >
          {(group) => (
            <>
              <form.Field name="step.name">
                {(field) => (
                  <input aria-label="Name" value={field.value} readOnly />
                )}
              </form.Field>
              <button type="button" onClick={() => group.handleSubmit()}>
                Continue
              </button>
              <group.Subscribe selector={(state) => state.errors[0]?.message}>
                {(message) => (
                  <span data-testid="group-error">{message ?? ''}</span>
                )}
              </group.Subscribe>
            </>
          )}
        </FormGroup>
      )
    }

    const { getByRole, getByTestId } = render(<Component />)

    await user.click(getByRole('button', { name: 'Continue' }))

    expect(getByTestId('group-error')).toHaveTextContent('Name is required')
  })

  it('renders descendant errors and advances a step after a valid group submit', async () => {
    const onGroupSubmit = vi.fn()
    const onGroupSubmitInvalid = vi.fn()

    function Component() {
      const [showNextStep, setShowNextStep] = useState(false)
      const form = useForm({
        defaultValues: {
          guestDetails: { name: '' },
          specialRequests: { notes: '' },
        },
      })

      if (showNextStep) {
        return <span>Special requests</span>
      }

      return (
        <FormGroup
          form={form}
          name="guestDetails"
          validators={[
            {
              triggers: [],
              run: ({ value }) =>
                value.name
                  ? undefined
                  : { fields: { name: 'Please enter your name.' } },
            },
          ]}
          onGroupSubmit={() => {
            onGroupSubmit()
            setShowNextStep(true)
          }}
          onGroupSubmitInvalid={onGroupSubmitInvalid}
        >
          {(group) => (
            <>
              <form.Field name="guestDetails.name">
                {(field) => (
                  <>
                    <input
                      aria-label="Guest name"
                      value={field.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    <span data-testid="name-error">
                      {field.errors[0]?.message ?? ''}
                    </span>
                  </>
                )}
              </form.Field>
              <button type="button" onClick={() => group.handleSubmit()}>
                Continue
              </button>
            </>
          )}
        </FormGroup>
      )
    }

    const { getByLabelText, getByRole, getByTestId, getByText, queryByText } =
      render(<Component />)

    await user.click(getByRole('button', { name: 'Continue' }))

    expect(getByTestId('name-error')).toHaveTextContent(
      'Please enter your name.',
    )
    expect(onGroupSubmitInvalid).toHaveBeenCalledOnce()
    expect(onGroupSubmit).not.toHaveBeenCalled()
    expect(queryByText('Special requests')).not.toBeInTheDocument()

    await user.type(getByLabelText('Guest name'), 'Alice')
    await user.click(getByRole('button', { name: 'Continue' }))

    await vi.waitFor(() => {
      expect(getByText('Special requests')).toBeInTheDocument()
    })
    expect(onGroupSubmit).toHaveBeenCalledOnce()
  })

  it('submits the current step without running whole-form validation', async () => {
    const formValidator = vi.fn(({ value }) =>
      value.specialRequests.notes ? undefined : 'Special requests are invalid',
    )
    const onSubmit = vi.fn()
    const onGroupSubmit = vi.fn()

    function Component() {
      const form = useForm({
        defaultValues: {
          guestDetails: { name: 'Alice' },
          specialRequests: { notes: '' },
        },
        validators: [{ triggers: [], run: formValidator }],
        onSubmit,
      })

      return (
        <FormGroup
          form={form}
          name="guestDetails"
          onGroupSubmit={onGroupSubmit}
        >
          {(group) => (
            <>
              <form.Field name="guestDetails.name">
                {(field) => (
                  <input
                    aria-label="Guest name"
                    value={field.value}
                    readOnly
                  />
                )}
              </form.Field>
              <button type="button" onClick={() => group.handleSubmit()}>
                Continue
              </button>
            </>
          )}
        </FormGroup>
      )
    }

    const { getByRole } = render(<Component />)

    await user.click(getByRole('button', { name: 'Continue' }))

    expect(onGroupSubmit).toHaveBeenCalledOnce()
    expect(formValidator).not.toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('registers the mounted group for descendant field validation', async () => {
    const groupValidator = vi.fn(({ value }: { value: { name: string } }) =>
      value.name === 'valid' ? undefined : { message: 'Invalid step' },
    )
    const formValidator = vi.fn()

    function Component() {
      const form = useForm({
        defaultValues: { step: { name: '' } },
        validators: [{ triggers: ['change'], run: formValidator }],
      })

      return (
        <FormGroup
          form={form}
          name="step"
          validators={[{ triggers: ['change'], run: groupValidator }]}
        >
          {() => (
            <form.Field name="step.name">
              {(field) => (
                <input
                  aria-label="Name"
                  value={field.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              )}
            </form.Field>
          )}
        </FormGroup>
      )
    }

    const { getByLabelText } = render(<Component />)

    await user.type(getByLabelText('Name'), 'x')

    expect(groupValidator).toHaveBeenCalled()
    expect(formValidator).not.toHaveBeenCalled()
  })

  it('prefixes scoped array field names and delegates array operations', async () => {
    function Component() {
      const form = useForm({
        defaultValues: { step: { names: ['Alice'] } },
      })

      return (
        <FormGroup form={form} name="step">
          {(group) => (
            <>
              <group.Subscribe selector={(state) => state.value.names}>
                {(names) => (
                  <span data-testid="names">{names.join(',')}</span>
                )}
              </group.Subscribe>
              <form.ArrayField name="step.names">
                {(field) => (
                  <button type="button" onClick={() => field.pushValue('Bob')}>
                    Add name
                  </button>
                )}
              </form.ArrayField>
            </>
          )}
        </FormGroup>
      )
    }

    const { getByRole, getByTestId } = render(<Component />)

    await user.click(getByRole('button', { name: 'Add name' }))

    expect(getByTestId('names')).toHaveTextContent('Alice,Bob')
  })

  it('does not re-render the group children when a descendant field changes', async () => {
    let groupRenderCount = 0
    let nameRenderCount = 0
    let emailRenderCount = 0

    function Component() {
      const form = useForm({
        defaultValues: {
          step: {
            name: '',
            email: '',
          },
        },
      })

      return (
        <FormGroup form={form} name="step">
          {() => {
            groupRenderCount++

            return (
              <>
                <form.Field name="step.name">
                  {(field) => {
                    nameRenderCount++

                    return (
                      <input
                        aria-label="Name"
                        value={field.value}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                    )
                  }}
                </form.Field>
                <form.Field name="step.email">
                  {(field) => {
                    emailRenderCount++

                    return (
                      <input
                        aria-label="Email"
                        value={field.value}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                    )
                  }}
                </form.Field>
              </>
            )
          }}
        </FormGroup>
      )
    }

    const { getByLabelText } = render(<Component />)

    expect(groupRenderCount).toBe(1)
    expect(nameRenderCount).toBe(1)
    expect(emailRenderCount).toBe(1)

    await user.type(getByLabelText('Name'), 'A')

    expect(groupRenderCount).toBe(1)
    expect(nameRenderCount).toBeGreaterThan(1)
    expect(emailRenderCount).toBe(1)
  })

  it('keeps the group Subscribe component stable across parent re-renders', async () => {
    const subscribeComponents: Array<unknown> = []

    function SubscribeProbe(props: { subscribe: unknown }) {
      React.useEffect(() => {
        subscribeComponents.push(props.subscribe)
      }, [props.subscribe])

      return null
    }

    function Component() {
      const [renderCount, setRenderCount] = useState(0)
      const form = useForm({ defaultValues: { step: { name: 'Alice' } } })

      return (
        <>
          <button type="button" onClick={() => setRenderCount((v) => v + 1)}>
            Re-render
          </button>
          <span data-testid="render-count">{renderCount}</span>
          <FormGroup form={form} name="step">
            {(group) => <SubscribeProbe subscribe={group.Subscribe} />}
          </FormGroup>
        </>
      )
    }

    const { getByRole, getByTestId } = render(<Component />)

    expect(getByTestId('render-count')).toHaveTextContent('0')

    await user.click(getByRole('button', { name: 'Re-render' }))

    expect(getByTestId('render-count')).toHaveTextContent('1')
    expect(subscribeComponents).toHaveLength(1)
  })

  it('does not attach React components to the core group api', async () => {
    let observed:
      | { wrapperHasSubscribe: boolean; coreHasSubscribe: boolean }
      | undefined

    function GroupApiProbe(props: {
      group: Parameters<
        Parameters<typeof FormGroup<any, any, any, any, any, any>>[0]['children']
      >[0]
    }) {
      React.useEffect(() => {
        const coreGroup = Object.getPrototypeOf(props.group)
        observed = {
          wrapperHasSubscribe: Object.prototype.hasOwnProperty.call(
            props.group,
            'Subscribe',
          ),
          coreHasSubscribe: Object.prototype.hasOwnProperty.call(
            coreGroup,
            'Subscribe',
          ),
        }
      }, [props.group])

      return null
    }

    function Component() {
      const form = useForm({ defaultValues: { step: { name: 'Alice' } } })

      return (
        <FormGroup form={form} name="step">
          {(group) => <GroupApiProbe group={group} />}
        </FormGroup>
      )
    }

    render(<Component />)

    await vi.waitFor(() => {
      expect(observed).toEqual({
        wrapperHasSubscribe: true,
        coreHasSubscribe: false,
      })
    })
  })
})

import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React, { useState } from 'react'
import { createFormHook, getFormHookHelpers, useForm } from '../src'
import type { AnyInternalFormApi } from '@tanstack/form-core-v2/internals'
import type { FieldWithValue } from '@tanstack/form-core-v2'

const user = userEvent.setup()

function FieldNameComp(props: { field: FieldWithValue<string> }) {
  return <span data-testid="app-field-name">{props.field.name}</span>
}

const { fieldComponent } = getFormHookHelpers()

const FieldName = fieldComponent.loose(FieldNameComp, 'field')

const { useAppForm } = createFormHook({
  fieldComponents: {
    FieldName,
  },
  formComponents: {},
})

describe('FormGroup', () => {
  it('renders from the normal form API and prefixes field names', () => {
    function Component() {
      const form = useForm({
        defaultValues: { guestDetails: { name: 'Tony' } },
      })

      return (
        <form.FormGroup name="guestDetails">
          {(group) => (
            <group.Field name="name">
              {(field) => (
                <span data-testid="field">
                  {field.name}:{field.value}
                </span>
              )}
            </group.Field>
          )}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Component />)

    expect(getByTestId('field')).toHaveTextContent('guestDetails.name:Tony')
  })

  it('prefixes array field names', () => {
    function Component() {
      const form = useForm({
        defaultValues: { guestDetails: { guests: ['Tony'] } },
      })

      return (
        <form.FormGroup name="guestDetails">
          {(group) => (
            <group.ArrayField name="guests">
              {(field) => <span data-testid="array">{field.name}</span>}
            </group.ArrayField>
          )}
        </form.FormGroup>
      )
    }

    const { getByTestId } = render(<Component />)

    expect(getByTestId('array')).toHaveTextContent('guestDetails.guests')
  })

  it('provides AppForm field context for group fields', () => {
    function Component() {
      const form = useAppForm({
        defaultValues: { guestDetails: { name: 'Tony' } },
      })

      return (
        <form.AppForm>
          <form.FormGroup name="guestDetails">
            {(group) => (
              <group.Field name="name">
                {(field) => <field.FieldName />}
              </group.Field>
            )}
          </form.FormGroup>
        </form.AppForm>
      )
    }

    const { getByTestId } = render(<Component />)

    expect(getByTestId('app-field-name')).toHaveTextContent('guestDetails.name')
  })

  it('uses the AppForm field provider subscription for field context', async () => {
    const subscribe = vi.fn()

    function Component() {
      const form = useAppForm({
        defaultValues: { guestDetails: { name: 'Tony' } },
      })

      return (
        <form.AppForm>
          <form.FormGroup name="guestDetails">
            {(group) => (
              <group.Field name="name">
                {(field) => {
                  const store = field.store
                  const originalSubscribe = store.subscribe as (
                    ...args: Array<any>
                  ) => ReturnType<typeof store.subscribe>
                  store.subscribe = (...args) => {
                    subscribe()
                    return originalSubscribe(...args)
                  }

                  return <field.FieldName />
                }}
              </group.Field>
            )}
          </form.FormGroup>
        </form.AppForm>
      )
    }

    render(<Component />)

    await vi.waitFor(() => {
      expect(subscribe).toHaveBeenCalledTimes(2)
    })
  })

  it('prefixes watched field names in group field listeners', async () => {
    const listener = vi.fn()

    function Component() {
      const form = useForm({
        defaultValues: { guestDetails: { name: '', confirmation: '' } },
      })

      return (
        <form.FormGroup name="guestDetails">
          {(group) => (
            <>
              <group.Field name="name">
                {(field) => (
                  <input
                    aria-label="Guest name"
                    value={field.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                )}
              </group.Field>
              <group.Field
                name="confirmation"
                listeners={[
                  {
                    triggers: ['change'],
                    watchFields: ['name'],
                    run: listener,
                  },
                ]}
              >
                {() => null}
              </group.Field>
            </>
          )}
        </form.FormGroup>
      )
    }

    const { getByLabelText } = render(<Component />)

    await user.type(getByLabelText('Guest name'), 'A')

    expect(listener).toHaveBeenCalledOnce()
  })

  it('subscribes to group state updates and advances an external stepper on submit', async () => {
    function Component() {
      const [step, setStep] = useState(0)
      const form = useForm({
        defaultValues: { guestDetails: { name: 'Tony' } },
      })

      return (
        <>
          <span data-testid="step">{step}</span>
          <form.FormGroup
            name="guestDetails"
            onSubmit={() => setStep((prev) => prev + 1)}
          >
            {(group) => (
              <>
                <group.Subscribe selector={(state) => state.submissionAttempts}>
                  {(attempts) => <span data-testid="attempts">{attempts}</span>}
                </group.Subscribe>
                <button onClick={() => group.handleSubmit()}>Continue</button>
              </>
            )}
          </form.FormGroup>
        </>
      )
    }

    const { getByText, getByTestId } = render(<Component />)

    await user.click(getByText('Continue'))

    expect(getByTestId('step')).toHaveTextContent('1')
    expect(getByTestId('attempts')).toHaveTextContent('1')
  })

  it('renders descendant field errors on invalid group submit', async () => {
    function Component() {
      const form = useForm({
        defaultValues: { guestDetails: { name: '' } },
      })

      return (
        <form.FormGroup name="guestDetails">
          {(group) => (
            <>
              <group.Field
                name="name"
                validators={[
                  {
                    triggers: [],
                    run: () => 'Name is required',
                  },
                ]}
              >
                {(field) => (
                  <span data-testid="error">
                    {field.errors.map((error) => error.message).join(',')}
                  </span>
                )}
              </group.Field>
              <button onClick={() => group.handleSubmit()}>Continue</button>
            </>
          )}
        </form.FormGroup>
      )
    }

    const { getByText, getByTestId } = render(<Component />)

    await user.click(getByText('Continue'))

    expect(getByTestId('error')).toHaveTextContent('Name is required')
  })

  it('does not add a DOM-rendering StepForm helper', () => {
    function Component() {
      const form = useForm({ defaultValues: { guestDetails: { name: '' } } })
      return <span data-testid="exists">{String('StepForm' in form)}</span>
    }

    const { getByTestId } = render(<Component />)

    expect(getByTestId('exists')).toHaveTextContent('false')
  })

  it('clears group-routed errors on unmount without resetting values', async () => {
    const formRef = { current: null as AnyInternalFormApi | null }

    function Component() {
      const [showGroup, setShowGroup] = useState(true)
      const form = useForm({
        defaultValues: { guestDetails: { name: '' } },
      })
      // eslint-disable-next-line react-compiler/react-compiler
      formRef.current = form as never

      return (
        <>
          {showGroup && (
            <form.FormGroup
              name="guestDetails"
              validators={[
                {
                  triggers: [],
                  run: () => ({
                    fields: {
                      name: 'Name is required',
                    },
                  }),
                },
              ]}
            >
              {(group) => (
                <button onClick={() => group.handleSubmit()}>Continue</button>
              )}
            </form.FormGroup>
          )}
          <form.Field name="guestDetails.name">
            {(field) => (
              <>
                <input
                  aria-label="Guest name"
                  value={field.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <span data-testid="error">
                  {field.errors.map((error) => error.message).join(',')}
                </span>
              </>
            )}
          </form.Field>
          <button onClick={() => setShowGroup(false)}>Unmount group</button>
        </>
      )
    }

    const { getByLabelText, getByText, getByTestId } = render(<Component />)
    const input = getByLabelText('Guest name')

    await user.type(input, 'Preserved')
    await user.clear(input)
    await user.click(getByText('Continue'))

    expect(getByTestId('error')).toHaveTextContent('Name is required')

    await user.type(input, 'Still here')
    await user.click(getByText('Unmount group'))

    expect(getByTestId('error')).toHaveTextContent('')
    expect(formRef.current?.state.values).toEqual({
      guestDetails: { name: 'Still here' },
    })
  })
})

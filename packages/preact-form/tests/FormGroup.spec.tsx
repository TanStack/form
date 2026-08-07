import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/preact'
import { userEvent } from '@testing-library/user-event'
import Preact, { useState } from 'preact/compat'
import { z } from 'zod'
import { createFormHook, getFormHookHelpers, useForm } from '../src'
import type { AnyInternalFormApi } from '@tanstack/form-core/internals'
import type { FieldWithValue } from '@tanstack/form-core'

const user = userEvent.setup()

function FieldNameComp(props: { field: FieldWithValue<string> }) {
  return <span data-testid="app-field-name">{props.field.name}</span>
}

function TextFieldComp(props: {
  field: FieldWithValue<string>
  label: string
}) {
  return (
    <label>
      {props.label}
      <input
        value={props.field.value}
        onChange={(event) =>
          props.field.handleChange(event.currentTarget.value)
        }
        onBlur={props.field.handleBlur}
      />
      <span data-testid="visible-errors">
        {props.field.errors.map((error) => error.message).join(',')}
      </span>
    </label>
  )
}

const { fieldComponent } = getFormHookHelpers()

const FieldName = fieldComponent.loose(FieldNameComp, 'field')
const TextField = fieldComponent.strict(TextFieldComp, 'field')

const { useAppForm } = createFormHook({
  fieldComponents: {
    FieldName,
    TextField,
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
    const unsubscribe = vi.fn()
    const instrumentedAtoms = new WeakSet<object>()

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
                  const atom = field.atom
                  if (!instrumentedAtoms.has(atom)) {
                    instrumentedAtoms.add(atom)
                    const originalSubscribe = atom.subscribe as (
                      ...args: Array<any>
                    ) => ReturnType<typeof atom.subscribe>
                    atom.subscribe = (...args) => {
                      subscribe()
                      const subscription = originalSubscribe(...args)
                      let isActive = true
                      return {
                        unsubscribe: () => {
                          if (isActive) {
                            isActive = false
                            unsubscribe()
                          }
                          subscription.unsubscribe()
                        },
                      }
                    }
                  }

                  return <field.FieldName />
                }}
              </group.Field>
            )}
          </form.FormGroup>
        </form.AppForm>
      )
    }

    const { unmount } = render(<Component />)

    await vi.waitFor(() => {
      expect(subscribe.mock.calls.length - unsubscribe.mock.calls.length).toBe(
        2,
      )
    })

    unmount()

    await vi.waitFor(() => {
      expect(subscribe.mock.calls.length - unsubscribe.mock.calls.length).toBe(
        0,
      )
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
                    onChange={(event) =>
                      field.handleChange(event.currentTarget.value)
                    }
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

  it('routes descendant field changes to the nearest form group', async () => {
    const validator = vi.fn(() => ({
      fields: {
        name: 'Name is invalid',
      },
    }))

    function Component() {
      const form = useForm({
        defaultValues: { step1: { name: '' } },
      })

      return (
        <form.FormGroup
          name="step1"
          validators={[
            {
              triggers: ['change'],
              run: validator,
            },
          ]}
        >
          {(group) => (
            <group.Field name="name">
              {(field) => (
                <>
                  <input
                    aria-label="Step 1 name"
                    value={field.value}
                    onChange={(event) =>
                      field.handleChange(event.currentTarget.value)
                    }
                  />
                  <span data-testid="change-error">
                    {field.errors.map((error) => error.message).join(',')}
                  </span>
                </>
              )}
            </group.Field>
          )}
        </form.FormGroup>
      )
    }

    const { getByLabelText, getByTestId } = render(<Component />)

    await user.type(getByLabelText('Step 1 name'), 'A')

    await vi.waitFor(() => {
      expect(validator).toHaveBeenCalledOnce()
      expect(getByTestId('change-error')).toHaveTextContent('Name is invalid')
    })
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

  it('routes group validator field errors to prefixed group fields', async () => {
    function Component() {
      const form = useForm({
        defaultValues: { step1: { name: '' } },
      })

      return (
        <form.FormGroup
          name="step1"
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
            <>
              <group.Field name="name">
                {(field) => (
                  <span data-testid="group-field-error">
                    {field.name}:
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

    await vi.waitFor(() => {
      expect(getByTestId('group-field-error')).toHaveTextContent(
        'step1.name:Name is required',
      )
    })
  })

  it('renders Standard Schema group errors through AppForm field components', async () => {
    const formRef = { current: null as AnyInternalFormApi | null }
    const step1Schema = z.object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
    })
    const validate = vi.spyOn(step1Schema['~standard'], 'validate')

    function Component() {
      const form = useAppForm({
        defaultValues: { step1: { name: '' } },
      })
      formRef.current = form as never

      return (
        <form.AppForm>
          <form.FormGroup
            name="step1"
            validators={[
              {
                triggers: [],
                run: step1Schema,
              },
            ]}
          >
            {(group) => (
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  group.handleSubmit()
                }}
              >
                <group.Field name="name">
                  {(field) => <field.TextField label="Step 1 Name" />}
                </group.Field>
                <button type="submit">Submit</button>
              </form>
            )}
          </form.FormGroup>
        </form.AppForm>
      )
    }

    const { getByText, getByTestId } = render(<Component />)

    await user.click(getByText('Submit'))

    await vi.waitFor(() => {
      expect(validate).toHaveBeenCalled()
      expect(
        formRef.current?._tryGetFieldApi('step1.name')?.meta.original.errors,
      ).toEqual([
        expect.objectContaining({
          message: 'Name must be at least 2 characters',
        }),
      ])
      expect(getByTestId('visible-errors')).toHaveTextContent(
        'Name must be at least 2 characters',
      )
    })
  })

  it('routes descendant Standard Schema group errors to an error boundary field', async () => {
    const stayDatesSchema = z.object({
      dateRange: z.object({
        from: z
          .date()
          .optional()
          .refine(
            (value) => value !== undefined,
            'Please select a start date.',
          ),
        to: z
          .date()
          .optional()
          .refine((value) => value !== undefined, 'Please select an end date.'),
      }),
      arrivalTime: z.string().min(1, 'Please select an arrival time.'),
    })
    type StayDates = z.input<typeof stayDatesSchema>
    const defaultValues: { stayDates: StayDates } = {
      stayDates: {
        dateRange: {
          from: undefined,
          to: undefined,
        },
        arrivalTime: '',
      },
    }

    function Component() {
      const form = useForm({
        defaultValues,
      })

      return (
        <form.FormGroup
          name="stayDates"
          validators={[
            {
              triggers: [],
              run: stayDatesSchema,
            },
          ]}
        >
          {(group) => (
            <>
              <group.Field name="dateRange" errorBoundary>
                {(field) => (
                  <span data-testid="date-range-errors">
                    {field.errors.map((error) => error.message).join(',')}
                  </span>
                )}
              </group.Field>
              <group.Field name="arrivalTime">
                {(field) => (
                  <span data-testid="arrival-time-errors">
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

    await vi.waitFor(() => {
      expect(getByTestId('arrival-time-errors')).toHaveTextContent(
        'Please select an arrival time.',
      )
      expect(getByTestId('date-range-errors')).toHaveTextContent(
        'Please select a start date.,Please select an end date.',
      )
    })
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
                  onChange={(event) =>
                    field.handleChange(event.currentTarget.value)
                  }
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

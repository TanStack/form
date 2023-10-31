/// <reference lib="dom" />
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import * as React from 'react'
import { createFormFactory, useForm } from '..'

const user = userEvent.setup()

describe('useForm', () => {
  it('preserves field state', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.useForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultValue={''}
            children={(field) => {
              return (
                <input
                  data-testid="fieldinput"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )
            }}
          />
        </form.Provider>
      )
    }

    const { getByTestId, queryByText } = render(<Comp />)
    const input = getByTestId('fieldinput')
    expect(queryByText('FirstName')).not.toBeInTheDocument()
    await user.type(input, 'FirstName')
    expect(input).toHaveValue('FirstName')
  })

  it('should allow default values to be set', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.useForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        },
      })

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            children={(field) => {
              return <p>{field.state.value}</p>
            }}
          />
        </form.Provider>
      )
    }

    const { findByText, queryByText } = render(<Comp />)
    expect(await findByText('FirstName')).toBeInTheDocument()
    expect(queryByText('LastName')).not.toBeInTheDocument()
  })

  it('should handle submitting properly', async () => {
    function Comp() {
      const [submittedData, setSubmittedData] = React.useState<{
        firstName: string
      } | null>(null)

      const form = useForm({
        defaultValues: {
          firstName: 'FirstName',
        },
        onSubmit: (data) => {
          setSubmittedData(data)
        },
      })

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            children={(field) => {
              return (
                <input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={'First name'}
                />
              )
            }}
          />
          <button onClick={form.handleSubmit}>Submit</button>
          {submittedData && <p>Submitted data: {submittedData.firstName}</p>}
        </form.Provider>
      )
    }

    const { findByPlaceholderText, getByText } = render(<Comp />)
    const input = await findByPlaceholderText('First name')
    await user.clear(input)
    await user.type(input, 'OtherName')
    await user.click(getByText('Submit'))
    await waitFor(() =>
      expect(getByText('Submitted data: OtherName')).toBeInTheDocument(),
    )
  })

  it('should run on form mount', async () => {
    function Comp() {
      const [formMounted, setFormMounted] = React.useState(false)
      const [mountForm, setMountForm] = React.useState(false)

      const form = useForm({
        defaultValues: {
          firstName: 'FirstName',
        },
        onMount: () => {
          setFormMounted(true)
          return undefined
        },
      })

      return (
        <>
          {mountForm ? (
            <form.Provider>
              <h1>{formMounted ? 'Form mounted' : 'Not mounted'}</h1>
            </form.Provider>
          ) : (
            <button onClick={() => setMountForm(true)}>Mount form</button>
          )}
        </>
      )
    }

    const { getByText } = render(<Comp />)
    await user.click(getByText('Mount form'))
    await waitFor(() => expect(getByText('Form mounted')).toBeInTheDocument())
  })
})

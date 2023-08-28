import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import * as React from 'react'
import { createFormFactory } from '..'

const user = userEvent.setup()

describe('useForm', () => {
  it('preserves field state', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person>()

    function Comp() {
      const form = formFactory.useForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultValue={''}
            children={(field) => {
              return (
                <input data-testid="fieldinput" {...field.getInputProps()} />
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

    const formFactory = createFormFactory<Person>()

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
              return <p>{field.getInputProps().value}</p>
            }}
          />
        </form.Provider>
      )
    }

    const { findByText, queryByText } = render(<Comp />)
    expect(await findByText('FirstName')).toBeInTheDocument()
    expect(queryByText('LastName')).not.toBeInTheDocument()
  })
})

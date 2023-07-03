import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
            defaultValue={""}
            children={(field) => {
              return <input data-testid="fieldinput" {...field.getInputProps()} />
            }}
          />
        </form.Provider>
      )
    }

    const { getByTestId, queryByText } = render(<Comp />)
    const input = getByTestId("fieldinput");
    expect(queryByText('FirstName')).not.toBeInTheDocument()
    await user.type(input, "FirstName")
    expect(input).toHaveValue("FirstName")
  })
})

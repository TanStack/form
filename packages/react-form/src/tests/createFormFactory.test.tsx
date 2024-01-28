/// <reference lib="dom" />
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as React from 'react'
import { createFormFactory } from '..'

describe('createFormFactory', () => {
  it('should allow default values to be set', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person>({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      },
    })

    function Comp() {
      const form = formFactory.useForm({})

      return (
        <>
          <form.Field
            name="firstName"
            children={(field) => {
              return <p>{field.state.value}</p>
            }}
          />
        </>
      )
    }

    const { findByText, queryByText } = render(<Comp />)
    expect(await findByText('FirstName')).toBeInTheDocument()
    expect(queryByText('LastName')).not.toBeInTheDocument()
  })
})

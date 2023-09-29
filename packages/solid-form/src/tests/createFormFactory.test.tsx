import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@solidjs/testing-library'
import { createFormFactory } from '..'

describe('createFormFactory', () => {
  it('should allow default values to be set', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person>(() => ({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      },
    }))

    function Comp() {
      const form = formFactory.createForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            children={(field) => {
              return <p>{field().state.value}</p>
            }}
          />
        </form.Provider>
      )
    }

    const { findByText, queryByText } = render(() => <Comp />)
    expect(await findByText('FirstName')).toBeInTheDocument()
    expect(queryByText('LastName')).not.toBeInTheDocument()
  })
})

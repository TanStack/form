import { describe, expect, it } from 'vitest'
import { render } from '@solidjs/testing-library'
import { createFormFactory } from '../index'

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
        <>
          <form.Field
            name="firstName"
            children={(field) => {
              return <p>{field().state.value}</p>
            }}
          />
        </>
      )
    }

    const { findByText, queryByText } = render(() => <Comp />)
    expect(await findByText('FirstName')).toBeInTheDocument()
    expect(queryByText('LastName')).not.toBeInTheDocument()
  })
})

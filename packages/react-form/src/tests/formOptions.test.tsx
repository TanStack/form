import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { formOptions, useForm } from '../index'

describe('formOptions', () => {
  it('should allow default values to be set', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formOpts = formOptions<Person>({
      defaultValues: {
        firstName: 'FirstName',
        lastName: 'LastName',
      },
    })

    function Comp() {
      const form = useForm({
        ...formOpts,
      })

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

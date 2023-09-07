import { h, defineComponent, watch } from 'vue-demi'
import { render, waitFor } from '@testing-library/vue'
import '@testing-library/jest-dom'
import { createFormFactory, useForm } from '../index'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

const user = userEvent.setup()

describe('useForm', () => {
  it('preserved field state', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person>()

    const Comp = defineComponent(() => {
      const form = formFactory.useForm()
      form.provideFormContext()

      return () => (
        <form.Field
          name="firstName"
          defaultValue=""
          children={(field) => (
            <input
              data-testid="fieldinput"
              value={field.state.value}
              onBlur={field.handleBlur}
              onInput={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      )
    })

    const { getByTestId, queryByText } = render(Comp)
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

    const Comp = defineComponent(() => {
      const form = formFactory.useForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        },
      })
      form.provideFormContext()

      return () => (
        <form.Field
          name="firstName"
          defaultValue=""
          children={(field) => <p>{field.state.value}</p>}
        />
      )
    })

    const { findByText, queryByText } = render(Comp)
    expect(await findByText('FirstName')).toBeInTheDocument()
    expect(queryByText('LastName')).not.toBeInTheDocument()
  })
})

/// <reference lib="dom" />
import { h, defineComponent } from 'vue-demi'
import { render } from '@testing-library/vue'
import '@testing-library/jest-dom'
import {
  createFormFactory,
  type FieldApi,
  provideFormContext,
  useForm,
} from '../index'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { waitFor } from '@testing-library/react'
import { ref } from 'vue'

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

      provideFormContext({ formApi: form })

      return () => (
        <form.Field name="firstName" defaultValue="">
          {(field: FieldApi<string, Person>) => (
            <input
              data-testid={'fieldinput'}
              value={field.state.value}
              onBlur={field.handleBlur}
              onInput={(e) =>
                field.handleChange((e.target as HTMLInputElement).value)
              }
            />
          )}
        </form.Field>
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
        <form.Field name="firstName" defaultValue="">
          {(field: FieldApi<string, Person>) => <p>{field.state.value}</p>}
        </form.Field>
      )
    })

    const { findByText, queryByText } = render(Comp)
    expect(await findByText('FirstName')).toBeInTheDocument()
    expect(queryByText('LastName')).not.toBeInTheDocument()
  })

  it('should handle submitting properly', async () => {
    const Comp = defineComponent(() => {
      const submittedData = ref<{ firstName: string }>()

      const form = useForm({
        defaultValues: {
          firstName: 'FirstName',
        },
        onSubmit: (data) => {
          submittedData.value = data
        },
      })
      form.provideFormContext()

      return () => (
        <form.Provider>
          <form.Field name="firstName">
            {(field: FieldApi<string, { firstName: string }>) => {
              return (
                <input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange((e.target as HTMLInputElement).value)
                  }
                  placeholder={'First name'}
                />
              )
            }}
          </form.Field>
          <button onClick={form.handleSubmit}>Submit</button>
          {submittedData.value && (
            <p>Submitted data: {submittedData.value.firstName}</p>
          )}
        </form.Provider>
      )
    })

    const { findByPlaceholderText, getByText } = render(Comp)
    const input = await findByPlaceholderText('First name')
    await user.clear(input)
    await user.type(input, 'OtherName')
    await user.click(getByText('Submit'))
    await waitFor(() =>
      expect(getByText('Submitted data: OtherName')).toBeInTheDocument(),
    )
  })
})

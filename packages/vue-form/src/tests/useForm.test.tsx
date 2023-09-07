/// <reference lib="dom" />
import { h, defineComponent } from 'vue-demi'
import { render } from '@testing-library/vue'
import '@testing-library/jest-dom'
import { createFormFactory, type FieldApi, provideFormContext } from '../index'
import userEvent from '@testing-library/user-event'

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
          {(field: FieldApi<string, { firstName: string }>) => (
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
          {(field: FieldApi<string, { firstName: string }>) => (
            <p>{field.state.value}</p>
          )}
        </form.Field>
      )
    })

    const { findByText, queryByText } = render(Comp)
    expect(await findByText('FirstName')).toBeInTheDocument()
    expect(queryByText('LastName')).not.toBeInTheDocument()
  })
})

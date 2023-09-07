/// <reference lib="dom" />
import { h, defineComponent } from 'vue-demi'
import { render, waitFor } from '@testing-library/vue'
import '@testing-library/jest-dom'
import {
  createFormFactory,
  type FieldApi,
  provideFormContext,
  useForm,
} from '../index'
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

describe('useField', () => {
  it('should allow to set default value', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person>()

    const Comp = defineComponent(() => {
      const form = formFactory.useForm()

      provideFormContext({ formApi: form })

      return () => (
        <form.Field name="firstName" defaultValue="FirstName">
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

    const { getByTestId } = render(Comp)
    const input = getByTestId('fieldinput')
    await waitFor(() => expect(input).toHaveValue('FirstName'))
  })
})

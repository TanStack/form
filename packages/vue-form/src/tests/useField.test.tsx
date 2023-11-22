/// <reference lib="dom" />
import { h, defineComponent } from 'vue-demi'
import { render, waitFor } from '@testing-library/vue'
import '@testing-library/jest-dom'
import { createFormFactory, type FieldApi, provideFormContext } from '../index'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { sleep } from './utils'

const user = userEvent.setup()

describe('useField', () => {
  it('should allow to set default value', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person, unknown>()

    const Comp = defineComponent(() => {
      const form = formFactory.useForm()

      provideFormContext({ formApi: form })

      return () => (
        <form.Field name="firstName" defaultValue="FirstName">
          {({
            field,
          }: {
            field: FieldApi<Person, 'firstName', never, never>
          }) => (
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

  it('should not validate on change if isTouched is false', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const error = 'Please enter a different value'

    const formFactory = createFormFactory<Person, unknown>()

    const Comp = defineComponent(() => {
      const form = formFactory.useForm()

      provideFormContext({ formApi: form })

      return () => (
        <form.Field
          name="firstName"
          onChange={(value) => (value === 'other' ? error : undefined)}
        >
          {({
            field,
          }: {
            field: FieldApi<Person, 'firstName', never, never>
          }) => (
            <div>
              <input
                data-testid="fieldinput"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onInput={(e) =>
                  field.setValue((e.target as HTMLInputElement).value)
                }
              />
              <p>{field.getMeta().errors}</p>
            </div>
          )}
        </form.Field>
      )
    })

    const { getByTestId, queryByText } = render(Comp)
    const input = getByTestId('fieldinput')
    await user.type(input, 'other')
    expect(queryByText(error)).not.toBeInTheDocument()
  })

  it('should validate on change if isTouched is true', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const error = 'Please enter a different value'

    const formFactory = createFormFactory<Person, unknown>()

    const Comp = defineComponent(() => {
      const form = formFactory.useForm()

      provideFormContext({ formApi: form })

      return () => (
        <form.Field
          name="firstName"
          onChange={(value) => (value === 'other' ? error : undefined)}
        >
          {({
            field,
          }: {
            field: FieldApi<Person, 'firstName', never, never>
          }) => (
            <div>
              <input
                data-testid="fieldinput"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onInput={(e) =>
                  field.handleChange((e.target as HTMLInputElement).value)
                }
              />
              <p>{field.getMeta().errors}</p>
            </div>
          )}
        </form.Field>
      )
    })

    const { getByTestId, getByText, queryByText } = render(Comp)
    const input = getByTestId('fieldinput')
    expect(queryByText(error)).not.toBeInTheDocument()
    await user.type(input, 'other')
    expect(getByText(error)).toBeInTheDocument()
  })

  it('should validate async on change', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const error = 'Please enter a different value'

    const formFactory = createFormFactory<Person, unknown>()

    const Comp = defineComponent(() => {
      const form = formFactory.useForm()

      provideFormContext({ formApi: form })

      return () => (
        <form.Field
          name="firstName"
          defaultMeta={{ isTouched: true }}
          onChangeAsync={async () => {
            await sleep(10)
            return error
          }}
        >
          {({
            field,
          }: {
            field: FieldApi<Person, 'firstName', never, never>
          }) => (
            <div>
              <input
                data-testid="fieldinput"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onInput={(e) =>
                  field.handleChange((e.target as HTMLInputElement).value)
                }
              />
              <p>{field.getMeta().errors}</p>
            </div>
          )}
        </form.Field>
      )
    })

    const { getByTestId, getByText, queryByText } = render(Comp)
    const input = getByTestId('fieldinput')
    expect(queryByText(error)).not.toBeInTheDocument()
    await user.type(input, 'other')
    await waitFor(() => getByText(error))
    expect(getByText(error)).toBeInTheDocument()
  })

  it('should validate async on change with debounce', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const mockFn = vi.fn()
    const error = 'Please enter a different value'
    const formFactory = createFormFactory<Person, unknown>()

    const Comp = defineComponent(() => {
      const form = formFactory.useForm()

      provideFormContext({ formApi: form })

      return () => (
        <form.Field
          name="firstName"
          defaultMeta={{ isTouched: true }}
          onChangeAsyncDebounceMs={100}
          onChangeAsync={async () => {
            mockFn()
            await sleep(10)
            return error
          }}
        >
          {({
            field,
          }: {
            field: FieldApi<Person, 'firstName', never, never>
          }) => (
            <div>
              <input
                data-testid="fieldinput"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onInput={(e) =>
                  field.handleChange((e.target as HTMLInputElement).value)
                }
              />
              <p>{field.getMeta().errors}</p>
            </div>
          )}
        </form.Field>
      )
    })

    const { getByTestId, getByText } = render(<Comp />)
    const input = getByTestId('fieldinput')
    await user.type(input, 'other')
    // mockFn will have been called 5 times without onChangeAsyncDebounceMs
    expect(mockFn).toHaveBeenCalledTimes(0)
    await waitFor(() => getByText(error))
    expect(getByText(error)).toBeInTheDocument()
  })
})

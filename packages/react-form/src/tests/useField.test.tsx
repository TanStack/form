import * as React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { createFormFactory } from '..'
import { sleep } from './utils'

const user = userEvent.setup()

describe('useField', () => {
  it('should allow to set default value', () => {
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
            defaultValue="FirstName"
            children={(field) => {
              return (
                <input data-testid="fieldinput" {...field.getInputProps()} />
              )
            }}
          />
        </form.Provider>
      )
    }

    const { getByTestId } = render(<Comp />)
    const input = getByTestId('fieldinput')
    expect(input).toHaveValue('FirstName')
  })

  it('should not validate on change if isTouched is false', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const error = 'Please enter a different value'

    const formFactory = createFormFactory<Person>()

    function Comp() {
      const form = formFactory.useForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            onChange={(value) => (value === 'other' ? error : undefined)}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  {...field.getInputProps()}
                />
                <p>{field.getMeta().error}</p>
              </div>
            )}
          />
        </form.Provider>
      )
    }

    const { getByTestId, queryByText } = render(<Comp />)
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

    const formFactory = createFormFactory<Person>()

    function Comp() {
      const form = formFactory.useForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            onChange={(value) => (value === 'other' ? error : undefined)}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  {...field.getInputProps()}
                />
                <p>{field.getMeta().error}</p>
              </div>
            )}
          />
        </form.Provider>
      )
    }

    const { getByTestId, getByText, queryByText } = render(<Comp />)
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

    const formFactory = createFormFactory<Person>()

    function Comp() {
      const form = formFactory.useForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            onChangeAsync={async () => {
              await sleep(10)
              return error
            }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  {...field.getInputProps()}
                />
                <p>{field.getMeta().error}</p>
              </div>
            )}
          />
        </form.Provider>
      )
    }

    const { getByTestId, getByText, queryByText } = render(<Comp />)
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
    const formFactory = createFormFactory<Person>()

    function Comp() {
      const form = formFactory.useForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            onChangeAsyncDebounceMs={100}
            onChangeAsync={async () => {
              mockFn()
              await sleep(10)
              return error
            }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  {...field.getInputProps()}
                />
                <p>{field.getMeta().error}</p>
              </div>
            )}
          />
        </form.Provider>
      )
    }

    const { getByTestId, getByText } = render(<Comp />)
    const input = getByTestId('fieldinput')
    await user.type(input, 'other')
    // mockFn will have been called 5 times without onChangeAsyncDebounceMs
    expect(mockFn).toHaveBeenCalledTimes(0)
    await waitFor(() => getByText(error))
    expect(getByText(error)).toBeInTheDocument()
  })
})

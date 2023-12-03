import { render, waitFor } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { createFormFactory } from '..'
import { sleep } from './utils'

const user = userEvent.setup()

describe('createField', () => {
  it('should allow to set default value', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.createForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultValue="FirstName"
            children={(field) => {
              return (
                <input
                  data-testid="fieldinput"
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                />
              )
            }}
          />
        </form.Provider>
      )
    }

    const { getByTestId } = render(() => <Comp />)
    const input = getByTestId('fieldinput')
    expect(input).toHaveValue('FirstName')
  })

  it('should use field default value first', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.createForm(() => ({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        },
      }))

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultValue="otherName"
            children={(field) => {
              return (
                <input
                  data-testid="fieldinput"
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onChange={(e) => field().handleChange(e.target.value)}
                />
              )
            }}
          />
        </form.Provider>
      )
    }

    const { getByTestId } = render(<Comp />)
    const input = getByTestId('fieldinput')
    expect(input).toHaveValue('otherName')
  })

  it('should not validate on change if isTouched is false', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const error = 'Please enter a different value'

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.createForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            validators={{
              onChange: (value) =>
                value.includes('other') ? error : undefined,
            }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().setValue(e.currentTarget.value)}
                />
                <p>{field().getMeta().errors}</p>
              </div>
            )}
          />
        </form.Provider>
      )
    }

    const { getByTestId, queryByText } = render(() => <Comp />)
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

    function Comp() {
      const form = formFactory.createForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            validators={{
              onChange: (value) =>
                value.includes('other') ? error : undefined,
            }}
            children={(field) => {
              return (
                <div>
                  <input
                    data-testid="fieldinput"
                    name={field().name}
                    value={field().state.value}
                    onBlur={field().handleBlur}
                    onInput={(e) => field().setValue(e.currentTarget.value)}
                  />
                  <p>{field().getMeta().errorMap.onChange}</p>
                </div>
              )
            }}
          />
        </form.Provider>
      )
    }

    const { getByTestId, getByText, queryByText } = render(() => <Comp />)
    const input = getByTestId('fieldinput')
    expect(queryByText(error)).not.toBeInTheDocument()
    await user.type(input, 'other')
    expect(getByText(error)).toBeInTheDocument()
  })

  it('should validate on change and on blur', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const onChangeError = 'Please enter a different value (onChangeError)'
    const onBlurError = 'Please enter a different value (onBlurError)'

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.createForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            validators={{
              onChange: (value) =>
                value.includes('other') ? onChangeError : undefined,
              onBlur: (value) =>
                value.includes('other') ? onBlurError : undefined,
            }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                />
                <p>{field().getMeta().errorMap.onChange}</p>
                <p>{field().getMeta().errorMap.onBlur}</p>
              </div>
            )}
          />
        </form.Provider>
      )
    }

    const { getByTestId, getByText, queryByText } = render(() => <Comp />)
    const input = getByTestId('fieldinput')
    expect(queryByText(onChangeError)).not.toBeInTheDocument()
    expect(queryByText(onBlurError)).not.toBeInTheDocument()
    await user.type(input, 'other')
    expect(getByText(onChangeError)).toBeInTheDocument()
    // @ts-expect-error unsure why the 'vitest/globals' in tsconfig doesnt work here
    await user.click(document.body)
    expect(queryByText(onBlurError)).toBeInTheDocument()
  })

  it('should validate async on change', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const error = 'Please enter a different value'

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.createForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            validators={{
              onChangeAsync: async () => {
                await sleep(10)
                return error
              },
            }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                />
                <p>{field().getMeta().errorMap.onChange}</p>
              </div>
            )}
          />
        </form.Provider>
      )
    }

    const { getByTestId, getByText, queryByText } = render(() => <Comp />)
    const input = getByTestId('fieldinput')
    expect(queryByText(error)).not.toBeInTheDocument()
    await user.type(input, 'other')
    await waitFor(() => getByText(error))
    expect(getByText(error)).toBeInTheDocument()
  })

  it('should validate async on change and async on blur', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const onChangeError = 'Please enter a different value (onChangeError)'
    const onBlurError = 'Please enter a different value (onBlurError)'

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.createForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            validators={{
              onChangeAsync: async () => {
                await sleep(10)
                return onChangeError
              },
              onBlurAsync: async () => {
                await sleep(10)
                return onBlurError
              },
            }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                />
                <p>{field().getMeta().errorMap?.onChange}</p>
                <p>{field().getMeta().errorMap?.onBlur}</p>
              </div>
            )}
          />
        </form.Provider>
      )
    }

    const { getByTestId, getByText, queryByText } = render(() => <Comp />)
    const input = getByTestId('fieldinput')

    expect(queryByText(onChangeError)).not.toBeInTheDocument()
    expect(queryByText(onBlurError)).not.toBeInTheDocument()
    await user.type(input, 'other')
    await waitFor(() => getByText(onChangeError))
    expect(getByText(onChangeError)).toBeInTheDocument()
    // @ts-expect-error unsure why the 'vitest/globals' in tsconfig doesnt work here
    await user.click(document.body)
    await waitFor(() => getByText(onBlurError))
    expect(getByText(onBlurError)).toBeInTheDocument()
  })

  it('should validate async on change with debounce', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const mockFn = vi.fn()
    const error = 'Please enter a different value'
    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.createForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            validators={{
              onChangeAsyncDebounceMs: 100,
              onChangeAsync: async () => {
                mockFn()
                await sleep(10)
                return error
              },
            }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                />
                <p>{field().getMeta().errors}</p>
              </div>
            )}
          />
        </form.Provider>
      )
    }

    const { getByTestId, getByText } = render(() => <Comp />)
    const input = getByTestId('fieldinput')
    await user.type(input, 'other')
    // mockFn will have been called 5 times without onChangeAsyncDebounceMs
    expect(mockFn).toHaveBeenCalledTimes(0)
    await waitFor(() => getByText(error))
    expect(getByText(error)).toBeInTheDocument()
  })
})

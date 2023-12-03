import { render, screen, waitFor } from '@solidjs/testing-library'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { Show, createSignal, onCleanup } from 'solid-js'
import { createForm, createFormFactory } from '..'
import { sleep } from './utils'
import type { ValidationErrorMap } from '@tanstack/form-core'

const user = userEvent.setup()

describe('createForm', () => {
  it('preserves field state', async () => {
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
            defaultValue={''}
            children={(field) => (
              <input
                data-testid="fieldinput"
                value={field().state.value}
                onBlur={field().handleBlur}
                onChange={(e) => field().handleChange(e.currentTarget.value)}
              />
            )}
          />
        </form.Provider>
      )
    }

    render(() => <Comp />)
    const input = screen.getByTestId('fieldinput')
    expect(screen.queryByText('FirstName')).not.toBeInTheDocument()
    await user.type(input, 'FirstName')
    expect(input).toHaveValue('FirstName')
  })

  it('should allow default values to be set', async () => {
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

  it('should handle submitting properly', async () => {
    let submittedData = null as { firstName: string } | null
    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          firstName: 'FirstName',
        },
        onSubmit: (data) => {
          submittedData = data
        },
      }))

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            children={(field) => {
              return (
                <input
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onChange={(e) => field().handleChange(e.target.value)}
                  placeholder={'First name'}
                />
              )
            }}
          />
          <button onClick={form.handleSubmit}>Submit</button>
        </form.Provider>
      )
    }

    const { findByPlaceholderText, getByText } = render(() => <Comp />)
    const input = await findByPlaceholderText('First name')
    await user.clear(input)
    await user.type(input, 'OtherName')
    await user.click(getByText('Submit'))
    expect(submittedData?.firstName).toEqual('OtherName')
  })

  it('should run on form mount', async () => {
    const [formMounted, setFormMounted] = createSignal(false)
    const [mountForm, setMountForm] = createSignal(false)
    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          firstName: 'FirstName',
        },
        validators: {
          onMount: () => {
            setFormMounted(true)
            return undefined
          },
        },
      }))

      return (
        <Show
          when={mountForm()}
          fallback={
            <button onClick={() => setMountForm(true)}>Mount form</button>
          }
        >
          <form.Provider>
            <h1>Form mounted</h1>
          </form.Provider>
        </Show>
      )
    }

    const { getByText } = render(() => <Comp />)
    await user.click(getByText('Mount form'))
    expect(formMounted()).toBe(true)
  })

  it('should not validate on change if isTouched is false', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const error = 'Please enter a different value'

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.createForm(() => ({
        validators: {
          onChange: (value) =>
            value.firstName.includes('other') ? error : undefined,
        },
      }))

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().setValue(e.currentTarget.value)}
                />
                <p>{form.useStore((s) => s.errors)}</p>
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
      const form = formFactory.createForm(() => ({
        validators: {
          onChange: (value) =>
            value.firstName.includes('other') ? error : undefined,
        },
      }))

      const [errors, setErrors] = createSignal<ValidationErrorMap>()
      onCleanup(form.store.subscribe(() => setErrors(form.state.errorMap)))

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
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
                  <p>{errors()?.onChange}</p>
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
      const form = formFactory.createForm(() => ({
        validators: {
          onChange: (value) =>
            value.firstName.includes('other') ? onChangeError : undefined,
          onBlur: (value) =>
            value.firstName.includes('other') ? onBlurError : undefined,
        },
      }))

      const [errors, setErrors] = createSignal<ValidationErrorMap>()
      onCleanup(form.store.subscribe(() => setErrors(form.state.errorMap)))

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                />
                <p>{errors()?.onChange}</p>
                <p>{errors()?.onBlur}</p>
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
      const form = formFactory.createForm(() => ({
        validators: {
          onChangeAsync: async () => {
            await sleep(10)
            return error
          },
        },
      }))

      const [errors, setErrors] = createSignal<ValidationErrorMap>()
      onCleanup(form.store.subscribe(() => setErrors(form.state.errorMap)))

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                />
                <p>{errors()?.onChange}</p>
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
      const form = formFactory.createForm(() => ({
        validators: {
          async onChangeAsync() {
            await sleep(10)
            return onChangeError
          },
          async onBlurAsync() {
            await sleep(10)
            return onBlurError
          },
        },
      }))

      const [errors, setErrors] = createSignal<ValidationErrorMap>()
      onCleanup(form.store.subscribe(() => setErrors(form.state.errorMap)))

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                />
                <p>{errors()?.onChange}</p>
                <p>{errors()?.onBlur}</p>
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
      const form = formFactory.createForm(() => ({
        validators: {
          onChangeAsyncDebounceMs: 100,
          onChangeAsync: async () => {
            mockFn()
            await sleep(10)
            return error
          },
        },
      }))

      const [errors, setErrors] = createSignal<string>()
      onCleanup(
        form.store.subscribe(() =>
          setErrors(form.state.errorMap.onChange || ''),
        ),
      )

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                />
                <p>{errors()}</p>
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

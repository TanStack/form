/// <reference lib="dom" />
import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { createFormFactory, useForm } from '..'
import { sleep } from './utils'

const user = userEvent.setup()

describe('useForm', () => {
  it('preserves field state', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.useForm()

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultValue={''}
            children={(field) => {
              return (
                <input
                  data-testid="fieldinput"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )
            }}
          />
        </form.Provider>
      )
    }

    const { getByTestId, queryByText } = render(<Comp />)
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

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.useForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        },
      })

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            children={(field) => {
              return <p>{field.state.value}</p>
            }}
          />
        </form.Provider>
      )
    }

    const { findByText, queryByText } = render(<Comp />)
    expect(await findByText('FirstName')).toBeInTheDocument()
    expect(queryByText('LastName')).not.toBeInTheDocument()
  })

  it('should handle submitting properly', async () => {
    function Comp() {
      const [submittedData, setSubmittedData] = React.useState<{
        firstName: string
      } | null>(null)

      const form = useForm({
        defaultValues: {
          firstName: 'FirstName',
        },
        onSubmit: (data) => {
          setSubmittedData(data)
        },
      })

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            children={(field) => {
              return (
                <input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={'First name'}
                />
              )
            }}
          />
          <button onClick={form.handleSubmit}>Submit</button>
          {submittedData && <p>Submitted data: {submittedData.firstName}</p>}
        </form.Provider>
      )
    }

    const { findByPlaceholderText, getByText } = render(<Comp />)
    const input = await findByPlaceholderText('First name')
    await user.clear(input)
    await user.type(input, 'OtherName')
    await user.click(getByText('Submit'))
    await waitFor(() =>
      expect(getByText('Submitted data: OtherName')).toBeInTheDocument(),
    )
  })

  it('should run on form mount', async () => {
    function Comp() {
      const [formMounted, setFormMounted] = React.useState(false)
      const [mountForm, setMountForm] = React.useState(false)

      const form = useForm({
        defaultValues: {
          firstName: 'FirstName',
        },
        onMount: () => {
          setFormMounted(true)
          return undefined
        },
      })

      return (
        <>
          {mountForm ? (
            <form.Provider>
              <h1>{formMounted ? 'Form mounted' : 'Not mounted'}</h1>
            </form.Provider>
          ) : (
            <button onClick={() => setMountForm(true)}>Mount form</button>
          )}
        </>
      )
    }

    const { getByText } = render(<Comp />)
    await user.click(getByText('Mount form'))
    await waitFor(() => expect(getByText('Form mounted')).toBeInTheDocument())
  })

  it('should validate async on change for the form', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const error = 'Please enter a different value'

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.useForm({
        onChange() {
          return error
        },
      })
      return (
        <form.Provider>
          <form.Field
            name="firstName"
            children={(field) => (
              <input
                data-testid="fieldinput"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <form.Subscribe selector={(state) => state.errorMap}>
            {(errorMap) => <p>{errorMap.onChange}</p>}
          </form.Subscribe>
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

  it('should not validate on change if isTouched is false', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const error = 'Please enter a different value'

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.useForm({
        onChange: (value) => (value.firstName === 'other' ? error : undefined),
      })

      const errors = form.useStore((s) => s.errors)
      return (
        <form.Provider>
          <form.Field
            name="firstName"
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.setValue(e.target.value)}
                />
                <p>{errors}</p>
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

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.useForm({
        onChange: (value) => (value.firstName === 'other' ? error : undefined),
      })
      const errors = form.useStore((s) => s.errorMap)
      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <p>{errors.onChange}</p>
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

  it('should validate on change and on blur', async () => {
    const onChangeError = 'Please enter a different value (onChangeError)'
    const onBlurError = 'Please enter a different value (onBlurError)'

    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
        },
        onChange: (vals) => {
          if (vals.firstName === 'other') return onChangeError
          return undefined
        },
        onBlur: (vals) => {
          if (vals.firstName === 'other') return onBlurError
          return undefined
        },
      })

      const errors = form.useStore((s) => s.errorMap)
      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <p>{errors.onChange}</p>
                <p>{errors.onBlur}</p>
              </div>
            )}
          />
        </form.Provider>
      )
    }
    const { getByTestId, getByText, queryByText } = render(<Comp />)
    const input = getByTestId('fieldinput')
    expect(queryByText(onChangeError)).not.toBeInTheDocument()
    expect(queryByText(onBlurError)).not.toBeInTheDocument()
    await user.type(input, 'other')
    expect(getByText(onChangeError)).toBeInTheDocument()
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
      const form = formFactory.useForm({
        onChangeAsync: async () => {
          await sleep(10)
          return error
        },
      })
      const errors = form.useStore((s) => s.errorMap)
      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <p>{errors.onChange}</p>
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

  it('should validate async on change and async on blur', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const onChangeError = 'Please enter a different value (onChangeError)'
    const onBlurError = 'Please enter a different value (onBlurError)'

    const formFactory = createFormFactory<Person, unknown>()

    function Comp() {
      const form = formFactory.useForm({
        onChangeAsync: async () => {
          await sleep(10)
          return onChangeError
        },
        onBlurAsync: async () => {
          await sleep(10)
          return onBlurError
        },
      })
      const errors = form.useStore((s) => s.errorMap)

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <p>{errors.onChange}</p>
                <p>{errors.onBlur}</p>
              </div>
            )}
          />
        </form.Provider>
      )
    }

    const { getByTestId, getByText, queryByText } = render(<Comp />)
    const input = getByTestId('fieldinput')

    expect(queryByText(onChangeError)).not.toBeInTheDocument()
    expect(queryByText(onBlurError)).not.toBeInTheDocument()
    await user.type(input, 'other')
    await waitFor(() => getByText(onChangeError))
    expect(getByText(onChangeError)).toBeInTheDocument()
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
      const form = formFactory.useForm({
        onChangeAsyncDebounceMs: 100,
        onChangeAsync: async () => {
          mockFn()
          await sleep(10)
          return error
        },
      })
      const errors = form.useStore((s) => s.errors)

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <p>{errors}</p>
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

/// <reference lib="dom" />
import * as React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { createFormFactory, useForm } from '../index'
import { sleep } from './utils'
import type { FieldApi, FormApi } from '../index'

const user = userEvent.setup()

describe('useField', () => {
  it('should allow to set default value', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person>()

    function Comp() {
      const form = formFactory.useForm({
        name: 'example-form',
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

    const { getByTestId } = render(<Comp />)
    const input = getByTestId('fieldinput')
    expect(input).toHaveValue('FirstName')
  })

  it('should use field default value first', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person>()

    function Comp() {
      const form = formFactory.useForm({
        name: 'example-form',
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        },
      })

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultValue="otherName"
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

    const formFactory = createFormFactory<Person>()

    function Comp() {
      const form = formFactory.useForm({ name: 'example-form' })

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            validators={{
              onChange: ({ value }) => (value === 'other' ? error : undefined),
            }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.setValue(e.target.value)}
                />
                <p>{field.getMeta().errors}</p>
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
      const form = formFactory.useForm({ name: 'example-form' })

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            validators={{
              onChange: ({ value }) => (value === 'other' ? error : undefined),
            }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <p>{field.getMeta().errorMap?.onChange}</p>
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
    type Person = {
      firstName: string
      lastName: string
    }
    const onChangeError = 'Please enter a different value (onChangeError)'
    const onBlurError = 'Please enter a different value (onBlurError)'

    const formFactory = createFormFactory<Person>()

    function Comp() {
      const form = formFactory.useForm({ name: 'example-form' })

      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            validators={{
              onChange: ({ value }) =>
                value === 'other' ? onChangeError : undefined,
              onBlur: ({ value }) =>
                value === 'other' ? onBlurError : undefined,
            }}
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <p>{field.getMeta().errorMap?.onChange}</p>
                <p>{field.getMeta().errorMap?.onBlur}</p>
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

    const formFactory = createFormFactory<Person>()

    function Comp() {
      const form = formFactory.useForm({ name: 'example-form' })

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
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <p>{field.getMeta().errorMap?.onChange}</p>
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

    const formFactory = createFormFactory<Person>()

    function Comp() {
      const form = formFactory.useForm({ name: 'example-form' })

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
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <p>{field.getMeta().errorMap?.onChange}</p>
                <p>{field.getMeta().errorMap?.onBlur}</p>
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
    const formFactory = createFormFactory<Person>()

    function Comp() {
      const form = formFactory.useForm({ name: 'example-form' })

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
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <p>{field.getMeta().errors}</p>
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

  it('should preserve value when preserve value property is true', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const formFactory = createFormFactory<Person>()
    let form: FormApi<Person> | null = null
    function Comp() {
      form = formFactory.useForm({ name: 'example-form' })
      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultValue="hello"
            preserveValue={true}
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

    const { getByTestId, unmount, rerender } = render(<Comp />)
    const input = getByTestId('fieldinput')
    expect(input).toHaveValue('hello')
    await user.type(input, 'world')
    unmount()
    expect(form!.fieldInfo['firstName']).toBeDefined()
  })

  it('should not preserve value when preserve value property is false', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const formFactory = createFormFactory<Person>()
    let form: FormApi<Person> | null = null
    function Comp() {
      form = formFactory.useForm({ name: 'example-form' })
      return (
        <form.Provider>
          <form.Field
            name="firstName"
            defaultValue="hello"
            preserveValue={false}
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

    const { getByTestId, unmount } = render(<Comp />)
    const input = getByTestId('fieldinput')
    expect(input).toHaveValue('hello')
    unmount()
    const info = form!.fieldInfo
    expect(Object.keys(info)).toHaveLength(0)
  })

  it('should handle strict mode properly with conditional fields', async () => {
    function FieldInfo({ field }: { field: FieldApi<any, any> }) {
      return (
        <>
          {field.state.meta.touchedErrors ? (
            <em>{field.state.meta.touchedErrors}</em>
          ) : null}
          {field.state.meta.isValidating ? 'Validating...' : null}
        </>
      )
    }

    function Comp() {
      const [showField, setShowField] = React.useState(true)

      const form = useForm({
        name: 'example-form',
        defaultValues: {
          firstName: '',
          lastName: '',
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onSubmit: async () => {},
      })

      return (
        <div>
          <form.Provider>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void form.handleSubmit()
              }}
            >
              <div>
                {/* A type-safe field component*/}
                {showField ? (
                  <form.Field
                    name="firstName"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'A first name is required' : undefined,
                    }}
                    children={(field) => {
                      // Avoid hasty abstractions. Render props are great!
                      return (
                        <>
                          <label htmlFor={field.name}>First Name:</label>
                          <input
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldInfo field={field} />
                        </>
                      )
                    }}
                  />
                ) : null}
              </div>
              <div>
                <form.Field
                  name="lastName"
                  children={(field) => (
                    <>
                      <label htmlFor={field.name}>Last Name:</label>
                      <input
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </>
                  )}
                />
              </div>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? '...' : 'Submit'}
                  </button>
                )}
              />
              <button
                type="button"
                onClick={() => setShowField((prev) => !prev)}
              >
                {showField ? 'Hide field' : 'Show field'}
              </button>
            </form>
          </form.Provider>
        </div>
      )
    }

    const { getByText, findByText, queryByText } = render(
      <React.StrictMode>
        <Comp />
      </React.StrictMode>,
    )

    await user.click(getByText('Submit'))
    expect(await findByText('A first name is required')).toBeInTheDocument()
    await user.click(getByText('Hide field'))
    await user.click(getByText('Submit'))
    expect(queryByText('A first name is required')).not.toBeInTheDocument()
  })
})

import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useForm } from '../src/index'
import { sleep } from './utils'
import type { FieldApi, FormApi } from '../src/index'
import { StrictMode } from 'react'

const user = userEvent.setup()

describe('useField', () => {
  it('should allow to set default value', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        } as Person,
      })

      return (
        <>
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
        </>
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

    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        } as Person,
      })

      return (
        <>
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
        </>
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

    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        } as Person,
      })

      return (
        <>
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
        </>
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

    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        } as Person,
      })

      return (
        <>
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
        </>
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

    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        } as Person,
      })

      return (
        <>
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
        </>
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

    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        } as Person,
      })

      return (
        <>
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
        </>
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

    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        } as Person,
      })

      return (
        <>
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
        </>
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

    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        } as Person,
      })

      return (
        <>
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
        </>
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
        defaultValues: {
          firstName: '',
          lastName: '',
        },
        // eslint-disable-next-line ts/no-empty-function
        onSubmit: async () => {},
      })

      return (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
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
            <button type="button" onClick={() => setShowField((prev) => !prev)}>
              {showField ? 'Hide field' : 'Show field'}
            </button>
          </form>
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

  it('should handle arrays with primitive values', async () => {
    const fn = vi.fn()
    function Comp() {
      const form = useForm({
        defaultValues: {
          people: [] as Array<string>,
        },
        onSubmit: ({ value }) => fn(value),
      })

      return (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.Field name="people">
              {(field) => {
                return (
                  <div>
                    {field.state.value.map((_, i) => {
                      return (
                        <form.Field key={i} name={`people[${i}]`}>
                          {(subField) => {
                            return (
                              <div>
                                <label>
                                  <div>Name for person {i}</div>
                                  <input
                                    value={subField.state.value}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                  />
                                </label>
                                <button
                                  onClick={() => field.removeValue(i)}
                                  type="button"
                                >
                                  Remove person {i}
                                </button>
                              </div>
                            )
                          }}
                        </form.Field>
                      )
                    })}
                    <button onClick={() => field.pushValue('')} type="button">
                      Add person
                    </button>
                  </div>
                )
              }}
            </form.Field>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? '...' : 'Submit'}
                </button>
              )}
            />
          </form>
        </div>
      )
    }

    const { getByText, findByLabelText, queryByText, findByText } = render(
      <Comp />,
    )

    expect(queryByText('Name for person 0')).not.toBeInTheDocument()
    expect(queryByText('Name for person 1')).not.toBeInTheDocument()
    await user.click(getByText('Add person'))
    const input = await findByLabelText('Name for person 0')
    expect(input).toBeInTheDocument()
    await user.type(input, 'John')

    await user.click(getByText('Add person'))
    const input2 = await findByLabelText('Name for person 1')
    expect(input).toBeInTheDocument()
    await user.type(input2, 'Jack')

    expect(queryByText('Name for person 0')).toBeInTheDocument()
    expect(queryByText('Name for person 1')).toBeInTheDocument()
    await user.click(getByText('Remove person 1'))
    expect(queryByText('Name for person 0')).toBeInTheDocument()
    expect(queryByText('Name for person 1')).not.toBeInTheDocument()

    await user.click(await findByText('Submit'))
    expect(fn).toHaveBeenCalledWith({ people: ['John'] })
  })

  it('should handle arrays with subvalues', async () => {
    const fn = vi.fn()
    function Comp() {
      const form = useForm({
        defaultValues: {
          people: [] as Array<{ age: number; name: string }>,
        },
        onSubmit: ({ value }) => fn(value),
      })

      return (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.Field name="people">
              {(field) => {
                return (
                  <div>
                    {field.state.value.map((_, i) => {
                      return (
                        <form.Field key={i} name={`people[${i}].name`}>
                          {(subField) => {
                            return (
                              <div>
                                <label>
                                  <div>Name for person {i}</div>
                                  <input
                                    value={subField.state.value}
                                    onChange={(e) =>
                                      subField.handleChange(e.target.value)
                                    }
                                  />
                                </label>
                                <button
                                  onClick={() => field.removeValue(i)}
                                  type="button"
                                >
                                  Remove person {i}
                                </button>
                              </div>
                            )
                          }}
                        </form.Field>
                      )
                    })}
                    <button
                      onClick={() => field.pushValue({ name: '', age: 0 })}
                      type="button"
                    >
                      Add person
                    </button>
                  </div>
                )
              }}
            </form.Field>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? '...' : 'Submit'}
                </button>
              )}
            />
          </form>
        </div>
      )
    }

    const { getByText, findByLabelText, queryByText, findByText } = render(
      <Comp />,
    )

    expect(queryByText('Name for person 0')).not.toBeInTheDocument()
    expect(queryByText('Name for person 1')).not.toBeInTheDocument()
    await user.click(getByText('Add person'))
    const input = await findByLabelText('Name for person 0')
    expect(input).toBeInTheDocument()
    await user.type(input, 'John')

    await user.click(getByText('Add person'))
    const input2 = await findByLabelText('Name for person 1')
    expect(input).toBeInTheDocument()
    await user.type(input2, 'Jack')

    expect(queryByText('Name for person 0')).toBeInTheDocument()
    expect(queryByText('Name for person 1')).toBeInTheDocument()
    await user.click(getByText('Remove person 1'))
    expect(queryByText('Name for person 0')).toBeInTheDocument()
    expect(queryByText('Name for person 1')).not.toBeInTheDocument()

    await user.click(await findByText('Submit'))
    expect(fn).toHaveBeenCalledWith({ people: [{ name: 'John', age: 0 }] })
  })

  it('should handle sync linked fields', async () => {
    const fn = vi.fn()
    function Comp() {
      const form = useForm({
        defaultValues: {
          password: '',
          confirm_password: '',
        },
        onSubmit: ({ value }) => fn(value),
      })

      return (
        <div>
          <form.Field name="password">
            {(field) => {
              return (
                <div>
                  <label>
                    <div>Password</div>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </label>
                </div>
              )
            }}
          </form.Field>
          <form.Field
            name="confirm_password"
            validators={{
              onChangeListenTo: ['password'],
              onChange: ({ value, fieldApi }) => {
                if (value !== fieldApi.form.getFieldValue('password')) {
                  return 'Passwords do not match'
                }
                return undefined
              },
            }}
          >
            {(field) => {
              return (
                <div>
                  <label>
                    <div>Confirm Password</div>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </label>
                  {field.state.meta.errors.map((err) => {
                    return <div key={err?.toString()}>{err}</div>
                  })}
                </div>
              )
            }}
          </form.Field>
        </div>
      )
    }

    const { findByLabelText, queryByText, findByText } = render(<Comp />)

    const passwordInput = await findByLabelText('Password')
    const confirmPasswordInput = await findByLabelText('Confirm Password')
    await user.type(passwordInput, 'password')
    await user.type(confirmPasswordInput, 'password')
    expect(queryByText('Passwords do not match')).not.toBeInTheDocument()
    await user.type(confirmPasswordInput, '1')
    expect(await findByText('Passwords do not match')).toBeInTheDocument()
  })

  it('should handle deeply nested values in StrictMode', async () => {
    function Comp() {
      const form = useForm({
        defaultValues: {
          name: { first: 'Test', last: 'User' },
        },
      })

      return (
        <form.Field
          name="name.last"
          children={(field) => <p>{field.state.value ?? ''}</p>}
        />
      )
    }

    const { queryByText, findByText } = render(
      <React.StrictMode>
        <Comp />
      </React.StrictMode>,
    )

    expect(queryByText('Test')).not.toBeInTheDocument()
    expect(await findByText('User')).toBeInTheDocument()
  })

  it('should validate async on submit without debounce', async () => {
    type Person = {
      firstName: string
      lastName: string
    }
    const mockFn = vi.fn()
    const error = 'Please enter a different value'

    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        } as Person,
        validators: {
          onChangeAsyncDebounceMs: 1000000,
          onChangeAsync: async () => {
            mockFn()
            await sleep(10)
            return error
          },
        },
      })
      const errors = form.useStore((s) => s.errors)

      return (
        <>
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
          <button onClick={form.handleSubmit}>Submit</button>
        </>
      )
    }

    const { getByRole, getByText } = render(<Comp />)
    await user.click(getByRole('button', { name: 'Submit' }))

    expect(mockFn).toHaveBeenCalledTimes(1)
    await waitFor(() => getByText(error))
    expect(getByText(error)).toBeInTheDocument()
  })

  it('should validate allow pushvalue to implicitly set a default value', async () => {
    type Person = {
      people: string[]
    }

    function Comp() {
      const form = useForm({
        defaultValues: {
          people: [],
        } as Person,
      })

      return (
        <form.Field name="people" mode="array">
          {(field) => {
            return (
              <div>
                <pre>{JSON.stringify(field.state.value)}</pre>
                {field.state.value.map((_, i) => {
                  return (
                    <form.Field key={i} name={`people[${i}]`}>
                      {(subField) => {
                        return (
                          <div>
                            <label>
                              <div>Name for person {i}</div>
                              <input
                                name={subField.name}
                                value={subField.state.value}
                                onChange={(e) =>
                                  subField.handleChange(e.target.value)
                                }
                              />
                            </label>
                          </div>
                        )
                      }}
                    </form.Field>
                  )
                })}
                <button onClick={() => field.pushValue('')} type="button">
                  Add person
                </button>
              </div>
            )
          }}
        </form.Field>
      )
    }

    const { getByText, queryByText } = render(
      <StrictMode>
        <Comp />
      </StrictMode>,
    )
    expect(getByText('[]')).toBeInTheDocument()
    await user.click(getByText('Add person'))
    expect(getByText(`[""]`)).toBeInTheDocument()
  })

  it('should validate allow pushvalue to implicitly set a pushed default value', async () => {
    type Person = {
      people: string[]
    }

    function Comp() {
      const form = useForm({
        defaultValues: {
          people: [],
        } as Person,
      })

      return (
        <form.Field name="people" mode="array">
          {(field) => {
            return (
              <div>
                <pre>{JSON.stringify(field.state.value)}</pre>
                {field.state.value.map((_, i) => {
                  return (
                    <form.Field key={i} name={`people[${i}]`}>
                      {(subField) => {
                        return (
                          <div>
                            <label>
                              <div>Name for person {i}</div>
                              <input
                                name={subField.name}
                                value={subField.state.value}
                                onChange={(e) =>
                                  subField.handleChange(e.target.value)
                                }
                              />
                            </label>
                          </div>
                        )
                      }}
                    </form.Field>
                  )
                })}
                <button onClick={() => field.pushValue('Test')} type="button">
                  Add person
                </button>
              </div>
            )
          }}
        </form.Field>
      )
    }

    const { getByText, queryByText } = render(
      <StrictMode>
        <Comp />
      </StrictMode>,
    )
    expect(getByText('[]')).toBeInTheDocument()
    await user.click(getByText('Add person'))
    expect(getByText(`["Test"]`)).toBeInTheDocument()
  })
})

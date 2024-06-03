import { describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { Index, Show, createEffect } from 'solid-js'
import { createForm } from '../index'
import { sleep } from './utils'

const user = userEvent.setup()

describe('createField', () => {
  it('should allow to set default value', () => {
    type Person = {
      firstName: string
      lastName: string
    }

    function Comp() {
      const form = createForm<Person>()

      return (
        <>
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
        </>
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

    function Comp() {
      const form = createForm<Person>(() => ({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        },
      }))

      return (
        <>
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
        </>
      )
    }

    const { getByTestId } = render(() => <Comp />)
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
      const form = createForm<Person>()

      return (
        <>
          <form.Field
            name="firstName"
            validators={{
              onChange: ({ value }) =>
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
        </>
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

    function Comp() {
      const form = createForm<Person>()

      return (
        <>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            validators={{
              onChange: ({ value }) =>
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
        </>
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

    function Comp() {
      const form = createForm<Person>()

      return (
        <>
          <form.Field
            name="firstName"
            defaultMeta={{ isTouched: true }}
            validators={{
              onChange: ({ value }) =>
                value.includes('other') ? onChangeError : undefined,
              onBlur: ({ value }) =>
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
        </>
      )
    }

    const { getByTestId, getByText, queryByText } = render(() => <Comp />)
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
      const form = createForm<Person>()

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
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                />
                <p>{field().getMeta().errorMap.onChange}</p>
              </div>
            )}
          />
        </>
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

    function Comp() {
      const form = createForm<Person>()

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
        </>
      )
    }

    const { getByTestId, getByText, queryByText } = render(() => <Comp />)
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
      const form = createForm<Person>()

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
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.currentTarget.value)}
                />
                <p>{field().getMeta().errors}</p>
              </div>
            )}
          />
        </>
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

  it('should handle arrays with primitive values', async () => {
    const fn = vi.fn()

    function Comp() {
      const form = createForm(() => ({
        defaultValues: {
          people: [] as Array<string>,
        },
        onSubmit: ({ value }) => fn(value),
      }))
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
              {(field) => (
                <div>
                  <Show when={field().state.value.length > 0}>
                    {/* Do not change this to For or the test will fail */}
                    <Index each={field().state.value}>
                      {(_, i) => {
                        return (
                          <form.Field name={`people[${i}]`}>
                            {(subField) => (
                              <div>
                                <label>
                                  <div>Name for person {i}</div>
                                  <input
                                    value={subField().state.value}
                                    onInput={(e) => {
                                      subField().handleChange(
                                        e.currentTarget.value,
                                      )
                                    }}
                                  />
                                </label>
                                <button
                                  onClick={() => field().removeValue(i)}
                                  type="button"
                                >
                                  Remove person {i}
                                </button>
                              </div>
                            )}
                          </form.Field>
                        )
                      }}
                    </Index>
                  </Show>

                  <button onClick={() => field().pushValue('')} type="button">
                    Add person
                  </button>
                </div>
              )}
            </form.Field>
            <button type="submit">Submit</button>
          </form>
        </div>
      )
    }

    const { getByText, findByLabelText, queryByText, findByText } = render(
      () => <Comp />,
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
      const form = createForm(() => ({
        defaultValues: {
          people: [] as Array<{ age: number; name: string }>,
        },
        onSubmit: ({ value }) => fn(value),
      }))

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
              {(field) => (
                <div>
                  <Show when={field().state.value.length > 0}>
                    {/* Do not change this to For or the test will fail */}
                    <Index each={field().state.value}>
                      {(_, i) => {
                        return (
                          <form.Field name={`people[${i}].name`}>
                            {(subField) => (
                              <div>
                                <label>
                                  <div>Name for person {i}</div>
                                  <input
                                    value={subField().state.value}
                                    onInput={(e) => {
                                      subField().handleChange(
                                        e.currentTarget.value,
                                      )
                                    }}
                                  />
                                </label>
                                <button
                                  onClick={() => field().removeValue(i)}
                                  type="button"
                                >
                                  Remove person {i}
                                </button>
                              </div>
                            )}
                          </form.Field>
                        )
                      }}
                    </Index>
                  </Show>

                  <button
                    onClick={() => field().pushValue({ name: '', age: 0 })}
                    type="button"
                  >
                    Add person
                  </button>
                </div>
              )}
            </form.Field>
            <button type="submit">Submit</button>
          </form>
        </div>
      )
    }

    const { getByText, findByLabelText, queryByText, findByText } = render(
      () => <Comp />,
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
})

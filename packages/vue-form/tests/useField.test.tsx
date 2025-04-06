import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { render, waitFor } from '@testing-library/vue'
import { userEvent } from '@testing-library/user-event'
import { useForm } from '../src'
import { sleep } from './utils'
import type { AnyFieldApi } from '../src'

const user = userEvent.setup()

describe('useField', () => {
  it('should allow to set default value', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const Comp = defineComponent(() => {
      const form = useForm(() => ({
        defaultValues: {} as Person,
      }))

      return () => (
        <form.Field name="firstName" defaultValue="FirstName">
          {({ field, value }: { field: AnyFieldApi; value: any }) => (
            <input
              data-testid={'fieldinput'}
              value={value}
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

    const Comp = defineComponent(() => {
      const form = useForm(() => ({ defaultValues: {} as Person }))

      return () => (
        <form.Field
          name="firstName"
          validators={{
            onChange: ({ value }) => (value === 'other' ? error : undefined),
          }}
        >
          {({ field, value }: { field: AnyFieldApi; value: any }) => (
            <div>
              <input
                data-testid="fieldinput"
                name={field.name}
                value={value}
                onBlur={field.handleBlur}
                onInput={(e) =>
                  field.setValue((e.target as HTMLInputElement).value, {
                    dontUpdateMeta: true,
                  })
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

    const Comp = defineComponent(() => {
      const form = useForm(() => ({ defaultValues: {} as Person }))

      return () => (
        <form.Field
          name="firstName"
          validators={{
            onChange: ({ value }) => (value === 'other' ? error : undefined),
          }}
        >
          {({ field, value }: { field: AnyFieldApi; value: any }) => (
            <div>
              <input
                data-testid="fieldinput"
                name={field.name}
                value={value}
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

    const Comp = defineComponent(() => {
      const form = useForm(() => ({ defaultValues: {} as Person }))

      return () => (
        <form.Field
          name="firstName"
          defaultMeta={{ isTouched: true }}
          validators={{
            onChangeAsync: async () => {
              await sleep(10)
              return error
            },
          }}
        >
          {({
            field,
            value,
            meta,
          }: {
            field: AnyFieldApi
            value: any
            meta: any
          }) => (
            <div>
              <input
                data-testid="fieldinput"
                name={field.name}
                value={value}
                onBlur={field.handleBlur}
                onInput={(e) =>
                  field.handleChange((e.target as HTMLInputElement).value)
                }
              />
              <p>{meta.errors}</p>
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

    const Comp = defineComponent(() => {
      const form = useForm(() => ({ defaultValues: {} as Person }))

      return () => (
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
        >
          {({
            field,
            value,
            meta,
          }: {
            field: AnyFieldApi
            value: any
            meta: any
          }) => (
            <div>
              <input
                data-testid="fieldinput"
                name={field.name}
                value={value}
                onBlur={field.handleBlur}
                onInput={(e) =>
                  field.handleChange((e.target as HTMLInputElement).value)
                }
              />
              <p>{meta.errors}</p>
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

  it('should handle arrays with subvalues', async () => {
    const fn = vi.fn()

    type CompVal = { people: Array<string> }

    const Comp = defineComponent(() => {
      const form = useForm(() => ({
        defaultValues: {
          people: [],
        } as CompVal,
        onSubmit: ({ value }) => fn(value),
      }))

      return () => (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.Field name="people">
              {({ field }: { field: AnyFieldApi }) => (
                <div>
                  {field.state.value.map((_: never, i: number) => {
                    return (
                      <form.Field key={i} name={`people[${i}]`}>
                        {({
                          field: subField,
                          value,
                        }: {
                          field: AnyFieldApi
                          value: any
                        }) => (
                          <div>
                            <label>
                              <div>Name for person {i}</div>
                              <input
                                value={value}
                                onChange={(e) =>
                                  subField.handleChange(
                                    (e.target as HTMLInputElement).value,
                                  )
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
                        )}
                      </form.Field>
                    )
                  })}
                  <button onClick={() => field.pushValue('')} type="button">
                    Add person
                  </button>
                </div>
              )}
            </form.Field>
            <button type="submit">Submit</button>
          </form>
        </div>
      )
    })

    const { queryByText, getByText, findByLabelText, findByText } = render(Comp)
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

    type CompVal = { people: Array<{ age: number; name: string }> }

    const Comp = defineComponent(() => {
      const form = useForm(() => ({
        defaultValues: {
          people: [],
        } as CompVal,
        onSubmit: ({ value }) => fn(value),
      }))

      return () => (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <form.Field name="people">
              {({ field }: { field: AnyFieldApi }) => (
                <div>
                  {field.state.value.map((_: never, i: number) => {
                    return (
                      <form.Field key={i} name={`people[${i}].name`}>
                        {({
                          field: subField,
                          value,
                        }: {
                          field: AnyFieldApi
                          value: any
                        }) => (
                          <div>
                            <label>
                              <div>Name for person {i}</div>
                              <input
                                value={value}
                                onChange={(e) =>
                                  subField.handleChange(
                                    (e.target as HTMLInputElement).value,
                                  )
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
                        )}
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
              )}
            </form.Field>
            <button type="submit">Submit</button>
          </form>
        </div>
      )
    })

    const { queryByText, getByText, findByLabelText, findByText } = render(Comp)
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

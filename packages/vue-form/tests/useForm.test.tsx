import { describe, expect, it, vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { render, waitFor } from '@testing-library/vue'
import { defineComponent, h, ref } from 'vue'
import { useForm } from '../src/index'
import { sleep } from './utils'

import type { FieldApi, ValidationErrorMap } from '../src/index'

const user = userEvent.setup()

type Person = {
  firstName: string
  lastName: string
}

describe('useForm', () => {
  it('preserved field state', async () => {
    const Comp = defineComponent(() => {
      const form = useForm<Person>()

      return () => (
        <form.Field name="firstName" defaultValue="">
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

    const { getByTestId, queryByText } = render(<Comp />)
    const input = getByTestId('fieldinput')
    expect(queryByText('FirstName')).not.toBeInTheDocument()
    await user.type(input, 'FirstName')
    expect(input).toHaveValue('FirstName')
  })

  it('should allow default values to be set', async () => {
    const Comp = defineComponent(() => {
      const form = useForm({
        defaultValues: {
          firstName: 'FirstName',
          lastName: 'LastName',
        } as Person,
      })

      return () => (
        <form.Field name="firstName">
          {({
            field,
          }: {
            field: FieldApi<Person, 'firstName', never, never>
          }) => <p>{field.state.value}</p>}
        </form.Field>
      )
    })

    const { findByText, queryByText } = render(<Comp />)
    expect(await findByText('FirstName')).toBeInTheDocument()
    expect(queryByText('LastName')).not.toBeInTheDocument()
  })

  it('should handle submitting properly', async () => {
    const Comp = defineComponent(() => {
      const submittedData = ref<{ firstName: string }>()

      const form = useForm({
        defaultValues: {
          firstName: 'FirstName',
        },
        onSubmit: ({ value }) => {
          submittedData.value = value
        },
      })

      return () => (
        <div>
          <form.Field name="firstName">
            {({
              field,
            }: {
              field: FieldApi<Person, 'firstName', never, never>
            }) => {
              return (
                <input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onInput={(e) =>
                    field.handleChange((e.target as HTMLInputElement).value)
                  }
                  placeholder={'First name'}
                />
              )
            }}
          </form.Field>
          <button onClick={form.handleSubmit}>Submit</button>
          {submittedData.value && (
            <p>Submitted data: {submittedData.value.firstName}</p>
          )}
        </div>
      )
    })

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
    const Comp = defineComponent(() => {
      const formMounted = ref(false)
      const mountForm = ref(false)

      const form = useForm({
        defaultValues: {
          firstName: 'FirstName',
        },
        validators: {
          onMount: () => {
            formMounted.value = true
            return undefined
          },
        },
      })

      return () =>
        mountForm.value ? (
          <div>
            <h1>{formMounted.value ? 'Form mounted' : 'Not mounted'}</h1>
          </div>
        ) : (
          <button onClick={() => (mountForm.value = true)}>Mount form</button>
        )
    })

    const { getByText, findByText } = render(<Comp />)
    await user.click(getByText('Mount form'))
    expect(await findByText('Form mounted')).toBeInTheDocument()
  })

  it('should validate async on change for the form', async () => {
    const error = 'Please enter a different value'

    const Comp = defineComponent(() => {
      const form = useForm<Person>({
        validators: {
          onChange() {
            return error
          },
        },
      })

      return () => (
        <div>
          <form.Field name="firstName">
            {({
              field,
            }: {
              field: FieldApi<Person, 'firstName', never, never>
            }) => (
              <input
                data-testid="fieldinput"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onInput={(e) =>
                  field.handleChange((e.target as HTMLInputElement).value)
                }
              />
            )}
          </form.Field>
          <form.Subscribe selector={(state) => state.errorMap}>
            {(errorMap: ValidationErrorMap) => <p>{errorMap.onChange}</p>}
          </form.Subscribe>
        </div>
      )
    })

    const { getByTestId, getByText, queryByText } = render(<Comp />)
    const input = getByTestId('fieldinput')
    expect(queryByText(error)).not.toBeInTheDocument()
    await user.type(input, 'other')
    await waitFor(() => getByText(error))
    expect(getByText(error)).toBeInTheDocument()
  })
  it('should not validate on change if isTouched is false', async () => {
    const error = 'Please enter a different value'

    const Comp = defineComponent(() => {
      const form = useForm<Person>({
        validators: {
          onChange: ({ value }) =>
            value.firstName === 'other' ? error : undefined,
        },
      })

      const errors = form.useStore((s) => s.errors)

      return () => (
        <div>
          <form.Field name="firstName">
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
              </div>
            )}
          </form.Field>
          <p>{errors}</p>
        </div>
      )
    })

    const { getByTestId, queryByText } = render(<Comp />)
    const input = getByTestId('fieldinput')
    await user.type(input, 'other')
    expect(queryByText(error)).not.toBeInTheDocument()
  })

  it('should validate on change if isTouched is true', async () => {
    const error = 'Please enter a different value'

    const Comp = defineComponent(() => {
      const form = useForm<Person>({
        validators: {
          onChange: ({ value }) =>
            value.firstName === 'other' ? error : undefined,
        },
      })

      const errors = form.useStore((s) => s.errorMap)

      return () => (
        <div>
          <form.Field name="firstName" defaultMeta={{ isTouched: true }}>
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
                <p>{errors.value.onChange}</p>
              </div>
            )}
          </form.Field>
        </div>
      )
    })

    const { getByTestId, getByText, queryByText } = render(<Comp />)
    const input = getByTestId('fieldinput')
    expect(queryByText(error)).not.toBeInTheDocument()
    await user.type(input, 'other')
    expect(getByText(error)).toBeInTheDocument()
  })

  it('should validate on change and on blur', async () => {
    const onChangeError = 'Please enter a different value (onChangeError)'
    const onBlurError = 'Please enter a different value (onBlurError)'

    const Comp = defineComponent(() => {
      const form = useForm({
        defaultValues: {
          firstName: '',
        },
        validators: {
          onChange: ({ value }) => {
            if (value.firstName === 'other') return onChangeError
            return undefined
          },
          onBlur: ({ value }) => {
            if (value.firstName === 'other') return onBlurError
            return undefined
          },
        },
      })

      const errors = form.useStore((s) => s.errorMap)

      return () => (
        <div>
          <form.Field name="firstName" defaultMeta={{ isTouched: true }}>
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
                <p>{errors.value.onChange}</p>
                <p>{errors.value.onBlur}</p>
              </div>
            )}
          </form.Field>
        </div>
      )
    })
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
    const error = 'Please enter a different value'

    const Comp = defineComponent(() => {
      const form = useForm<Person>({
        validators: {
          onChangeAsync: async () => {
            await sleep(10)
            return error
          },
        },
      })

      const errors = form.useStore((s) => s.errorMap)

      return () => (
        <div>
          <form.Field name="firstName" defaultMeta={{ isTouched: true }}>
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
                <p>{errors.value.onChange}</p>
              </div>
            )}
          </form.Field>
        </div>
      )
    })

    const { getByTestId, getByText, queryByText } = render(<Comp />)
    const input = getByTestId('fieldinput')
    expect(queryByText(error)).not.toBeInTheDocument()
    await user.type(input, 'other')
    await waitFor(() => getByText(error))
    expect(getByText(error)).toBeInTheDocument()
  })

  it('should validate async on change and async on blur', async () => {
    const onChangeError = 'Please enter a different value (onChangeError)'
    const onBlurError = 'Please enter a different value (onBlurError)'

    const Comp = defineComponent(() => {
      const form = useForm<Person>({
        validators: {
          onChangeAsync: async () => {
            await sleep(10)
            return onChangeError
          },
          onBlurAsync: async () => {
            await sleep(10)
            return onBlurError
          },
        },
      })
      const errors = form.useStore((s) => s.errorMap)

      return () => (
        <div>
          <form.Field name="firstName" defaultMeta={{ isTouched: true }}>
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
                <p>{errors.value.onChange}</p>
                <p>{errors.value.onBlur}</p>
              </div>
            )}
          </form.Field>
        </div>
      )
    })

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
    const mockFn = vi.fn()
    const error = 'Please enter a different value'

    const Comp = defineComponent(() => {
      const form = useForm<Person>({
        validators: {
          onChangeAsyncDebounceMs: 100,
          onChangeAsync: async () => {
            mockFn()
            await sleep(10)
            return error
          },
        },
      })
      const errors = form.useStore((s) => s.errors)

      return () => (
        <div>
          <form.Field name="firstName" defaultMeta={{ isTouched: true }}>
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
                <p>{errors.value.join(',')}</p>
              </div>
            )}
          </form.Field>
        </div>
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

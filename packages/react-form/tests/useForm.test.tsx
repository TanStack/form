import { describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useStore } from '@tanstack/react-store'
import { useEffect, useState } from 'react'
import { useForm } from '../src/index'
import { sleep } from './utils'

const user = userEvent.setup()

describe('useForm', () => {
  it('preserves field state', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    function Comp() {
      const form = useForm({
        defaultValues: {} as Person,
      })

      return (
        <>
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
        </>
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
              return <p>{field.state.value}</p>
            }}
          />
        </>
      )
    }

    const { findByText, queryByText } = render(<Comp />)
    expect(await findByText('FirstName')).toBeInTheDocument()
    expect(queryByText('LastName')).not.toBeInTheDocument()
  })

  it('should handle submitting properly', async () => {
    function Comp() {
      const [submittedData, setSubmittedData] = useState<{
        firstName: string
      } | null>(null)

      const form = useForm({
        defaultValues: {
          firstName: 'FirstName',
        },
        onSubmit: ({ value }) => {
          setSubmittedData(value)
        },
      })

      return (
        <>
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
        </>
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
      const [formMounted, setFormMounted] = useState(false)
      const [mountForm, setMountForm] = useState(false)

      const form = useForm({
        defaultValues: {
          firstName: 'FirstName',
        },
        validators: {
          onMount: () => {
            setFormMounted(true)
            return undefined
          },
        },
      })

      return (
        <>
          {mountForm ? (
            <>
              <h1>{formMounted ? 'Form mounted' : 'Not mounted'}</h1>
            </>
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

    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        } as Person,
        validators: {
          onChange() {
            return error
          },
        },
      })
      const onChangeError = useStore(form.store, (s) => s.errorMap.onChange)
      return (
        <>
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
          <p>{onChangeError?.toString()}</p>
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
        validators: {
          onChange: ({ value }) =>
            value.firstName === 'other' ? error : undefined,
        },
      })

      const errors = useStore(form.store, (s) => s.errors)
      return (
        <>
          <form.Field
            name="firstName"
            children={(field) => (
              <div>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.setValue(e.target.value, {
                      dontUpdateMeta: true,
                    })
                  }
                />
                <p>{errors}</p>
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
        validators: {
          onChange: ({ value }) =>
            value.firstName === 'other' ? error : undefined,
        },
      })
      const errors = useStore(form.store, (s) => s.errorMap)
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
                <p>{errors.onChange?.toString()}</p>
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
    const onChangeError = 'Please enter a different value (onChangeError)'
    const onBlurError = 'Please enter a different value (onBlurError)'

    function Comp() {
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

      const errors = useStore(form.store, (s) => s.errorMap)
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
                <p>{errors.onChange?.toString()}</p>
                <p>{errors.onBlur?.toString()}</p>
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

  it("should set field errors from the field's validators", async () => {
    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
        },
        validators: {
          onChange: ({ value }) => {
            if (value.firstName === 'other')
              return {
                form: 'Something went wrong',
                fields: {
                  firstName: 'Please enter a different value (onChangeError)',
                },
              }
            return undefined
          },
          onBlur: ({ value }) => {
            if (value.firstName === 'other')
              return 'Please enter a different value (onBlurError)'
            return undefined
          },
        },
      })

      const errors = useStore(form.store, (s) => s.errorMap)
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
                <p data-testid={'field-onchange'}>
                  {field.state.meta.errorMap.onChange}
                </p>
              </div>
            )}
          />
          <p data-testid={'form-onchange'}>{errors.onChange?.toString()}</p>
          <p data-testid={'form-onblur'}>{errors.onBlur?.toString()}</p>
        </>
      )
    }
    const { getByTestId } = render(<Comp />)

    expect(getByTestId('form-onchange')).toHaveTextContent('')

    const input = getByTestId('fieldinput')

    await user.type(input, 'other')
    expect(getByTestId('form-onchange')).toHaveTextContent(
      'Something went wrong',
    )
    expect(getByTestId('field-onchange')).toHaveTextContent(
      'Please enter a different value (onChangeError)',
    )

    await user.click(document.body)
    expect(getByTestId('form-onblur')).toHaveTextContent(
      'Please enter a different value (onBlurError)',
    )
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
        validators: {
          onChangeAsync: async () => {
            await sleep(10)
            return error
          },
        },
      })
      const errors = useStore(form.store, (s) => s.errorMap)
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
                <p>{errors.onChange?.toString()}</p>
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

  it("should set field errors from the the form's onChangeAsync validator", async () => {
    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        },
        validators: {
          onChangeAsync: async ({ value }) => {
            await sleep(10)
            if (value.firstName === 'other') {
              return {
                form: 'Invalid form values',
                fields: {
                  firstName: 'First name cannot be "other"',
                },
              }
            }
            return null
          },
        },
      })

      const errors = useStore(form.store, (s) => s.errorMap)

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
                <p data-testid="field-error">
                  {field.state.meta.errorMap.onChange}
                </p>
              </div>
            )}
          />
          <p data-testid="form-error">{errors.onChange?.toString()}</p>
        </>
      )
    }

    const { getByTestId } = render(<Comp />)
    const input = getByTestId('fieldinput')
    const firstNameErrorElement = getByTestId('field-error')
    const formErrorElement = getByTestId('form-error')

    expect(firstNameErrorElement).toBeEmptyDOMElement()
    expect(formErrorElement).toBeEmptyDOMElement()

    await user.type(input, 'other')

    await waitFor(() => {
      expect(firstNameErrorElement).not.toBeEmptyDOMElement()
    })
    expect(firstNameErrorElement).toHaveTextContent(
      'First name cannot be "other"',
    )
    expect(formErrorElement).toHaveTextContent('Invalid form values')
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
      const errors = useStore(form.store, (s) => s.errorMap)

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
                <p>{errors.onChange?.toString()}</p>
                <p>{errors.onBlur?.toString()}</p>
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
        validators: {
          onChangeAsyncDebounceMs: 100,
          onChangeAsync: async () => {
            mockFn()
            await sleep(10)
            return error
          },
        },
      })
      const errors = useStore(form.store, (s) => s.errors)

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

  it("should set errors on the fields from the form's onChange validator", async () => {
    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        },
        validators: {
          onChange: ({ value }) => {
            if (value.firstName === 'Tom') {
              return {
                form: 'Something went wrong',
                fields: { firstName: 'Please enter a different value' },
              }
            }
            return null
          },
        },
      })

      const onChangeError = useStore(form.store, (s) => s.errorMap.onChange)

      return (
        <>
          <form.Field
            name="firstName"
            children={(field) => (
              <>
                <input
                  data-testid="fieldinput"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />

                <p data-testid="field-error">
                  {field.state.meta.errors.join('')}
                </p>
              </>
            )}
          />
          <p data-testid="form-error">{onChangeError?.toString()}</p>
        </>
      )
    }

    const { getByTestId, queryByText } = render(<Comp />)
    const input = getByTestId('fieldinput')
    const fieldError = getByTestId('field-error')
    const formError = getByTestId('form-error')

    expect(
      queryByText('Please enter a different value'),
    ).not.toBeInTheDocument()
    expect(queryByText('Something went wrong')).not.toBeInTheDocument()

    await user.type(input, 'Tom')
    await waitFor(() =>
      expect(fieldError.textContent).toBe('Please enter a different value'),
    )
    await waitFor(() =>
      expect(formError.textContent).toBe('Something went wrong'),
    )
  })

  it('should not cause infinite re-renders when listening to state.errors', () => {
    const fn = vi.fn()

    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        },
        onSubmit: async ({ value }) => {
          // Do something with form data
          console.log(value)
        },
      })

      const { errors } = useStore(form.store, (state) => ({
        errors: state.errors,
      }))

      useEffect(() => {
        fn(errors)
      }, [errors])

      return null
    }

    render(<Comp />)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not cause infinite re-renders when listening to state', () => {
    const fn = vi.fn()

    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        },
        onSubmit: async ({ value }) => {
          // Do something with form data
          console.log(value)
        },
      })

      const { values } = useStore(form.store)

      useEffect(() => {
        fn(values)
      }, [values])

      return null
    }

    render(<Comp />)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('form should reset default value when resetting in onSubmit', async () => {
    function Comp() {
      const form = useForm({
        defaultValues: {
          name: '',
        },
        onSubmit: ({ value }) => {
          expect(value).toEqual({ name: 'another-test' })

          form.reset(value)
        },
      })

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field
            name="name"
            children={(field) => (
              <input
                data-testid="fieldinput"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />

          <button type="submit" data-testid="submit">
            submit
          </button>

          <button type="reset" data-testid="reset" onClick={() => form.reset()}>
            Reset
          </button>
        </form>
      )
    }

    const { getByTestId } = render(<Comp />)
    const input = getByTestId('fieldinput')
    const submit = getByTestId('submit')
    const reset = getByTestId('reset')

    await user.type(input, 'test')
    await waitFor(() => expect(input).toHaveValue('test'))

    await user.click(reset)
    await waitFor(() => expect(input).toHaveValue(''))

    await user.type(input, 'another-test')
    await user.click(submit)
    await waitFor(() => expect(input).toHaveValue('another-test'))
  })

  it('form should update when props are changed', async () => {
    function Comp() {
      const [defaultValue, setDefault] = useState<{
        name: string
      }>({ name: '' })

      const form = useForm({
        defaultValues: defaultValue,
        onSubmit: ({ value }) => {
          form.reset(value)
        },
      })

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field
            name="name"
            children={(field) => (
              <input
                data-testid="fieldinput"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />

          <button
            type="button"
            data-testid="change-props"
            onClick={() => setDefault({ name: 'props-change' })}
          >
            change props
          </button>

          <button
            type="button"
            data-testid="change-props-again"
            onClick={() => setDefault({ name: 'props-change-again' })}
          >
            change props again
          </button>
        </form>
      )
    }

    const { getByTestId } = render(<Comp />)
    const input = getByTestId('fieldinput')
    const changeProps = getByTestId('change-props')
    const changePropsAgain = getByTestId('change-props-again')

    await user.click(changeProps)
    await waitFor(() => expect(input).toHaveValue('props-change'))

    // checks stableRef is comparing against previously set default
    await user.click(changePropsAgain)
    await waitFor(() => expect(input).toHaveValue('props-change-again'))
  })
})

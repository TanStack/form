import { describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useStore } from '@tanstack/react-store'
import { useCallback, useEffect, useReducer, useState } from 'react'
import { mergeForm, useForm } from '../src/index'
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

  it('should accept formId and return it', async () => {
    function Comp() {
      const form = useForm({
        formId: 'test',
      })

      return (
        <>
          <form
            id={form.formId}
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          ></form>

          <form.Subscribe
            selector={(state) => state.submissionAttempts}
            children={(submissionAttempts) => (
              <span data-testid="formId-result">{submissionAttempts}</span>
            )}
          />

          <button type="submit" form={form.formId} data-testid="formId-target">
            {form.formId}
          </button>
        </>
      )
    }

    const { getByTestId } = render(<Comp />)
    const target = getByTestId('formId-target')
    const result = getByTestId('formId-result')

    await user.click(target)
    expect(result).toHaveTextContent('1')
  })

  it('should allow custom component keys for arrays', async () => {
    function Comp() {
      const form = useForm({
        defaultValues: {
          foo: [
            { name: 'nameA', id: 'a' },
            { name: 'nameB', id: 'b' },
            { name: 'nameC', id: 'c' },
          ],
        },
      })

      return (
        <>
          <form.Field name="foo" mode="array">
            {(arrayField) =>
              arrayField.state.value.map((_, i) => (
                // eslint-disable-next-line @eslint-react/no-array-index-key
                <form.Field key={i} name={`foo[${i}].name`}>
                  {(field) => {
                    expect(field.name).toBe(`foo[${i}].name`)
                    expect(field.state.value).not.toBeUndefined()
                    return null
                  }}
                </form.Field>
              ))
            }
          </form.Field>
          <button
            type="button"
            onClick={() => form.removeFieldValue('foo', 1)}
            data-testid="removeField"
          >
            Remove
          </button>
        </>
      )
    }

    const { getByTestId } = render(<Comp />)

    const target = getByTestId('removeField')
    await user.click(target)
  })

  it('should not error when using deleteField in edge cases', async () => {
    function Comp() {
      const form = useForm({
        defaultValues: {
          firstName: '',
          lastName: '',
        },
        validators: {
          onChange: ({ value }) => {
            const fields: Record<string, string> = {}

            if (value.firstName.length === 0) {
              fields.firstName = 'Last Name is required'
            }

            return { fields }
          },
        },
      })

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <h1>Personal Information</h1>
          <form.Field
            name="firstName"
            children={(field) => (
              <input
                data-testid="input"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <form.Field
            name="lastName"
            children={(field) => (
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <button
            type="button"
            data-testid="remove"
            onClick={() => form.deleteField('firstName')}
          >
            remove first name
          </button>
        </form>
      )
    }

    const { getByTestId } = render(<Comp />)
    const removeButton = getByTestId('remove')
    const input = getByTestId('input')

    await user.type(input, 'a')
    await user.click(removeButton)
  })

  it('should handle stable transforms to update the base form on first render', async () => {
    let renders = 0
    function Comp() {
      const form = useForm({
        defaultValues: {
          test: 'Hello',
        },
        transform: useCallback((baseForm: unknown) => {
          return mergeForm(baseForm as never, {
            values: {
              test: 'What',
            },
          })
        }, []),
      })

      renders++

      return (
        <form.Field
          name="test"
          children={(field) => (
            <p>
              {field.state.value} {renders}
            </p>
          )}
        />
      )
    }

    const { getByText } = render(<Comp />)
    getByText('What 1')
  })

  it('should handle stable transforms to update the base form on subsequent renders', async () => {
    function Comp() {
      const [renders, setRenders] = useState(0)
      const form = useForm({
        defaultValues: {
          test: 'Hello',
        },
        transform: useCallback(
          (baseForm: unknown) => {
            return mergeForm(baseForm as never, {
              values: {
                test: renders === 0 ? 'First' : 'Another',
              },
            })
          },
          [renders],
        ),
      })

      return (
        <div>
          <form.Field
            name="test"
            children={(field) => <p>{field.state.value}</p>}
          />
          <button onClick={() => setRenders((v) => v + 1)} type={'button'}>
            Rerender
          </button>
        </div>
      )
    }

    const { findByText, getByText } = render(<Comp />)
    await findByText('First')
    await user.click(getByText('Rerender'))
    await findByText('Another')
  })
})

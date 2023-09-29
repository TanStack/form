import { render, screen, waitFor } from '@solidjs/testing-library'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { createSignal } from 'solid-js'
import { createFormFactory, useForm } from '..'

const user = userEvent.setup()

describe('useForm', () => {
  it('preserves field state', async () => {
    type Person = {
      firstName: string
      lastName: string
    }

    const formFactory = createFormFactory<Person>()

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

    const formFactory = createFormFactory<Person>()

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
    function Comp() {
      const [submittedData, setSubmittedData] = createSignal<{
        firstName: string
      }>()

      const form = useForm(() => ({
        defaultValues: {
          firstName: 'FirstName',
        },
        onSubmit: (data) => {
          setSubmittedData(data)
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
          {submittedData && <p>Submitted data: {submittedData()?.firstName}</p>}
        </form.Provider>
      )
    }

    const { findByPlaceholderText, getByText } = render(() => <Comp />)
    const input = await findByPlaceholderText('First name')
    await user.clear(input)
    await user.type(input, 'OtherName')
    await user.click(getByText('Submit'))
    await waitFor(() =>
      expect(getByText('Submitted data: OtherName')).toBeInTheDocument(),
    )
  })
})

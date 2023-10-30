import { render, screen, waitFor } from '@solidjs/testing-library'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { createFormFactory, createForm } from '..'

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
})

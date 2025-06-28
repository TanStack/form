import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useState } from 'react'
import { FormApi } from '@tanstack/form-core'

import { useExternalFormApi } from '../src/useExternalFormApi'

const user = userEvent.setup()

describe('useExternalFormApi', () => {
  it('preserves field state', async () => {
    function Comp() {
      // Create a fresh FormApi instance once
      const [formApi] = useState(
        () => new FormApi({ defaultValues: { firstName: '', lastName: '' } }),
      )
      const form = useExternalFormApi(formApi)

      return (
        <form.Field
          name="firstName"
          defaultValue={''}
          children={(field) => (
            <input
              data-testid="fieldinput"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      )
    }

    const { getByTestId } = render(<Comp />)
    const input = getByTestId('fieldinput') as HTMLInputElement
    await user.type(input, 'FirstName')
    expect(input).toHaveValue('FirstName')
  })

  it('should allow default values to be set', async () => {
    function Comp() {
      const [formApi] = useState(
        () =>
          new FormApi({
            defaultValues: {
              firstName: 'FirstName',
              lastName: 'LastName',
            },
          }),
      )
      const form = useExternalFormApi(formApi)

      return (
        <form.Field
          name="firstName"
          children={(field) => <p>{field.state.value}</p>}
        />
      )
    }

    const { findByText, queryByText } = render(<Comp />)
    expect(await findByText('FirstName')).toBeInTheDocument()
    expect(queryByText('LastName')).not.toBeInTheDocument()
  })

  it('should handle submitting properly', async () => {
    interface Person {
      firstName: string
    }

    function Comp() {
      const [submittedData, setSubmittedData] = useState<Person | null>(null)

      const [formApi] = useState(
        () =>
          new FormApi({
            defaultValues: { firstName: 'FirstName' },
          }),
      )

      const form = useExternalFormApi(formApi, {
        onSubmit: ({ value }) => {
          setSubmittedData(value)
        },
      })

      return (
        <>
          <form.Field
            name="firstName"
            children={(field) => (
              <input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={'First name'}
              />
            )}
          />
          <button onClick={form.handleSubmit}>Submit</button>
          {submittedData && <p>Submitted data: {submittedData.firstName}</p>}
        </>
      )
    }

    const { findByPlaceholderText, getByText } = render(<Comp />)
    const input = (await findByPlaceholderText(
      'First name',
    )) as HTMLInputElement
    await user.clear(input)
    await user.type(input, 'OtherName')
    await user.click(getByText('Submit'))
    await waitFor(() =>
      expect(getByText('Submitted data: OtherName')).toBeInTheDocument(),
    )
  })

  it('allows a FormApi created at module scope to be reused', async () => {
    // Create the FormApi at the same scope as the component (module scope for this test)
    const moduleFormApi = new FormApi({
      defaultValues: { firstName: '' },
    })

    function Comp() {
      const form = useExternalFormApi(moduleFormApi)

      return (
        <form.Field
          name="firstName"
          children={(field) => (
            <input
              data-testid="fieldinput-module"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
      )
    }

    const { getByTestId } = render(<Comp />)
    const input = getByTestId('fieldinput-module') as HTMLInputElement

    await user.type(input, 'ModuleName')
    expect(input).toHaveValue('ModuleName')

    // Reset for cleanliness – future tests could reuse same instance safely
    moduleFormApi.reset({ firstName: '' })
  })
})

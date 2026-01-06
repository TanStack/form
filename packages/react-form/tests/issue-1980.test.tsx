import { useForm } from '../src/index'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { test, expect } from 'vitest'

function SimpleForm() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      color: 'red',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  return (
    <div>
      <h2>Simple Form</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div>
          {/* A type-safe field component*/}
          <form.Field
            name="firstName"
            listeners={{
              onMount: ({ fieldApi }) => {
                const value = fieldApi.form.getFieldValue('color')
                fieldApi.setMeta((prev) => ({
                  ...prev,
                  hidden: value === 'red',
                }))
              },
            }}
          >
            {(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <div
                  data-testid="firstName-container"
                  style={{
                    display: (field.state.meta as any)?.hidden
                      ? 'none'
                      : 'block',
                  }}
                >
                  <label htmlFor={field.name}>First Name:</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )
            }}
          </form.Field>
        </div>

        <div>
          <form.Field
            name="color"
            listeners={{
              onChange: ({ value, fieldApi }) => {
                fieldApi.form.setFieldMeta('firstName', (prev) => ({
                  ...prev,
                  hidden: value === 'red',
                }))
              },
            }}
          >
            {(field) => (
              <div>
                <label htmlFor={field.name}>Color:</label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                </select>
              </div>
            )}
          </form.Field>
        </div>
      </form>
    </div>
  )
}

test('firstName should be hidden by default when color is red', async () => {
  const user = userEvent.setup()
  render(<SimpleForm />)

  const firstNameContainer = screen.getByTestId('firstName-container')

  // Check initial state
  // "notice in example field firstName is hidden by default (it is hidden in onMount)"
  // The reproduction says it should be hidden by default.
  expect(firstNameContainer).toHaveStyle({ display: 'none' })

  const colorSelect = screen.getByLabelText('Color:')

  // Change color to green
  await user.selectOptions(colorSelect, 'green')

  // "field firstName will appear"
  await waitFor(() => {
    expect(firstNameContainer).toHaveStyle({ display: 'block' })
  })

  // "after refresh you will notice firstName now is not hidden" - this mimics remounting or re-rendering
  // But the issue description says:
  // "field firstName should still hidden by default"
  // "in v1.26.0 and before it works well, after this version it does not hide until I touch the field firstName"

  // So the bug is: with current version, `firstName` is NOT hidden on initial mount, even though `onMount` sets it to hidden.
})

import React, { useState } from 'react'
import { useForm } from '../../../src'

export function GroupEditedDuringSubmitCallback({
  submit,
}: {
  submit: (value: { name: string; email: string }) => Promise<void>
}) {
  const [result, setResult] = useState('Pending')
  const form = useForm({
    defaultValues: {
      details: { name: 'submitted', email: 'submitted@example.com' },
    },
  })

  return (
    <form.FormGroup
      name="details"
      onSubmit={async ({ value, createErrorMap }) => {
        await submit(value)
        return createErrorMap({
          form: 'Submission failed',
          fields: { name: 'Name was rejected', email: 'Email was rejected' },
        })
      }}
    >
      {(group) => (
        <form
          onSubmit={async (event) => {
            event.preventDefault()
            setResult(JSON.stringify(await group.handleSubmit()))
          }}
        >
          <form.Field name="details.name">
            {(field) => (
              <>
                <label>
                  Name
                  <input
                    value={field.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </label>
                <output aria-label="Name errors">
                  {field.errors.map((error) => error.message).join(', ') ||
                    'None'}
                </output>
              </>
            )}
          </form.Field>
          <group.Field name="email">
            {(field) => (
              <output aria-label="Email errors">
                {field.errors.map((error) => error.message).join(', ') ||
                  'None'}
              </output>
            )}
          </group.Field>
          <group.Subscribe selector={(state) => state.errors}>
            {(errors) => (
              <output aria-label="Submission errors">
                {errors.map((error) => error.message).join(', ') || 'None'}
              </output>
            )}
          </group.Subscribe>
          <button type="submit">Submit</button>
          <output aria-label="Submission result">{result}</output>
        </form>
      )}
    </form.FormGroup>
  )
}

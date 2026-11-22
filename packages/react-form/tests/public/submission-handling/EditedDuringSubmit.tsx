import React, { useState } from 'react'
import { useForm } from '../../../src'

export function EditedDuringSubmit({
  validateSubmission,
  onSubmittedValue,
}: {
  validateSubmission: (value: string) => Promise<string | null>
  onSubmittedValue: (value: { name: string }) => void
}) {
  const [result, setResult] = useState('Pending')
  const form = useForm({
    defaultValues: { name: 'submitted' },
    onSubmit: ({ value }) => onSubmittedValue(value),
    onSubmitInvalid: ({ value }) => onSubmittedValue(value),
  })

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        setResult(JSON.stringify(await form.handleSubmit()))
      }}
    >
      <form.Field
        name="name"
        validators={[
          {
            triggers: ['change'],
            run: ({ event, value }) =>
              event === 'submit'
                ? validateSubmission(value)
                : value === 'invalid'
                  ? 'Current error'
                  : null,
          },
        ]}
      >
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
              {field.errors.map((error) => error.message).join(', ') || 'None'}
            </output>
          </>
        )}
      </form.Field>
      <button type="submit">Submit</button>
      <output aria-label="Submission result">{result}</output>
    </form>
  )
}

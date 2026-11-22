import React, { useState } from 'react'
import { useForm } from '../../../src'

export function EditedDuringGroupSubmit({
  validateSubmission,
  onValidatedValue,
  onSubmittedValue,
}: {
  validateSubmission: (value: string) => Promise<string | null>
  onValidatedValue: (value: { name: string }) => void
  onSubmittedValue: (value: { name: string }) => void
}) {
  const [result, setResult] = useState('Pending')
  const form = useForm({ defaultValues: { details: { name: 'submitted' } } })

  return (
    <form.FormGroup
      name="details"
      validators={[
        {
          triggers: [],
          run: ({ value }) => {
            onValidatedValue(value)
            return null
          },
        },
      ]}
      onSubmit={({ value }) => onSubmittedValue(value)}
      onSubmitInvalid={({ value }) => onSubmittedValue(value)}
    >
      {(group) => (
        <>
          <group.Field
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
                  {field.errors.map((error) => error.message).join(', ') ||
                    'None'}
                </output>
              </>
            )}
          </group.Field>
          <button
            onClick={async () =>
              setResult(JSON.stringify(await group.handleSubmit()))
            }
          >
            Submit group
          </button>
          <output aria-label="Submission result">{result}</output>
        </>
      )}
    </form.FormGroup>
  )
}

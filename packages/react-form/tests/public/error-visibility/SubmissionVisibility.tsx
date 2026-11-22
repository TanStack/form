import React from 'react'
import { useForm } from '../../../src'

export function SubmissionVisibility() {
  const form = useForm({
    defaultValues: { name: '', other: '', watched: '', details: { name: '' } },
    errorVisibility: ({ state }) => state.submissionAttempts > 0,
  })

  return (
    <>
      <form.Field
        name="name"
        validators={[{ triggers: ['mount'], run: () => 'Name required' }]}
      >
        {(field) => (
          <output aria-label="Form name errors">
            {field.errors.map((error) => error.message).join(', ') || 'None'}
          </output>
        )}
      </form.Field>
      <form.Field name="other">
        {(field) => (
          <label>
            Other
            <input
              value={field.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </label>
        )}
      </form.Field>
      <form.Field
        name="watched"
        errorVisibility={({ state }) => state.values.other.length > 0}
        validators={[{ triggers: ['mount'], run: () => 'Watched required' }]}
      >
        {(field) => (
          <output aria-label="Watched errors">
            {field.errors.map((error) => error.message).join(', ') || 'None'}
          </output>
        )}
      </form.Field>
      <form.FormGroup name="details">
        {(group) => (
          <>
            <group.Field
              name="name"
              validators={[
                { triggers: ['mount'], run: () => 'Group name required' },
              ]}
            >
              {(field) => (
                <output aria-label="Group name errors">
                  {field.errors.map((error) => error.message).join(', ') ||
                    'None'}
                </output>
              )}
            </group.Field>
            <button onClick={() => group.handleSubmit()}>Submit group</button>
            <button onClick={() => group.reset()}>Reset group</button>
          </>
        )}
      </form.FormGroup>
      <button onClick={() => form.handleSubmit()}>Submit form</button>
      <button onClick={() => form.reset()}>Reset form</button>
    </>
  )
}

import React from 'react'
import { useForm } from '../../../src'

export function FullPathGroupField() {
  const form = useForm({
    defaultValues: { details: { name: '' } },
    errorVisibility: ({ state }) => state.submissionAttempts > 0,
    validators: [
      { triggers: ['change', 'blur'], run: () => 'Form validation' },
    ],
  })

  return (
    <>
      <form.FormGroup
        name="details"
        validators={[
          { triggers: ['change', 'blur'], run: () => 'Group validation' },
        ]}
      >
        {(group) => (
          <>
            <form.Field
              name="details.name"
              validators={[{ triggers: ['mount'], run: () => 'Name required' }]}
            >
              {(field) => (
                <>
                  <label>
                    Name
                    <input
                      value={field.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={() => field.handleBlur()}
                    />
                  </label>
                  <output aria-label="Name errors">
                    {field.errors.map((error) => error.message).join(', ') ||
                      'None'}
                  </output>
                  <output aria-label="Name touched">
                    {String(field.meta.isTouched)}
                  </output>
                </>
              )}
            </form.Field>
            <group.Subscribe selector={(state) => state.errors}>
              {(errors) => (
                <output aria-label="Group errors">
                  {errors.map((error) => error.message).join(', ') || 'None'}
                </output>
              )}
            </group.Subscribe>
            <button onClick={() => group.handleSubmit()}>Submit group</button>
          </>
        )}
      </form.FormGroup>
      <form.Subscribe selector={(state) => state.errors}>
        {(errors) => (
          <output aria-label="Form errors">
            {errors.map((error) => error.message).join(', ') || 'None'}
          </output>
        )}
      </form.Subscribe>
      <form.Subscribe selector={(state) => state.submissionAttempts}>
        {(attempts) => <output aria-label="Form attempts">{attempts}</output>}
      </form.Subscribe>
      <button>Blur input</button>
    </>
  )
}

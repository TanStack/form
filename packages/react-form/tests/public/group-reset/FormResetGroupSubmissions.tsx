import React from 'react'
import { useForm } from '../../../src'

export function FormResetGroupSubmissions() {
  const form = useForm({
    defaultValues: {
      details: { name: 'Ada' },
      steps: [{ name: 'Grace' }],
    },
  })

  return (
    <>
      <form.FormGroup
        name="details"
        validators={[
          {
            triggers: [
              {
                trigger: 'change',
                when: ({ groupApi }) => groupApi.state.submissionAttempts > 0,
              },
            ],
            run: ({ value }) => (value.name ? null : 'Name is required'),
          },
        ]}
      >
        {(group) => (
          <>
            <group.Field name="name">
              {(field) => (
                <label>
                  Name
                  <input
                    value={field.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </label>
              )}
            </group.Field>
            <group.Subscribe selector={(state) => state.submissionAttempts}>
              {(attempts) => (
                <output aria-label="Details attempts">{attempts}</output>
              )}
            </group.Subscribe>
            <group.Subscribe selector={(state) => state.errors}>
              {(errors) => (
                <output aria-label="Details errors">
                  {errors.map((error) => error.message).join(', ') || 'None'}
                </output>
              )}
            </group.Subscribe>
            <button onClick={() => group.handleSubmit()}>Submit details</button>
          </>
        )}
      </form.FormGroup>
      <form.FormGroup name="steps[0]">
        {(group) => (
          <>
            <group.Subscribe selector={(state) => state.submissionAttempts}>
              {(attempts) => (
                <output aria-label="Step attempts">{attempts}</output>
              )}
            </group.Subscribe>
            <button onClick={() => group.handleSubmit()}>Submit step</button>
          </>
        )}
      </form.FormGroup>
      <form.Subscribe selector={(state) => state.submissionAttempts}>
        {(attempts) => <output aria-label="Form attempts">{attempts}</output>}
      </form.Subscribe>
      <button onClick={() => form.handleSubmit()}>Submit form</button>
      <button onClick={() => form.reset()}>Reset form</button>
    </>
  )
}

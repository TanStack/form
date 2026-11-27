import React, { useState } from 'react'
import { useForm } from '../../../src'

export function GroupSubmissionCallbacks({
  submit,
  onInvalid,
  onOutputs,
}: {
  submit: (value: string) => Promise<string | null>
  onInvalid: (value: { name: string }) => void | Promise<void>
  onOutputs: (outputs: ReadonlyArray<unknown>) => void
}) {
  const [result, setResult] = useState('Pending')
  const form = useForm({ defaultValues: { details: { name: 'submitted' } } })

  return (
    <form.FormGroup
      name="details"
      validators={[
        {
          triggers: [],
          run: ({ createOutput }) => createOutput('Group output'),
        },
        {
          triggers: [],
          skipOnSubmit: true,
          run: ({ createOutput }) => createOutput('Skipped output'),
        },
        { triggers: [], run: () => null },
      ]}
      onSubmit={async ({ value, validatorOutputs, createErrorMap }) => {
        onOutputs(validatorOutputs)
        const error = await submit(value.name)
        return createErrorMap(
          error ? { form: error, fields: { name: 'Name error' } } : {},
        )
      }}
      onSubmitInvalid={({ value }) => onInvalid(value)}
    >
      {(group) => (
        <>
          <group.Field name="name">
            {(field) => (
              <output aria-label="Name errors">
                {field.errors.map((error) => error.message).join(', ') ||
                  'None'}
              </output>
            )}
          </group.Field>
          <group.Subscribe selector={(state) => state.errors}>
            {(errors) => (
              <output aria-label="Group errors">
                {errors.map((error) => error.message).join(', ') || 'None'}
              </output>
            )}
          </group.Subscribe>
          <group.Subscribe
            selector={(state) => ({
              isSubmitting: state.isSubmitting,
              isSubmitSuccessful: state.isSubmitSuccessful,
              submissionAttempts: state.submissionAttempts,
            })}
          >
            {(state) => (
              <output aria-label="Group submission state">
                {JSON.stringify(state)}
              </output>
            )}
          </group.Subscribe>
          <button
            onClick={async () => {
              try {
                setResult(JSON.stringify(await group.handleSubmit()))
              } catch (error) {
                setResult(error instanceof Error ? error.message : 'Rejected')
              }
            }}
          >
            Submit group
          </button>
          <button onClick={() => group.reset()}>Reset group</button>
          <button onClick={() => form.reset()}>Reset form</button>
          <output aria-label="Submission result">{result}</output>
        </>
      )}
    </form.FormGroup>
  )
}

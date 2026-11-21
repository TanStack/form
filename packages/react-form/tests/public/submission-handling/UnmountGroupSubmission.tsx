import React, { useState } from 'react'
import { useForm } from '../../../src'

export function UnmountGroupSubmission({
  validate,
  submit,
  onInvalid,
  onResult,
}: {
  validate: () => null | Promise<string | null>
  submit: () => null | Promise<string | null>
  onInvalid: () => void
  onResult: (errors: unknown) => void
}) {
  const [showGroup, setShowGroup] = useState(true)
  const [result, setResult] = useState('Pending')
  const form = useForm({
    defaultValues: { details: { name: 'submitted' } },
    onSubmit: async ({ createErrorMap }) => {
      const error = await submit()
      return createErrorMap(error ? { form: error } : {})
    },
    onSubmitInvalid: onInvalid,
  })

  return (
    <>
      {showGroup && (
        <form.FormGroup
          name="details"
          onSubmit={async ({ createErrorMap }) => {
            const error = await submit()
            return createErrorMap(error ? { form: error } : {})
          }}
          onSubmitInvalid={onInvalid}
        >
          {(group) => (
            <>
              <group.Field
                name="name"
                validators={[{ triggers: [], run: () => validate() }]}
              >
                {(field) => (
                  <>
                    <output aria-label="Name errors">
                      {field.errors.map((error) => error.message).join(', ') ||
                        'None'}
                    </output>
                    <output aria-label="Name validating">
                      {String(field.meta.isValidating)}
                    </output>
                  </>
                )}
              </group.Field>
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
              <group.Subscribe selector={(state) => state.errors}>
                {(errors) => (
                  <output aria-label="Group errors">
                    {errors.map((error) => error.message).join(', ') || 'None'}
                  </output>
                )}
              </group.Subscribe>
              <button
                onClick={async () => {
                  const errors = await group.handleSubmit()
                  setResult(JSON.stringify(errors))
                  onResult(errors)
                }}
              >
                Submit group
              </button>
            </>
          )}
        </form.FormGroup>
      )}
      <button onClick={() => setShowGroup((previous) => !previous)}>
        {showGroup ? 'Hide group' : 'Show group'}
      </button>
      <button
        onClick={async () => {
          const errors = await form.handleSubmit()
          setResult(JSON.stringify(errors))
          onResult(errors)
        }}
      >
        Submit form
      </button>
      <output aria-label="Submission result">{result}</output>
    </>
  )
}

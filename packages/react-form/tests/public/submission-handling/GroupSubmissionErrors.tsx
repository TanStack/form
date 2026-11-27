import React, { useState } from 'react'
import { useForm } from '../../../src'
import type { SubmissionErrorsProps } from './FormSubmissionErrors'

export function GroupSubmissionErrors({
  submit,
  validate = () => null,
  validateField = () => null,
  onInvalid,
}: SubmissionErrorsProps) {
  const [result, setResult] = useState('Pending')
  const form = useForm({ defaultValues: { details: { name: 'submitted' } } })

  return (
    <form.FormGroup
      name="details"
      validators={[{ triggers: [], run: () => validate() }]}
      onSubmit={async ({ value, createValidationError }) => {
        const error = await submit(value.name)
        return error ? createValidationError(error) : undefined
      }}
      onSubmitInvalid={onInvalid}
    >
      {(group) => (
        <form
          onSubmit={async (event) => {
            event.preventDefault()
            setResult('Pending')
            try {
              setResult(
                `Resolved: ${JSON.stringify(await group.handleSubmit())}`,
              )
            } catch (error) {
              setResult(
                `Rejected: ${error instanceof Error ? error.message : String(error)}`,
              )
            }
          }}
        >
          <group.Field
            name="name"
            validators={[{ triggers: [], run: () => validateField() }]}
          >
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
          <group.Subscribe
            selector={(state) => ({
              isSubmitting: state.isSubmitting,
              isSubmitSuccessful: state.isSubmitSuccessful,
            })}
          >
            {(state) => (
              <>
                <output aria-label="Submitting">
                  {String(state.isSubmitting)}
                </output>
                <output aria-label="Submit successful">
                  {String(state.isSubmitSuccessful)}
                </output>
              </>
            )}
          </group.Subscribe>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => group.reset()}>
            Reset
          </button>
          <output aria-label="Submission result">{result}</output>
        </form>
      )}
    </form.FormGroup>
  )
}

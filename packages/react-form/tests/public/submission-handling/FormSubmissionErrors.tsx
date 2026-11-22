import React, { useState } from 'react'
import { useForm } from '../../../src'
import type { Awaitable, SubmitInvalidContext } from '../../../src'

export interface SubmissionErrorsProps {
  submit: (value: string) => Awaitable<string | null>
  validate?: () => Awaitable<string | null>
  validateField?: () => Awaitable<string | null>
  onInvalid?: (context: SubmitInvalidContext) => Awaitable<void>
}

export function FormSubmissionErrors({
  submit,
  validate = () => null,
  validateField = () => null,
  onInvalid,
}: SubmissionErrorsProps) {
  const [result, setResult] = useState('Pending')
  const form = useForm({
    defaultValues: { name: 'submitted' },
    validators: [{ triggers: [], run: () => validate() }],
    onSubmit: async ({ value, createValidationError }) => {
      const error = await submit(value.name)
      return error ? createValidationError(error) : undefined
    },
    onSubmitInvalid: onInvalid,
  })

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        setResult('Pending')
        try {
          setResult(`Resolved: ${JSON.stringify(await form.handleSubmit())}`)
        } catch (error) {
          setResult(
            `Rejected: ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      }}
    >
      <form.Field
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
      </form.Field>
      <form.Subscribe
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
      </form.Subscribe>
      <button type="submit">Submit</button>
      <button type="button" onClick={() => form.reset()}>
        Reset
      </button>
      <output aria-label="Submission result">{result}</output>
    </form>
  )
}

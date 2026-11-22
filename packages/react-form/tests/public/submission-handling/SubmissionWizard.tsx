import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from '../../../src'

const firstSchema = z.object({ name: z.string().min(1, 'First step invalid') })
const secondSchema = z.object({
  name: z.string().min(1, 'Second step invalid'),
})

export function SubmissionWizard({
  onSubmit,
  onResult,
}: {
  onSubmit: () => void
  onResult: (errors: unknown) => void
}) {
  const [step, setStep] = useState(1)
  const [result, setResult] = useState('Pending')
  const form = useForm({
    defaultValues: { first: { name: '' }, second: { name: 'Valid' } },
    validators: [
      {
        triggers: [],
        run: z.object({ first: firstSchema, second: secondSchema }),
      },
    ],
    onSubmit,
  })

  return (
    <>
      {step === 1 ? (
        <form.FormGroup
          key="first"
          name="first"
          validators={[{ triggers: [], run: firstSchema }]}
        >
          {(group) => (
            <group.Field name="name">
              {(field) => (
                <output aria-label="Visible step">First: {field.value}</output>
              )}
            </group.Field>
          )}
        </form.FormGroup>
      ) : (
        <form.FormGroup
          key="second"
          name="second"
          validators={[{ triggers: [], run: secondSchema }]}
        >
          {(group) => (
            <group.Field name="name">
              {(field) => (
                <output aria-label="Visible step">Second: {field.value}</output>
              )}
            </group.Field>
          )}
        </form.FormGroup>
      )}
      <button
        onClick={() => {
          setStep(2)
          setResult('Pending')
        }}
      >
        Next step
      </button>
      <button
        onClick={async () => {
          const errors = await form.handleSubmit()
          onResult(errors)
          setResult(errors.length > 0 ? 'Invalid' : 'Valid')
        }}
      >
        Submit form
      </button>
      <output aria-label="Submission result">{result}</output>
    </>
  )
}

import React, { useEffect, useState } from 'react'
import { useForm } from '../../../src'

type ReadFieldErrors = () => ReadonlyArray<{ message: string }>

function SubmissionFieldState({
  name,
  field,
  fields,
}: {
  name: string
  field: {
    errors: ReadonlyArray<{ message: string }>
    meta: { isValidating: boolean }
  }
  fields: Map<string, ReadFieldErrors>
}) {
  useEffect(() => {
    fields.set(name, () => field.errors)
    return () => {
      fields.delete(name)
    }
  }, [name, field, fields])

  return (
    <>
      <output aria-label={`${name} errors`}>
        {field.errors.map((error) => error.message).join(', ') || 'None'}
      </output>
      <output aria-label={`${name} validating`}>
        {String(field.meta.isValidating)}
      </output>
    </>
  )
}

export function GroupSubmissionStages({
  validateFirst,
  validateSecond,
  validateGroup,
  validateDependent,
  validateUnflagged,
  onFieldErrors,
}: {
  validateFirst: () => Promise<string | null>
  validateSecond: () => Promise<string | null>
  validateGroup: (errors: Array<Array<string>>) => string | null
  validateDependent: () => null
  validateUnflagged: () => null
  onFieldErrors?: (errors: Array<Array<string>>) => void
}) {
  const [result, setResult] = useState('Pending')
  const [fields] = useState(() => new Map<string, ReadFieldErrors>())
  const form = useForm({
    defaultValues: { details: { first: '', second: '' } },
  })

  useEffect(() => {
    const subscription = form.atom.subscribe(() => {
      onFieldErrors?.(
        Array.from(fields.values(), (read) =>
          read().map((error) => error.message),
        ),
      )
    })
    return () => subscription.unsubscribe()
  }, [form, fields, onFieldErrors])

  return (
    <form.FormGroup
      name="details"
      validators={[
        {
          triggers: ['change'],
          run: () =>
            validateGroup(
              Array.from(fields.values(), (read) =>
                read().map((error) => error.message),
              ),
            ),
        },
        { triggers: ['change'], bailIfInvalid: true, run: validateDependent },
        { triggers: ['change'], run: validateUnflagged },
      ]}
    >
      {(group) => (
        <>
          <group.Field
            name="first"
            validators={[{ triggers: ['change'], run: validateFirst }]}
          >
            {(field) => (
              <SubmissionFieldState
                name="First"
                field={field}
                fields={fields}
              />
            )}
          </group.Field>
          <group.Field
            name="second"
            validators={[{ triggers: ['change'], run: validateSecond }]}
          >
            {(field) => (
              <SubmissionFieldState
                name="Second"
                field={field}
                fields={fields}
              />
            )}
          </group.Field>
          <button
            onClick={async () => {
              try {
                setResult(JSON.stringify(await group.handleSubmit()))
              } catch {
                setResult('Rejected')
              }
            }}
          >
            Submit group
          </button>
          <button onClick={() => group.reset()}>Reset group</button>
          <group.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <output aria-label="Submitting">{String(isSubmitting)}</output>
            )}
          </group.Subscribe>
          <output aria-label="Submission result">{result}</output>
        </>
      )}
    </form.FormGroup>
  )
}

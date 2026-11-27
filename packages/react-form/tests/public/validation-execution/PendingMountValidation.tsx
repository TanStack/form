import React from 'react'
import { useForm } from '../../../src'

export function PendingMountValidation({
  validate,
}: {
  validate: () => Promise<string>
}) {
  const form = useForm({
    defaultValues: { name: '' },
    validators: [{ triggers: ['mount'], run: validate }],
  })

  return (
    <form.Subscribe
      selector={(state) => ({
        errors: state.errors,
        isValidating: state.isValidating,
      })}
    >
      {({ errors, isValidating }) => (
        <>
          <output aria-label="Form errors">
            {errors.map((error) => error.message).join(', ') || 'None'}
          </output>
          <output aria-label="Validating">{String(isValidating)}</output>
        </>
      )}
    </form.Subscribe>
  )
}

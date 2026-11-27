import React from 'react'
import { useForm } from '../../../src'

export function SyncMountValidation() {
  const form = useForm({
    defaultValues: { name: '' },
    validators: [{ triggers: ['mount'], run: () => 'Name is required' }],
  })

  return (
    <form.Subscribe
      selector={(state) => ({
        errors: state.errors,
        canSubmit: state.canSubmit,
      })}
    >
      {({ errors, canSubmit }) => (
        <>
          <output aria-label="Form errors">
            {errors.map((error) => error.message).join(', ') || 'None'}
          </output>
          <button disabled={!canSubmit}>Submit</button>
        </>
      )}
    </form.Subscribe>
  )
}

import React from 'react'
import { useForm } from '../../../src'

export function ValidatorInitialization() {
  const form = useForm({
    defaultValues: { details: { a: '' } },
    validators: [{ run: () => undefined, triggers: ['change'] }],
  })

  return (
    <form.FormGroup
      name="details"
      validators={[{ run: () => undefined, triggers: ['change'] }]}
    >
      {(group) => (
        <group.Field
          name="a"
          validators={[{ run: () => undefined, triggers: ['change'] }]}
        >
          {(field) => (
            <input
              aria-label="A"
              value={field.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          )}
        </group.Field>
      )}
    </form.FormGroup>
  )
}

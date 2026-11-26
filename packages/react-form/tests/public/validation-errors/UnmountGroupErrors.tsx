import React, { useState } from 'react'
import { useForm } from '../../../src'

export function UnmountGroupErrors() {
  const [show, setShow] = useState(true)
  const form = useForm({
    defaultValues: { details: { name: '' } },
  })

  return (
    <>
      {show && (
        <form.FormGroup
          name="details"
          validators={[
            {
              triggers: [],
              run: () => ({ fields: { name: 'Name is required' } }),
            },
          ]}
        >
          {(group) => (
            <button onClick={() => group.handleSubmit()}>Submit group</button>
          )}
        </form.FormGroup>
      )}
      {show && (
        <form.Field name="details.name">
          {(field) => (
            <output aria-label="Name errors">
              {field.errors.map((error) => error.message).join(', ') || 'None'}
            </output>
          )}
        </form.Field>
      )}
      <button onClick={() => setShow(!show)}>
        {show ? 'Hide group' : 'Show group'}
      </button>
      <form.Subscribe selector={(state) => state.isInvalid}>
        {(isInvalid) => (
          <output aria-label="Form invalid">{String(isInvalid)}</output>
        )}
      </form.Subscribe>
    </>
  )
}

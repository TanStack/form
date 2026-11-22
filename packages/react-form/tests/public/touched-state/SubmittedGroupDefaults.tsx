import React, { useState } from 'react'
import { useForm } from '../../../src'

export function SubmittedGroupDefaults() {
  const [defaultValues, setDefaultValues] = useState({
    details: { name: 'Original name' },
    outside: 'Original outside',
  })
  const form = useForm({ defaultValues })

  return (
    <>
      <form.FormGroup name="details">
        {(group) => (
          <>
            <button onClick={() => group.handleSubmit()}>Submit group</button>
            <button onClick={() => group.reset()}>Reset group</button>
          </>
        )}
      </form.FormGroup>
      <form.Subscribe selector={(state) => state.values}>
        {(values) => (
          <>
            <output aria-label="Name value">{values.details.name}</output>
            <output aria-label="Outside value">{values.outside}</output>
          </>
        )}
      </form.Subscribe>
      <form.Subscribe selector={(state) => state.isTouched}>
        {(touched) => (
          <output aria-label="Form touched">{String(touched)}</output>
        )}
      </form.Subscribe>
      <button
        onClick={() =>
          setDefaultValues({
            details: { name: 'Refreshed name' },
            outside: 'Refreshed outside',
          })
        }
      >
        Refresh defaults
      </button>
    </>
  )
}

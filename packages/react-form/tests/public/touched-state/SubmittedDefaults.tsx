import React, { useState } from 'react'
import { useForm } from '../../../src'

export function SubmittedDefaults() {
  const [defaultValues, setDefaultValues] = useState({ name: 'Original' })
  const [showField, setShowField] = useState(false)
  const form = useForm({ defaultValues })

  return (
    <>
      {showField && (
        <form.Field name="name">
          {(field) => (
            <>
              <output aria-label="Name value">{field.value}</output>
              <output aria-label="Name touched">
                {String(field.meta.isTouched)}
              </output>
              <button onClick={() => field.reset()}>Reset name</button>
            </>
          )}
        </form.Field>
      )}
      <form.Subscribe selector={(state) => state.isTouched}>
        {(touched) => (
          <output aria-label="Form touched">{String(touched)}</output>
        )}
      </form.Subscribe>
      <button onClick={() => form.handleSubmit()}>Submit form</button>
      <button onClick={() => setDefaultValues({ name: 'Refreshed' })}>
        Refresh defaults
      </button>
      <button onClick={() => setShowField(true)}>Show field</button>
    </>
  )
}

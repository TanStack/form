import React from 'react'
import { useForm } from '../../../src'

export function ArrayReplacement() {
  const form = useForm({
    defaultValues: { items: [{ label: 'A' }] },
  })

  return (
    <>
      <button onClick={() => form.setFieldValue('items', [{ label: 'B' }])}>
        Replace array
      </button>
      <form.ArrayField name="items">
        {(field) => (
          <output aria-label="First item">{field.value[0]!.label}</output>
        )}
      </form.ArrayField>
    </>
  )
}

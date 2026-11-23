import React from 'react'
import { defineFieldGroup, useForm } from '../../../src'

const { fields: inputFields, bindComponent } = defineFieldGroup(
  ({ strict }) => ({
    value: strict<string>(),
  }),
)

const MemoizedInput = React.memo(function Input({
  field,
}: {
  field: { value: string; handleChange: (value: string) => void }
}) {
  return (
    <input
      aria-label="Memoized"
      value={field.value}
      onChange={(event) => field.handleChange(event.target.value)}
    />
  )
})

function InputField({ fields }: { fields: typeof inputFields }) {
  return (
    <fields.Field name="value">
      {(field) => <MemoizedInput field={field} />}
    </fields.Field>
  )
}

const BoundInputField = bindComponent(InputField, 'fields')

export function MemoizedFieldGroup() {
  const form = useForm({ defaultValues: { value: '' } })

  return (
    <>
      <BoundInputField form={form} />
      <button onClick={() => form.setFieldValue('value', 'Updated')}>
        Update value
      </button>
    </>
  )
}

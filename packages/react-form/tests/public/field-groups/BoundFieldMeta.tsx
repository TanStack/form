import React from 'react'
import { defineFieldGroup, useForm } from '../../../src'

const { fields: nameFields, bindComponent } = defineFieldGroup(
  ({ strict }) => ({
    name: strict<string>(),
  }),
)

function NameField({ fields }: { fields: typeof nameFields }) {
  return (
    <fields.Field name="name">
      {(field) => (
        <>
          <label>
            Name
            <input
              value={field.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </label>
          <output aria-label="Name blurred">
            {String(field.meta.isBlurred)}
          </output>
        </>
      )}
    </fields.Field>
  )
}

const BoundNameField = bindComponent(NameField, 'fields')

export function BoundFieldMeta() {
  const form = useForm({ defaultValues: { account: { name: 'Tony' } } })

  return (
    <>
      <BoundNameField form={form} fields={{ name: 'account.name' }} />
      <button>Leave field</button>
    </>
  )
}

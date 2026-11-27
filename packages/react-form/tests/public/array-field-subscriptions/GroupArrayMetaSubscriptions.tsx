import React from 'react'
import { defineFieldGroup, useForm } from '../../../src'

const { fields: arrayFields, bindComponent } = defineFieldGroup(
  ({ strict }) => ({
    items: strict<Array<string>>(),
  }),
)

function ArrayFields({
  fields,
  label,
}: {
  fields: typeof arrayFields
  label: string
}) {
  return (
    <fields.ArrayField name="items" subscribeToMeta>
      {(field) => (
        <>
          <output aria-label={`${label} blurred`}>
            {String(field.meta.isBlurred)}
          </output>
          <button onClick={field.handleBlur}>{label} blur</button>
        </>
      )}
    </fields.ArrayField>
  )
}

export const BoundArrayFields = bindComponent(ArrayFields, 'fields')

export function GroupArrayMetaSubscriptions() {
  const form = useForm({
    defaultValues: { section: { items: ['Initial'] }, bound: ['Initial'] },
  })

  return (
    <>
      <form.FormGroup name="section">
        {(group) => (
          <group.ArrayField name="items" subscribeToMeta>
            {(field) => (
              <>
                <output aria-label="Group array blurred">
                  {String(field.meta.isBlurred)}
                </output>
                <button onClick={field.handleBlur}>Group array blur</button>
              </>
            )}
          </group.ArrayField>
        )}
      </form.FormGroup>
      <BoundArrayFields
        form={form}
        fields={{ items: 'bound' }}
        label="Field group array"
      />
    </>
  )
}

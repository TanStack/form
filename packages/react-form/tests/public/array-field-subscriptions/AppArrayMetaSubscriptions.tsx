import React, { memo } from 'react'
import { createFormHook, getFormHookHelpers } from '../../../src'
import { BoundArrayFields } from './GroupArrayMetaSubscriptions'
import type { FieldWithValue } from '../../../src'

const ArrayMeta = memo(function ArrayMetaComponent({
  field,
  label,
}: {
  field: FieldWithValue<Array<string>>
  label: string
}) {
  return (
    <output aria-label={`${label} blurred`}>
      {String(field.meta.isBlurred)}
    </output>
  )
})

const { fieldComponent } = getFormHookHelpers()
const { useAppForm } = createFormHook({
  fieldComponents: {
    ArrayMeta: fieldComponent.strict()({
      component: ArrayMeta,
      replaceProperty: 'field',
    }),
  },
  formComponents: {},
})

export function AppArrayMetaSubscriptions() {
  const form = useAppForm({
    defaultValues: {
      items: ['Initial'],
      section: { items: ['Initial'] },
      bound: ['Initial'],
    },
  })

  return (
    <>
      <form.ArrayField name="items" subscribeToMeta>
        {(field) => (
          <>
            <field.ArrayMeta label="App array" />
            <button onClick={field.handleBlur}>App array blur</button>
          </>
        )}
      </form.ArrayField>
      <form.FormGroup name="section">
        {(group) => (
          <group.ArrayField name="items" subscribeToMeta>
            {(field) => (
              <>
                <field.ArrayMeta label="App group array" />
                <button onClick={field.handleBlur}>App group array blur</button>
              </>
            )}
          </group.ArrayField>
        )}
      </form.FormGroup>
      <BoundArrayFields
        form={form}
        fields={{ items: 'bound' }}
        label="App field group array"
      />
    </>
  )
}

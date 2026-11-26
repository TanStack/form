import React from 'react'
import { expectTypeOf } from 'vitest'
import { createFormHook, defineFieldGroup, useForm } from '../../../src'

export function ArrayFieldSubscriptions() {
  const form = useForm({
    defaultValues: { items: [''], section: { items: [''] }, name: '' },
    onSubmit: () => {},
  })

  return (
    <>
      <form.ArrayField
        name="items"
        subscribeToMeta
        validators={[
          {
            triggers: ['change'],
            run: ({ value, fieldApi }) => {
              expectTypeOf(value).toEqualTypeOf<Array<string>>()
              expectTypeOf(fieldApi.value).toEqualTypeOf<Array<string>>()
              return { message: 'Invalid', fromArray: true as const }
            },
          },
        ]}
      >
        {(field) => {
          expectTypeOf(field.name).toEqualTypeOf<'items'>()
          expectTypeOf(field.value).toEqualTypeOf<Array<string>>()
          expectTypeOf(field.errors).toEqualTypeOf<
            Array<{ message: string; fromArray: true }>
          >()
          return null
        }}
      </form.ArrayField>
      <form.ArrayField name="items" subscribeToMeta={false}>
        {() => null}
      </form.ArrayField>
      <form.ArrayField name="items">{() => null}</form.ArrayField>
      {/* @ts-expect-error subscribeToMeta must be a boolean */}
      <form.ArrayField name="items" subscribeToMeta={1}>
        {() => null}
      </form.ArrayField>
      {/* @ts-expect-error subscribeToMeta is specific to ArrayField */}
      <form.Field name="items" subscribeToMeta>
        {() => null}
      </form.Field>
      {/* @ts-expect-error ArrayField still requires an array-valued path */}
      <form.ArrayField name="name" subscribeToMeta>
        {() => null}
      </form.ArrayField>
      <form.FormGroup name="section">
        {(group) => (
          <>
            <group.ArrayField
              name="items"
              subscribeToMeta
              validators={[
                {
                  triggers: ['change'],
                  run: ({ value }) => {
                    expectTypeOf(value).toEqualTypeOf<Array<string>>()
                    return undefined
                  },
                },
              ]}
            >
              {(field) => {
                expectTypeOf(field.value).toEqualTypeOf<Array<string>>()
                return null
              }}
            </group.ArrayField>
            {/* @ts-expect-error subscribeToMeta is specific to ArrayField */}
            <group.Field name="items" subscribeToMeta>
              {() => null}
            </group.Field>
          </>
        )}
      </form.FormGroup>
    </>
  )
}

const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
})

export function AppArrayFieldSubscriptions() {
  const form = useAppForm({
    defaultValues: { items: [''], section: { items: [''] } },
  })

  return (
    <>
      <form.ArrayField name="items" subscribeToMeta>
        {(field) => {
          expectTypeOf(field.value).toEqualTypeOf<Array<string>>()
          return null
        }}
      </form.ArrayField>
      <form.FormGroup name="section">
        {(group) => (
          <group.ArrayField name="items" subscribeToMeta={false}>
            {(field) => {
              expectTypeOf(field.value).toEqualTypeOf<Array<string>>()
              return null
            }}
          </group.ArrayField>
        )}
      </form.FormGroup>
      {/* @ts-expect-error subscribeToMeta is specific to ArrayField */}
      <form.Field name="items" subscribeToMeta>
        {() => null}
      </form.Field>
    </>
  )
}

const { fields: arrayFields } = defineFieldGroup(({ strict }) => ({
  items: strict<Array<{ label: string }>>(),
  name: strict<string>(),
}))

export function FieldGroupArraySubscriptions({
  fields,
}: {
  fields: typeof arrayFields
}) {
  return (
    <>
      <fields.ArrayField name="items" subscribeToMeta>
        {(field) => {
          expectTypeOf(field.value).toEqualTypeOf<Array<{ label: string }>>()
          return null
        }}
      </fields.ArrayField>
      {/* @ts-expect-error subscribeToMeta must be a boolean */}
      <fields.ArrayField name="items" subscribeToMeta={1}>
        {() => null}
      </fields.ArrayField>
      {/* @ts-expect-error subscribeToMeta is specific to ArrayField */}
      <fields.Field name="items" subscribeToMeta>
        {() => null}
      </fields.Field>
      {/* @ts-expect-error ArrayField still requires an array-valued virtual path */}
      <fields.ArrayField name="name" subscribeToMeta>
        {() => null}
      </fields.ArrayField>
    </>
  )
}

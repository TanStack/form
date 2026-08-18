import { expectTypeOf } from 'vitest'
import { createFormHook } from '../src'

const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  defaultFormOptions: {
    listenersMerge: 'append',
    listeners: [
      {
        triggers: [],
        run: ({ value }) => {
          expectTypeOf(value).toBeUnknown()
        },
      },
    ],
  },
  defaultFieldOptions: {
    listenersMerge: 'prepend',
    listeners: [
      {
        triggers: [],
        run: ({ value, fieldApi }) => {
          expectTypeOf(value).toBeUnknown()
          expectTypeOf(fieldApi.value).toBeUnknown()
        },
      },
    ],
  },
  defaultFormGroupOptions: {
    onSubmitInvalid: ({ value, groupApi }) => {
      expectTypeOf(value).toBeUnknown()
      expectTypeOf(groupApi.value).toBeUnknown()
    },
  },
})

function InferenceRemainsLocal() {
  const form = useAppForm(() => ({
    defaultValues: {
      name: '',
      tags: [''],
      group: { count: 0 },
    },
  }))

  expectTypeOf(form.state.values).toEqualTypeOf<{
    name: string
    tags: Array<string>
    group: { count: number }
  }>()

  return (
    <>
      <form.Field name="name">
        {(field) => {
          expectTypeOf(field().value).toEqualTypeOf<string>()
          return null
        }}
      </form.Field>
      <form.ArrayField name="tags">
        {(field) => {
          expectTypeOf(field().value).toEqualTypeOf<Array<string>>()
          return null
        }}
      </form.ArrayField>
      <form.FormGroup name="group">
        {(group) => {
          expectTypeOf(group().value).toEqualTypeOf<{ count: number }>()
          return null
        }}
      </form.FormGroup>
    </>
  )
}

void InferenceRemainsLocal

createFormHook({
  fieldComponents: {},
  formComponents: {},
  defaultFormOptions: {
    // @ts-expect-error formId belongs to an individual form instance
    formId: 'profile',
  },
})

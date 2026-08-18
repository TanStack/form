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

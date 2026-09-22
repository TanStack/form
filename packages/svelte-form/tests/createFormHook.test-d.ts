import { expectTypeOf, it } from 'vitest'
import { createFormHook } from '../src'

it('keeps hook defaults generic and infers values from each form', () => {
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
})

it('rejects instance-specific form IDs in hook defaults', () => {
  createFormHook({
    fieldComponents: {},
    formComponents: {},
    defaultFormOptions: {
      // @ts-expect-error formId belongs to an individual form instance
      formId: 'profile',
    },
  })
})

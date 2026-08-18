import React from 'react'
import { expectTypeOf } from 'vitest'
import { createFormHook } from '../src'
import type {
  DefaultFieldOptions,
  DefaultFormGroupOptions,
  DefaultFormOptions,
} from '../src'

const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  defaultFormOptions: {
    listenersMerge: 'append',
    errorVisibility: ({ state, fieldState }) => {
      expectTypeOf(state.values).toBeUnknown()
      expectTypeOf(fieldState.value).toBeAny()
      return true
    },
    listeners: [
      {
        triggers: [],
        run: ({ value, formApi }) => {
          expectTypeOf(value).toBeUnknown()
          expectTypeOf(formApi.state.values).toBeUnknown()
        },
      },
    ],
    onSubmitInvalid: ({ value, formApi }) => {
      expectTypeOf(value).toBeUnknown()
      expectTypeOf(formApi.state.values).toBeUnknown()
    },
  },
  defaultFieldOptions: {
    listenersMerge: 'prepend',
    errorVisibility: ({ state, fieldState }) => {
      expectTypeOf(state.values).toBeUnknown()
      expectTypeOf(fieldState.value).toBeAny()
      return true
    },
    listeners: [
      {
        triggers: [],
        run: ({ value, fieldApi, formApi }) => {
          expectTypeOf(value).toBeUnknown()
          expectTypeOf(fieldApi.value).toBeUnknown()
          expectTypeOf(formApi.state.values).toBeUnknown()
        },
      },
    ],
  },
  defaultFormGroupOptions: {
    onSubmitInvalid: ({ value, formApi, groupApi }) => {
      expectTypeOf(value).toBeUnknown()
      expectTypeOf(formApi.state.values).toBeUnknown()
      expectTypeOf(groupApi.value).toBeUnknown()
    },
  },
})

function InferenceRemainsLocal() {
  const form = useAppForm({
    defaultValues: {
      name: '',
      tags: [''],
      group: { count: 0 },
    },
    serverState: undefined,
  })

  expectTypeOf(form.state.values).toEqualTypeOf<{
    name: string
    tags: Array<string>
    group: { count: number }
  }>()

  return (
    <>
      <form.Field name="name">
        {(field) => {
          expectTypeOf(field.value).toEqualTypeOf<string>()
          return null
        }}
      </form.Field>
      <form.ArrayField name="tags">
        {(field) => {
          expectTypeOf(field.value).toEqualTypeOf<Array<string>>()
          return null
        }}
      </form.ArrayField>
      <form.FormGroup name="group">
        {(group) => {
          expectTypeOf(group.value).toEqualTypeOf<{ count: number }>()
          return null
        }}
      </form.FormGroup>
    </>
  )
}

void InferenceRemainsLocal

expectTypeOf<
  Extract<
    keyof DefaultFormOptions,
    'formId' | 'defaultValues' | 'validators' | 'onSubmit'
  >
>().toBeNever()

expectTypeOf<
  Extract<
    keyof DefaultFieldOptions,
    'name' | 'defaultValues' | 'validators' | 'onSubmit'
  >
>().toBeNever()

expectTypeOf<
  Extract<
    keyof DefaultFormGroupOptions,
    'form' | 'name' | 'defaultValues' | 'validators' | 'onSubmit'
  >
>().toBeNever()

createFormHook({
  fieldComponents: {},
  formComponents: {},
  defaultFormOptions: {
    // @ts-expect-error formId belongs to an individual form instance
    formId: 'profile',
  },
})

createFormHook({
  fieldComponents: {},
  formComponents: {},
  defaultFormOptions: {
    // @ts-expect-error defaultValues must remain an inference source
    defaultValues: { name: '' },
  },
})

createFormHook({
  fieldComponents: {},
  formComponents: {},
  defaultFormOptions: {
    // @ts-expect-error serverState must remain local to an individual form
    serverState: undefined,
  },
})

createFormHook({
  fieldComponents: {},
  formComponents: {},
  defaultFieldOptions: {
    // @ts-expect-error validators must remain local to a field
    validators: [],
  },
})

createFormHook({
  fieldComponents: {},
  formComponents: {},
  defaultFormGroupOptions: {
    // @ts-expect-error onSubmit must remain local to a form group
    onSubmit: () => {},
  },
})

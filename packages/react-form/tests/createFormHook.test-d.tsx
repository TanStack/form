import React from 'react'
import { expectTypeOf } from 'vitest'
import { createFormHook, getFormHookHelpers } from '../src'
import type {
  DefaultFieldOptions,
  DefaultFormGroupOptions,
  DefaultFormOptions,
  FieldWithValue,
  ReactComponentTree,
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

function TextFieldComponent(props: {
  field: FieldWithValue<string>
  label: string
}) {
  return props.label
}

function NumberFieldComponent(props: { field: FieldWithValue<number> }) {
  return String(props.field.value)
}

function FieldInfoComponent(props: { field: FieldWithValue<unknown> }) {
  return String(props.field.value)
}

const { fieldComponent } = getFormHookHelpers()
const TextField = fieldComponent.strict(TextFieldComponent, 'field')
const NumberField = fieldComponent.strict(NumberFieldComponent, 'field')
const FieldInfo = fieldComponent.loose(FieldInfoComponent, 'field')
const MemoTextField = React.memo(TextField)
const LazyTextField = React.lazy(() => Promise.resolve({ default: TextField }))

const reusableFields = {
  inputs: {
    text: {
      TextField,
      MemoTextField,
      LazyTextField,
    },
    numbers: {
      NumberField,
    },
  },
  feedback: {
    FieldInfo,
  },
} satisfies ReactComponentTree

function SubmitButton() {
  return null
}

function FormStatus() {
  return null
}

const {
  useAppForm: useNestedAppForm,
  defineAppFieldGroup: defineNestedAppFieldGroup,
} = createFormHook({
  fieldComponents: reusableFields,
  formComponents: {
    actions: {
      SubmitButton,
    },
    layout: {
      status: {
        FormStatus,
      },
    },
  },
})

const nestedAppFieldGroup = defineNestedAppFieldGroup(({ strict }) => ({
  name: strict<string>(),
  age: strict<number>(),
}))

function NestedComponentTrees() {
  const form = useNestedAppForm({
    defaultValues: {
      name: '',
      age: 0,
      tags: [''],
    },
  })

  return (
    <>
      <form.actions.SubmitButton />
      <form.layout.status.FormStatus />
      <form.Field name="name">
        {(field) => {
          expectTypeOf<keyof typeof field.inputs.numbers>().toBeNever()
          return (
            <>
              <field.inputs.text.TextField label="Name" />
              <field.inputs.text.MemoTextField label="Name" />
              <field.inputs.text.LazyTextField label="Name" />
              <field.feedback.FieldInfo />
              {/* @ts-expect-error number-only leaves are filtered from string fields */}
              <field.inputs.numbers.NumberField />
            </>
          )
        }}
      </form.Field>
      <form.Field name="age">
        {(field) => {
          expectTypeOf<keyof typeof field.inputs.text>().toBeNever()
          return (
            <>
              <field.inputs.numbers.NumberField />
              {/* @ts-expect-error string-only leaves are filtered from number fields */}
              <field.inputs.text.TextField label="Age" />
            </>
          )
        }}
      </form.Field>
      <form.ArrayField name="tags">
        {(field) => {
          expectTypeOf<keyof typeof field.inputs.text>().toBeNever()
          return <field.feedback.FieldInfo />
        }}
      </form.ArrayField>
      <nestedAppFieldGroup.fields.Field name="name">
        {(field) => (
          <>
            <field.inputs.text.TextField label="Name" />
            {/* @ts-expect-error nested filtering is preserved by app field groups */}
            <field.inputs.numbers.NumberField />
          </>
        )}
      </nestedAppFieldGroup.fields.Field>
    </>
  )
}

void NestedComponentTrees

createFormHook({
  fieldComponents: {
    invalid: {
      // @ts-expect-error component-tree leaves must be React components
      value: 'not a component',
    },
  },
  formComponents: {},
})

createFormHook({
  fieldComponents: {},
  formComponents: {
    invalid: {
      // @ts-expect-error component-tree leaves must be React components
      value: 123,
    },
  },
})

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

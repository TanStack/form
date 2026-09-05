import React from 'react'
import { expectTypeOf } from 'vitest'
import {
  createFormHook,
  defineFieldGroup,
  getFormHookHelpers,
  useForm,
  useSelector,
} from '../src'
import type {
  FieldGroupApi,
  FieldGroupFieldBindings,
  FieldGroupFieldNameForSlot,
  FieldGroupFieldNames,
  FieldGroupFieldSlotAllows,
  FieldGroupFieldSlotModeOf,
  FieldGroupFieldSlotValue,
  FieldGroupFieldsOf,
  FieldGroupForm,
  FieldGroupFormState,
  FieldValidators,
  FieldWithValue,
} from '../src'

type BookingFields = {
  guest: {
    name: string
    age: number
  }
  emails: Array<{ value: string }>
  tags: Array<string>
}

function TextFieldComponent(props: { field: FieldWithValue<string> }) {
  void props.field
  return null
}

const { fieldComponent } = getFormHookHelpers()
const TextField = fieldComponent.strict(TextFieldComponent, 'field')

type FieldComponents = {
  TextField: typeof TextField
}

declare const fields: FieldGroupApi<BookingFields, FieldComponents>
declare const form: FieldGroupForm
const { defineAppFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {},
})
const { fields: definedFields, bindComponent: bindDefinedFields } =
  defineFieldGroup(({ strict }) => ({
    name: strict<string>(),
    age: strict<number>(),
    emails: strict<Array<{ value: string }>>(),
  }))
const { fields: looseDefinedFields, bindComponent: bindLooseDefinedFields } =
  defineFieldGroup(({ loose }) => ({
    name: loose<string>(),
  }))
const { fields: looseNullableNumberFields } = defineFieldGroup(({ loose }) => ({
  value: loose<number | null>(),
}))
const invalidWatchFieldValidators: FieldValidators<
  BookingFields,
  'guest.age',
  number
> = [
  {
    run: () => undefined,
    triggers: ['change'],
    // @ts-expect-error watchFields only accepts virtual field paths
    watchFields: ['unknown'],
  },
]
void invalidWatchFieldValidators
const { fields: appDefinedFields } = defineAppFieldGroup(({ strict }) => ({
  name: strict<string>(),
}))
const { fields: hookAppDefinedFields } = defineAppFieldGroup(({ strict }) => ({
  name: strict<string>(),
}))

type DefinedFieldsSpec = FieldGroupFieldsOf<typeof definedFields>
type LooseDefinedFieldsSpec = FieldGroupFieldsOf<typeof looseDefinedFields>
type LooseNullableNumberFieldsSpec = FieldGroupFieldsOf<
  typeof looseNullableNumberFields
>
declare const stringSlot: DefinedFieldsSpec['name']
declare const looseStringSlot: LooseDefinedFieldsSpec['name']
declare const looseNullableNumberSlot: LooseNullableNumberFieldsSpec['value']
declare const numberSlot: DefinedFieldsSpec['age']
declare const emailsSlot: DefinedFieldsSpec['emails']
type FieldNameTestData = {
  exactString: string
  literalString: 'literal'
  stringOrNumber: string | number
  exactNumber: number
  nullableNumber: number | null
  nullOnly: null
  stringOrNull: string | null
  nested: {
    value: 'literal'
  }
}

interface DefinedFieldsProps {
  fields: typeof definedFields
  label: string
}

interface MismatchedFieldsProps {
  fields: typeof looseDefinedFields
}

interface RenamedDefinedFieldsProps {
  fieldGroup: typeof definedFields
}

type FieldBindingFormData = {
  user: {
    name: string
    age: number
    emails: Array<{ value: string }>
  }
  literalName: 'literal'
  stringOrNumber: string | number
  tags: Array<string>
}

declare const typedForm: FieldGroupForm<
  Record<never, never>,
  FieldBindingFormData
>

function DefinedFieldsImpl(props: DefinedFieldsProps) {
  return (
    <props.fields.Field name="name">
      {(field) => {
        expectTypeOf(field.value).toEqualTypeOf<string>()
        return props.label
      }}
    </props.fields.Field>
  )
}

const WrappedDefinedFields = bindDefinedFields(DefinedFieldsImpl, 'fields')

function MismatchedFieldsImpl(props: MismatchedFieldsProps) {
  return <props.fields.Field name="name">{() => null}</props.fields.Field>
}

bindDefinedFields(
  MismatchedFieldsImpl,
  // @ts-expect-error fieldsPropName must point to the matching field group
  'fields',
)

function RenamedDefinedFieldsImpl(props: RenamedDefinedFieldsProps) {
  return (
    <props.fieldGroup.Field name="name">{() => null}</props.fieldGroup.Field>
  )
}

bindDefinedFields(RenamedDefinedFieldsImpl, 'fieldGroup')

bindDefinedFields(
  RenamedDefinedFieldsImpl,
  // @ts-expect-error fieldsPropName must be the prop containing the field group
  'fields',
)

interface LooseDefinedFieldsProps {
  fields: typeof looseDefinedFields
}

function LooseDefinedFieldsImpl(props: LooseDefinedFieldsProps) {
  return <props.fields.Field name="name">{() => null}</props.fields.Field>
}

const WrappedLooseDefinedFields = bindLooseDefinedFields(
  LooseDefinedFieldsImpl,
  'fields',
)

type DefinedFieldBindings = FieldGroupFieldBindings<
  FieldGroupFieldsOf<typeof definedFields>,
  FieldBindingFormData
>
type LooseDefinedFieldBindings = FieldGroupFieldBindings<
  FieldGroupFieldsOf<typeof looseDefinedFields>,
  FieldBindingFormData
>
type LooseNullableNumberBindings = FieldGroupFieldBindings<
  FieldGroupFieldsOf<typeof looseNullableNumberFields>,
  FieldNameTestData
>

function FieldGroupApiTypes() {
  const values = useSelector(fields.atom)

  expectTypeOf(values).toEqualTypeOf<BookingFields>()
  expectTypeOf(fields.atom.get()).toEqualTypeOf<BookingFields>()
  expectTypeOf(fields.getFieldValue('guest.name')).toEqualTypeOf<string>()
  expectTypeOf(fields.getFieldValue('guest.age')).toEqualTypeOf<number>()
  expectTypeOf(fields.getFieldValue('emails')).toEqualTypeOf<
    Array<{ value: string }>
  >()

  fields.setFieldValue('guest.name', 'Tony')
  // @ts-expect-error field value must match the virtual field path
  fields.setFieldValue('guest.name', 42)

  fields.resetField('guest.age')
  // @ts-expect-error field methods only accept virtual field paths
  fields.resetField('unknown')

  fields.pushFieldValue('tags', 'vip')
  // @ts-expect-error array element must match the virtual array path
  fields.pushFieldValue('tags', 1)
  fields.insertFieldValue('emails', 0, { value: 'a@example.com' })
  fields.removeFieldValue('emails', 0)
  fields.swapFieldValues('emails', 0, 1)
  fields.moveFieldValue('emails', 0, 1)
  fields.clearFieldValues('emails')
  fields.filterFieldValues('emails', (email, index, array) => {
    expectTypeOf(email).toEqualTypeOf<{ value: string }>()
    expectTypeOf(index).toEqualTypeOf<number>()
    expectTypeOf(array).toEqualTypeOf<Array<{ value: string }>>()
    return email.value.length > 0
  })
  // @ts-expect-error array methods only accept array-valued virtual paths
  fields.pushFieldValue('guest.name', 'Tony')

  return (
    <>
      <fields.Field name="guest.name">
        {(field) => {
          expectTypeOf(field.value).toEqualTypeOf<string>()
          return <field.TextField />
        }}
      </fields.Field>

      <fields.Field name="guest.age">
        {(field) => {
          expectTypeOf(field.value).toEqualTypeOf<number>()
          return (
            <>
              {/* @ts-expect-error strict string field component is not available on number fields */}
              <field.TextField />
            </>
          )
        }}
      </fields.Field>

      <fields.Field
        name="guest.age"
        validators={[
          {
            run: ({ value }) => {
              expectTypeOf(value).toEqualTypeOf<number>()
              return undefined
            },
            triggers: ['change'],
            watchFields: ['guest.name'],
          },
        ]}
      >
        {() => null}
      </fields.Field>

      <fields.Field
        name="guest.age"
        validators={[
          {
            run: () => undefined,
            triggers: ['change'],
            // @ts-expect-error watchFields only accepts virtual field paths
            watchFields: ['unknown'],
          },
        ]}
      >
        {() => null}
      </fields.Field>

      {/* @ts-expect-error Field only accepts virtual field paths */}
      <fields.Field name="unknown">{() => null}</fields.Field>

      <fields.ArrayField name="emails">
        {(field) => {
          expectTypeOf(field.value).toEqualTypeOf<Array<{ value: string }>>()
          return null
        }}
      </fields.ArrayField>

      {/* @ts-expect-error ArrayField only accepts array-valued virtual paths */}
      <fields.ArrayField name="guest.name">{() => null}</fields.ArrayField>

      <fields.Subscribe
        selector={(state) => {
          expectTypeOf(state).toEqualTypeOf<FieldGroupFormState>()
          expectTypeOf(state.submissionAttempts).toEqualTypeOf<number>()
          expectTypeOf(state.values).toBeUnknown()
          return state.submissionAttempts
        }}
      >
        {(submissionAttempts) => {
          expectTypeOf(submissionAttempts).toEqualTypeOf<number>()
          return null
        }}
      </fields.Subscribe>
    </>
  )
}

function DefineFieldGroupTypes() {
  const formWithSubmitReturn = useForm({
    defaultValues: {
      user: {
        name: '',
        age: 0,
        emails: [] as Array<{ value: string }>,
      },
      literalName: 'literal' as const,
      stringOrNumber: '',
      tags: [] as Array<string>,
    } satisfies FieldBindingFormData,
    onSubmit: () => 'submitted' as const,
  })
  const formWithIdentityBindings = useForm({
    defaultValues: {
      name: '',
      age: 0,
      emails: [] as Array<{ value: string }>,
      alternate: {
        name: '',
        age: 0,
        emails: [] as Array<{ value: string }>,
      },
    },
  })

  expectTypeOf(stringSlot.mode).toEqualTypeOf<'strict'>()
  expectTypeOf(looseStringSlot.mode).toEqualTypeOf<'loose'>()
  expectTypeOf<
    FieldGroupFieldSlotValue<typeof stringSlot>
  >().toEqualTypeOf<string>()
  expectTypeOf<
    FieldGroupFieldSlotModeOf<typeof stringSlot>
  >().toEqualTypeOf<'strict'>()
  expectTypeOf<
    FieldGroupFieldSlotModeOf<typeof looseStringSlot>
  >().toEqualTypeOf<'loose'>()

  expectTypeOf<
    FieldGroupFieldSlotAllows<typeof stringSlot, string>
  >().toEqualTypeOf<true>()
  expectTypeOf<
    FieldGroupFieldSlotAllows<typeof stringSlot, 'literal'>
  >().toEqualTypeOf<false>()
  expectTypeOf<
    FieldGroupFieldSlotAllows<typeof looseStringSlot, 'literal'>
  >().toEqualTypeOf<true>()
  expectTypeOf<
    FieldGroupFieldSlotAllows<typeof looseStringSlot, string | number>
  >().toEqualTypeOf<false>()
  expectTypeOf<
    FieldGroupFieldSlotAllows<typeof looseNullableNumberSlot, null>
  >().toEqualTypeOf<true>()
  expectTypeOf<
    FieldGroupFieldSlotAllows<typeof looseNullableNumberSlot, string | null>
  >().toEqualTypeOf<false>()
  expectTypeOf<
    FieldGroupFieldNameForSlot<FieldNameTestData, typeof stringSlot>
  >().toEqualTypeOf<'exactString'>()
  expectTypeOf<
    FieldGroupFieldNameForSlot<FieldNameTestData, typeof looseStringSlot>
  >().toEqualTypeOf<'exactString' | 'literalString' | 'nested.value'>()
  expectTypeOf<
    FieldGroupFieldNames<
      FieldNameTestData,
      {
        exact: typeof stringSlot
        loose: typeof looseStringSlot
      }
    >
  >().toEqualTypeOf<{
    exact: 'exactString'
    loose: 'exactString' | 'literalString' | 'nested.value'
  }>()
  expectTypeOf<DefinedFieldBindings>().toEqualTypeOf<{
    readonly name:
      'user.name' | `user.emails[${number}].value` | `tags[${number}]`
    readonly age: 'user.age'
    readonly emails: 'user.emails'
  }>()
  expectTypeOf<LooseDefinedFieldBindings>().toEqualTypeOf<{
    readonly name:
      | 'user.name'
      | 'literalName'
      | `user.emails[${number}].value`
      | `tags[${number}]`
  }>()
  expectTypeOf<LooseNullableNumberBindings>().toEqualTypeOf<{
    readonly value: 'exactNumber' | 'nullableNumber' | 'nullOnly'
  }>()

  expectTypeOf(definedFields).toExtend<
    FieldGroupApi<
      {
        name: string
        age: number
        emails: Array<{ value: string }>
      },
      Record<never, never>
    >
  >()
  expectTypeOf<DefinedFieldsSpec>().toEqualTypeOf<{
    readonly name: typeof stringSlot
    readonly age: typeof numberSlot
    readonly emails: typeof emailsSlot
  }>()
  // @ts-expect-error fields exposes the FieldGroupApi shape, not raw spec keys
  definedFields.name

  expectTypeOf(definedFields.getFieldValue('name')).toEqualTypeOf<string>()
  expectTypeOf(definedFields.getFieldValue('age')).toEqualTypeOf<number>()
  expectTypeOf(definedFields.atom.get()).toEqualTypeOf<{
    readonly name: string
    readonly age: number
    readonly emails: Array<{ value: string }>
  }>()
  // @ts-expect-error fields only exposes the defined virtual fields
  definedFields.getFieldValue('unknown')

  return (
    <>
      <WrappedDefinedFields form={formWithIdentityBindings} label="Identity" />

      <WrappedDefinedFields
        form={formWithIdentityBindings}
        label="Rerouted"
        fields={{
          name: 'alternate.name',
          age: 'alternate.age',
          emails: 'alternate.emails',
        }}
      />

      <WrappedDefinedFields
        form={formWithIdentityBindings}
        label="Incomplete"
        // @ts-expect-error optional field bindings still need every defined field
        fields={{ name: 'name' }}
      />

      <WrappedDefinedFields
        form={formWithSubmitReturn}
        label="User"
        fields={{
          name: 'user.name',
          age: 'user.age',
          emails: 'user.emails',
        }}
      />

      <WrappedDefinedFields
        form={form}
        label="User"
        fields={{
          name: 'user.name',
          age: 'user.age',
          emails: 'user.emails',
        }}
      />

      <WrappedDefinedFields
        form={typedForm}
        label="User"
        fields={{
          name: 'user.name',
          age: 'user.age',
          emails: 'user.emails',
        }}
      />

      {/* @ts-expect-error non-identity field bindings remain required */}
      <WrappedDefinedFields form={typedForm} label="User" />

      <WrappedDefinedFields
        form={typedForm}
        label="User"
        fields={{
          // @ts-expect-error strict field bindings require exact value types
          name: 'literalName',
          age: 'user.age',
          emails: 'user.emails',
        }}
      />

      <WrappedDefinedFields
        form={typedForm}
        label="User"
        fields={{
          name: 'user.name',
          // @ts-expect-error strict field bindings require exact value types
          age: 'user.name',
          emails: 'user.emails',
        }}
      />

      <WrappedLooseDefinedFields
        form={typedForm}
        fields={{ name: 'literalName' }}
      />

      <WrappedLooseDefinedFields
        form={typedForm}
        fields={{
          // @ts-expect-error loose field bindings reject wider value types
          name: 'stringOrNumber',
        }}
      />

      <WrappedLooseDefinedFields
        form={typedForm}
        fields={{
          // @ts-expect-error loose field bindings require assignable value types
          name: 'user.age',
        }}
      />

      <WrappedDefinedFields
        form={form}
        label="User"
        // @ts-expect-error wrapped component fields prop needs every defined field binding
        fields={{ name: 'user.name' }}
      />

      {/* @ts-expect-error wrapped component receives field bindings, not the internal field group API */}
      <WrappedDefinedFields form={form} label="User" fields={definedFields} />

      {/* @ts-expect-error wrapped component requires a form prop */}
      <WrappedDefinedFields label="User" fields={undefined as never} />

      <definedFields.Field name="name">
        {(field) => {
          expectTypeOf(field.value).toEqualTypeOf<string>()
          return null
        }}
      </definedFields.Field>

      {/* @ts-expect-error Field only accepts keys from the defined fields */}
      <definedFields.Field name="unknown">{() => null}</definedFields.Field>

      <appDefinedFields.Field name="name">
        {(field) => {
          expectTypeOf(field.value).toEqualTypeOf<string>()
          return <field.TextField />
        }}
      </appDefinedFields.Field>

      <hookAppDefinedFields.Field name="name">
        {(field) => {
          expectTypeOf(field.value).toEqualTypeOf<string>()
          return <field.TextField />
        }}
      </hookAppDefinedFields.Field>
    </>
  )
}

void FieldGroupApiTypes
void DefineFieldGroupTypes

import { expectTypeOf } from 'vitest'
import {
  createForm,
  createFormHook,
  defineFieldGroup,
  formOptions,
  getFormHookHelpers,
} from '../src'
import type { Accessor } from 'solid-js'
import type { FieldWithValue, SolidFormType, ValidationIssue } from '../src'

function SubscribeTypes() {
  const form = createForm(() => ({
    defaultValues: { name: '' },
  }))

  return (
    <form.Subscribe
      selector={(state) => [state.values.name, state.submissionAttempts]}
    >
      {(selected) => {
        expectTypeOf(selected()).toEqualTypeOf<readonly [string, number]>()
        return null
      }}
    </form.Subscribe>
  )
}

function FormAndGroupTypes() {
  const form = createForm(() => ({
    defaultValues: {
      guest: { name: '', emails: [''] },
      budget: 0,
    },
    validators: [
      {
        triggers: [],
        run: () => ({ form: { message: 'form' }, fields: {} }),
      },
    ],
    onSubmit: () => 'submitted' as const,
  }))

  return (
    <form.FormGroup
      name="guest"
      validators={[
        {
          triggers: [],
          run: ({ value }) => {
            expectTypeOf(value.name).toEqualTypeOf<string>()
            // @ts-expect-error group values do not expose root fields
            value.budget
            return {
              fields: {
                name: { message: '', source: 'group' as const },
              },
            }
          },
        },
      ]}
    >
      {(group) => {
        expectTypeOf(group().state.values.name).toEqualTypeOf<string>()
        expectTypeOf(group().form.state.values.budget).toEqualTypeOf<number>()
        // @ts-expect-error group state is scoped to the group value
        group().state.values.budget

        return (
          <>
            <group.Field name="name">
              {(field) => {
                expectTypeOf(field().value).toEqualTypeOf<string>()
                expectTypeOf(field().errors).toMatchTypeOf<
                  Array<ValidationIssue>
                >()
                return null
              }}
            </group.Field>
            <group.ArrayField name="emails">{() => null}</group.ArrayField>
            {/* @ts-expect-error field names are relative to the group */}
            <group.Field name="budget">{() => null}</group.Field>
            {/* @ts-expect-error ArrayField only accepts array values */}
            <group.ArrayField name="name">{() => null}</group.ArrayField>
            <group.Subscribe selector={(state) => state.values.name}>
              {(name) => {
                expectTypeOf(name).toEqualTypeOf<Accessor<string>>()
                return null
              }}
            </group.Subscribe>
          </>
        )
      }}
    </form.FormGroup>
  )
}

const sharedOptions = formOptions({
  defaultValues: { email: '' },
  validators: [],
})
type SharedForm = SolidFormType<typeof sharedOptions>

function SharedFormChild(props: { form: SharedForm }) {
  return (
    <props.form.Field name="email">
      {(field) => {
        expectTypeOf(field().errors).toEqualTypeOf<Array<ValidationIssue>>()
        return null
      }}
    </props.form.Field>
  )
}

function TextField(props: {
  field: Accessor<FieldWithValue<string>>
  label: string
}) {
  return props.label
}

function NumberField(props: { field: Accessor<FieldWithValue<number>> }) {
  return String(props.field().value)
}

const { fieldComponent } = getFormHookHelpers()
const Text = fieldComponent.strict(TextField, 'field')
const Number = fieldComponent.strict(NumberField, 'field')
const { useAppForm, defineAppFieldGroup } = createFormHook({
  fieldComponents: { Text, Number },
  formComponents: {},
})

function AppFormTypes() {
  const form = useAppForm(() => ({
    defaultValues: { name: '', age: 0 },
  }))
  return (
    <>
      <form.Field name="name">
        {(field) => (
          <>
            <field.Text label="Name" />
            {/* @ts-expect-error number-only component is filtered out */}
            <field.Number />
          </>
        )}
      </form.Field>
      <form.Field name="age">
        {(field) => (
          <>
            <field.Number />
            {/* @ts-expect-error string-only component is filtered out */}
            <field.Text label="Age" />
          </>
        )}
      </form.Field>
    </>
  )
}

const profileFieldGroup = defineFieldGroup(({ strict }) => ({
  name: strict<string>(),
  age: strict<number>(),
}))

function ProfileFields(props: { fields: typeof profileFieldGroup.fields }) {
  return (
    <props.fields.Field name="name">
      {(field) => {
        expectTypeOf(field().value).toEqualTypeOf<string>()
        return null
      }}
    </props.fields.Field>
  )
}

const Profile = profileFieldGroup.bindComponent(ProfileFields, 'fields')

function FieldGroupBindingsTypes() {
  const form = createForm(() => ({
    defaultValues: {
      user: { name: '', age: 0 },
      wrong: { name: 0, age: '' },
    },
  }))
  const formWithIdentityBindings = createForm(() => ({
    defaultValues: {
      name: '',
      age: 0,
      alternate: { name: '', age: 0 },
    },
  }))

  return (
    <>
      <Profile form={formWithIdentityBindings} />
      <Profile
        form={formWithIdentityBindings}
        fields={{ name: 'alternate.name', age: 'alternate.age' }}
      />
      <Profile
        form={formWithIdentityBindings}
        // @ts-expect-error optional field bindings still need every defined field
        fields={{ name: 'name' }}
      />
      {/* @ts-expect-error non-identity field bindings remain required */}
      <Profile form={form} />
      <Profile form={form} fields={{ name: 'user.name', age: 'user.age' }} />
      <Profile
        form={form}
        fields={{
          // @ts-expect-error strict string slot rejects number fields
          name: 'wrong.name',
          // @ts-expect-error strict number slot rejects string fields
          age: 'wrong.age',
        }}
      />
    </>
  )
}

const appFieldGroup = defineAppFieldGroup(({ strict }) => ({
  name: strict<string>(),
}))

function AppFields(props: { fields: typeof appFieldGroup.fields }) {
  return (
    <props.fields.Field name="name">
      {(field) => <field.Text label="Name" />}
    </props.fields.Field>
  )
}

const BoundAppFields = appFieldGroup.bindComponent(AppFields, 'fields')

void FormAndGroupTypes
void SubscribeTypes
void SharedFormChild
void AppFormTypes
void FieldGroupBindingsTypes
void AppFields
void BoundAppFields

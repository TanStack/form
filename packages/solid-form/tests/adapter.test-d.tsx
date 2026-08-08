import { expectTypeOf } from 'vitest'
import {
  createForm,
  createFormHook,
  formOptions,
  getFieldGroupHelpers,
  getFormHookHelpers,
} from '../src'
import type { Accessor } from 'solid-js'
import type { FieldWithValue, SolidFormType, ValidationIssue } from '../src'

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
const { useAppForm, getAppFieldGroupHelpers } = createFormHook({
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

const { helper, defineFields, withFields } = getFieldGroupHelpers()
const profileFields = defineFields({
  name: helper.strict<string>(),
  age: helper.strict<number>(),
})

function ProfileFields(props: { fields: typeof profileFields }) {
  return (
    <props.fields.Field name="name">
      {(field) => {
        expectTypeOf(field().value).toEqualTypeOf<string>()
        return null
      }}
    </props.fields.Field>
  )
}

const Profile = withFields(profileFields, ProfileFields, 'fields')

function FieldGroupBindingsTypes() {
  const form = createForm(() => ({
    defaultValues: {
      user: { name: '', age: 0 },
      wrong: { name: 0, age: '' },
    },
  }))

  return (
    <>
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

const { defineFields: defineAppFields, helper: appHelper } =
  getAppFieldGroupHelpers()
const appFields = defineAppFields({
  name: appHelper.strict<string>(),
})

function AppFields(props: { fields: typeof appFields }) {
  return (
    <props.fields.Field name="name">
      {(field) => <field.Text label="Name" />}
    </props.fields.Field>
  )
}

void FormAndGroupTypes
void SharedFormChild
void AppFormTypes
void FieldGroupBindingsTypes
void AppFields

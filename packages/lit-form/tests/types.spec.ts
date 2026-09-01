import { describe, expectTypeOf, it } from 'vitest'
import { defineFieldGroup, formOptions } from '../src/index.js'
import type {
  AnyLitFormApi,
  LitFormType,
  ValidationIssue,
} from '../src/index.js'

const options = formOptions({
  defaultValues: {
    name: '',
    items: [{ label: '' }],
    profile: { email: '' },
  },
})

type Form = LitFormType<typeof options>

function assertControllerTypes(form: Form) {
  form.subscribe(
    (state) => [state.values.name, state.submissionAttempts],
    (selected) => {
      expectTypeOf(selected).toEqualTypeOf<readonly [string, number]>()
      return null
    },
  )

  form.field({ name: 'name' }, (field) => {
    expectTypeOf(field.value).toEqualTypeOf<string>()
    expectTypeOf(field.errors).toEqualTypeOf<Array<ValidationIssue>>()
    return null
  })

  form.arrayField({ name: 'items' }, (field) => {
    expectTypeOf(field.value).toEqualTypeOf<Array<{ label: string }>>()
    return null
  })

  form.formGroup({ name: 'profile' }, (group) => {
    expectTypeOf(group.value).toEqualTypeOf<{ email: string }>()
    group.field({ name: 'email' }, (field) => {
      expectTypeOf(field.value).toEqualTypeOf<string>()
      return null
    })

    // @ts-expect-error Group fields use names relative to the group.
    group.field({ name: 'name' }, () => null)
    return null
  })

  // @ts-expect-error Unknown form field.
  form.field({ name: 'missing' }, () => null)
  // @ts-expect-error arrayField only accepts array-valued paths.
  form.arrayField({ name: 'name' }, () => null)
}

const reusableFieldGroup = defineFieldGroup(({ strict }) => ({
  value: strict<string>(),
}))
const ReusableField = reusableFieldGroup.bindComponent(
  (props: { fields: typeof reusableFieldGroup.fields }) =>
    props.fields.field({ name: 'value' }, () => null),
  'fields',
)

const identityFieldGroup = defineFieldGroup(({ strict }) => ({
  name: strict<string>(),
}))
const IdentityField = identityFieldGroup.bindComponent(
  (props: { fields: typeof identityFieldGroup.fields }) =>
    props.fields.field({ name: 'name' }, () => null),
  'fields',
)

function assertReusableFieldTypes(form: Form) {
  IdentityField({ form })
  IdentityField({ form, fields: { name: 'profile.email' } })
  ReusableField({ form, fields: { value: 'profile.email' } })
  // @ts-expect-error Non-identity field bindings remain required.
  ReusableField({ form })
  // @ts-expect-error Strict string slots reject non-string fields.
  ReusableField({ form, fields: { value: 'items' } })
}

describe('Lit controller types', () => {
  it('infers fields, arrays, and form groups', () => {
    expectTypeOf<Form>().toExtend<AnyLitFormApi>()
    expectTypeOf(assertControllerTypes).toBeFunction()
    expectTypeOf(assertReusableFieldTypes).toBeFunction()
  })
})

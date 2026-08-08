import { describe, expectTypeOf, it } from 'vitest'
import { formOptions, getFieldGroupHelpers } from '../src/index.js'
import type { LitFormType, ValidationIssue } from '../src/index.js'

const options = formOptions({
  defaultValues: {
    name: '',
    items: [{ label: '' }],
    profile: { email: '' },
  },
})

type Form = LitFormType<typeof options>

function assertControllerTypes(form: Form) {
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

const { defineFields, helper, withFields } = getFieldGroupHelpers()
const reusableFields = defineFields({ value: helper.strict<string>() })
const ReusableField = withFields(
  reusableFields,
  (props: { fields: typeof reusableFields }) =>
    props.fields.field({ name: 'value' }, () => null),
  'fields',
)

function assertReusableFieldTypes(form: Form) {
  ReusableField({ form, fields: { value: 'profile.email' } })
  // @ts-expect-error Strict string slots reject non-string fields.
  ReusableField({ form, fields: { value: 'items' } })
}

describe('Lit controller types', () => {
  it('infers fields, arrays, and form groups', () => {
    expectTypeOf(assertControllerTypes).toBeFunction()
    expectTypeOf(assertReusableFieldTypes).toBeFunction()
  })
})

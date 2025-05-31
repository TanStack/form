import { describe, expect, it, vi } from 'vitest'
import { FieldApi, FieldGroupApi, FormApi } from '../src/index'

describe('field group api', () => {
  type Person = {
    name: string
    age: number
  }
  type FormValues = {
    people: Person[]
    name: string
    age: number
    relatives: {
      father: Person
    }
  }

  it('should inherit defaultValues from the form', () => {
    const defaultValues: FormValues = {
      name: 'Do not access',
      age: -1,
      people: [
        {
          name: 'fieldGroup one',
          age: 1,
        },
        {
          name: 'fieldGroup two',
          age: 2,
        },
      ],
      relatives: {
        father: {
          name: 'fieldGroup three',
          age: 3,
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const fieldGroup1 = new FieldGroupApi({
      form,
      fields: 'people[0]',
      defaultValues: {} as Person,
    })
    const fieldGroup2 = new FieldGroupApi({
      form,
      fields: 'people[1]',
      defaultValues: {} as Person,
    })
    const fieldGroup3 = new FieldGroupApi({
      form,
      fields: 'relatives.father',
      defaultValues: {} as Person,
    })
    fieldGroup1.mount()
    fieldGroup2.mount()
    fieldGroup3.mount()

    expect(fieldGroup1.state).toMatchObject({
      values: {
        name: 'fieldGroup one',
        age: 1,
      },
    })
    expect(fieldGroup2.state).toMatchObject({
      values: {
        name: 'fieldGroup two',
        age: 2,
      },
    })
    expect(fieldGroup3.state).toMatchObject({
      values: {
        name: 'fieldGroup three',
        age: 3,
      },
    })
  })

  it('should have the state synced with the form', () => {
    const defaultValues: FormValues = {
      name: 'Do not access',
      age: -1,
      people: [],
      relatives: {
        father: {
          name: 'father',
          age: 10,
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const fieldGroup = new FieldGroupApi({
      form,
      defaultValues: {} as Person,
      fields: 'relatives.father',
    })
    fieldGroup.mount()

    expect(fieldGroup.state.values).toEqual(form.state.values.relatives.father)

    form.setFieldValue('relatives.father.name', 'New name')
    form.setFieldValue('relatives.father.age', 50)

    expect(fieldGroup.state.values).toEqual(form.state.values.relatives.father)

    fieldGroup.setFieldValue('name', 'Second new name')
    fieldGroup.setFieldValue('age', 100)

    expect(fieldGroup.state.values).toEqual(form.state.values.relatives.father)
    fieldGroup.reset()

    expect(fieldGroup.state.values).toEqual(form.state.values.relatives.father)
  })

  it('should validate the right field from the form', () => {
    const defaultValues: FormValues = {
      name: '',
      age: 0,
      people: [
        {
          name: 'fieldGroup one',
          age: 1,
        },
        {
          name: 'fieldGroup two',
          age: 2,
        },
      ],
      relatives: {
        father: {
          name: 'fieldGroup three',
          age: 3,
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const field1 = new FieldApi({
      form,
      name: 'people[0].age',
      validators: {
        onChange: () => 'Field 1',
      },
    })
    const field2 = new FieldApi({
      form,
      name: 'people[1].age',
      validators: {
        onChange: () => 'Field 2',
      },
    })
    const field3 = new FieldApi({
      form,
      name: 'relatives.father.age',
      validators: {
        onChange: () => 'Field 3',
      },
    })

    field1.mount()
    field2.mount()
    field3.mount()

    const fieldGroup1 = new FieldGroupApi({
      form,
      fields: 'people[0]',
      defaultValues: {} as Person,
    })
    const fieldGroup2 = new FieldGroupApi({
      form,
      fields: 'people[1]',
      defaultValues: {} as Person,
    })
    const fieldGroup3 = new FieldGroupApi({
      form,
      fields: 'relatives.father',
      defaultValues: {} as Person,
    })
    fieldGroup1.mount()
    fieldGroup2.mount()
    fieldGroup3.mount()

    fieldGroup1.validateField('age', 'change')

    expect(field1.state.meta.errors).toEqual(['Field 1'])
    expect(field2.state.meta.errors).toEqual([])
    expect(field3.state.meta.errors).toEqual([])

    fieldGroup2.validateField('age', 'change')

    expect(field1.state.meta.errors).toEqual(['Field 1'])
    expect(field2.state.meta.errors).toEqual(['Field 2'])
    expect(field3.state.meta.errors).toEqual([])

    fieldGroup3.validateField('age', 'change')

    expect(field1.state.meta.errors).toEqual(['Field 1'])
    expect(field2.state.meta.errors).toEqual(['Field 2'])
    expect(field3.state.meta.errors).toEqual(['Field 3'])
  })

  it('should get the right field value from the nested field', () => {
    const defaultValues: FormValues = {
      name: '',
      age: 0,
      people: [
        {
          name: 'fieldGroup one',
          age: 1,
        },
        {
          name: 'fieldGroup two',
          age: 2,
        },
      ],
      relatives: {
        father: {
          name: 'fieldGroup three',
          age: 3,
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const fieldGroup1 = new FieldGroupApi({
      form,
      fields: 'people[0]',
      defaultValues: {} as Person,
    })
    const fieldGroup2 = new FieldGroupApi({
      form,
      fields: 'people[1]',
      defaultValues: {} as Person,
    })
    const fieldGroup3 = new FieldGroupApi({
      form,
      fields: 'relatives.father',
      defaultValues: {} as Person,
    })
    fieldGroup1.mount()
    fieldGroup2.mount()
    fieldGroup3.mount()

    expect(fieldGroup1.getFieldValue('age')).toBe(1)
    expect(fieldGroup1.getFieldValue('name')).toBe('fieldGroup one')

    expect(fieldGroup2.getFieldValue('age')).toBe(2)
    expect(fieldGroup2.getFieldValue('name')).toBe('fieldGroup two')

    expect(fieldGroup3.getFieldValue('age')).toBe(3)
    expect(fieldGroup3.getFieldValue('name')).toBe('fieldGroup three')
  })

  it('should get the correct field Meta from the nested field', () => {
    const defaultValues: FormValues = {
      name: '',
      age: 0,
      people: [
        {
          name: 'fieldGroup one',
          age: 1,
        },
        {
          name: 'fieldGroup two',
          age: 2,
        },
      ],
      relatives: {
        father: {
          name: 'fieldGroup three',
          age: 3,
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const field1 = new FieldApi({
      form,
      name: 'people[0].age',
    })
    const field2 = new FieldApi({
      form,
      name: 'people[1].age',
    })
    const field3 = new FieldApi({
      form,
      name: 'relatives.father.age',
      validators: {
        onMount: () => 'Error',
      },
    })

    field1.mount()
    field2.mount()
    field3.mount()

    field1.handleChange(0)
    field2.handleBlur()

    const fieldGroup1 = new FieldGroupApi({
      form,
      fields: 'people[0]',
      defaultValues: {} as Person,
    })
    const fieldGroup2 = new FieldGroupApi({
      form,
      fields: 'people[1]',
      defaultValues: {} as Person,
    })
    const fieldGroup3 = new FieldGroupApi({
      form,
      fields: 'relatives.father',
      defaultValues: {} as Person,
    })
    fieldGroup1.mount()
    fieldGroup2.mount()
    fieldGroup3.mount()

    expect(fieldGroup1.getFieldMeta('age')?.isValid).toBe(true)
    expect(fieldGroup2.getFieldMeta('age')?.isValid).toBe(true)
    expect(fieldGroup3.getFieldMeta('age')?.isValid).toBe(false)

    expect(fieldGroup1.getFieldMeta('age')?.isDirty).toBe(true)
    expect(fieldGroup2.getFieldMeta('age')?.isDirty).toBe(false)
    expect(fieldGroup3.getFieldMeta('age')?.isDirty).toBe(false)

    expect(fieldGroup1.getFieldMeta('age')?.isBlurred).toBe(false)
    expect(fieldGroup2.getFieldMeta('age')?.isBlurred).toBe(true)
    expect(fieldGroup3.getFieldMeta('age')?.isBlurred).toBe(false)
  })

  it('should be compliant with top level array defaultValues', () => {
    const form = new FormApi({
      defaultValues: { people: [{ name: 'Default' }, { name: 'Default' }] },
    })
    form.mount()

    const fieldGroup = new FieldGroupApi({
      form,
      defaultValues: [{ name: '' }],
      fields: 'people',
    })
    fieldGroup.mount()

    fieldGroup.setFieldValue('[0]', { name: 'Override One' })
    fieldGroup.setFieldValue('[1].name', 'Override Two')

    expect(form.getFieldValue('people[0].name')).toBe('Override One')
    expect(form.getFieldValue('people[1].name')).toBe('Override Two')
  })

  it('should forward validateArrayFieldsStartingFrom to form', async () => {
    vi.useFakeTimers()
    const defaultValues = {
      people: {
        names: [
          {
            name: '',
          },
          {
            name: '',
          },
          {
            name: '',
          },
        ],
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const field0 = new FieldApi({
      form,
      name: 'people.names[0].name',
    })
    const field1 = new FieldApi({
      form,
      name: 'people.names[1].name',
    })
    const field2 = new FieldApi({
      form,
      name: 'people.names[2].name',
    })
    field0.mount()
    field1.mount()
    field2.mount()

    const fieldGroup = new FieldGroupApi({
      form,
      defaultValues: {
        names: [{ name: '' }],
      },
      fields: 'people',
    })
    fieldGroup.mount()

    fieldGroup.validateArrayFieldsStartingFrom('names', 1, 'change')

    await vi.runAllTimersAsync()

    expect(field0.getMeta().isTouched).toBe(false)
    expect(field1.getMeta().isTouched).toBe(true)
    expect(field2.getMeta().isTouched).toBe(true)
  })

  it('should forward handleSubmit to the form', async () => {
    vi.useFakeTimers()

    const defaultValues = {
      person: {
        name: '',
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const fieldGroup = new FieldGroupApi({
      defaultValues: { name: '' },
      form,
      fields: 'person',
    })
    fieldGroup.mount()

    fieldGroup.handleSubmit()

    await vi.runAllTimersAsync()

    expect(form.state.isSubmitted).toBe(true)
    expect(form.state.isSubmitSuccessful).toBe(true)
  })

  it('should forward resetField to the form', () => {
    const defaultValues = {
      nested: {
        field: {
          name: '',
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const fieldGroup = new FieldGroupApi({
      defaultValues: { name: '' },
      form,
      fields: 'nested.field',
    })
    fieldGroup.mount()

    fieldGroup.setFieldValue('name', 'Nested')

    expect(form.state.values.nested.field.name).toEqual('Nested')

    fieldGroup.resetField('name')
    expect(form.state.values.nested.field.name).toEqual('')
  })

  it('should forward deleteField to the form', () => {
    const defaultValues = {
      nested: {
        field: {
          name: '',
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const fieldGroup = new FieldGroupApi({
      defaultValues: { name: '' },
      form,
      fields: 'nested.field',
    })
    fieldGroup.mount()

    fieldGroup.deleteField('name')

    expect(form.state.values.nested.field.name).toBeUndefined()
  })

  it('should forward array methods to the form', async () => {
    vi.useFakeTimers()
    const defaultValues = {
      people: {
        names: [
          {
            name: '',
          },
          {
            name: '',
          },
          {
            name: '',
          },
        ],
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const field0 = new FieldApi({
      form,
      name: 'people.names[0].name',
    })
    const field1 = new FieldApi({
      form,
      name: 'people.names[1].name',
    })
    const field2 = new FieldApi({
      form,
      name: 'people.names[2].name',
    })
    field0.mount()
    field1.mount()
    field2.mount()

    const fieldGroup = new FieldGroupApi({
      defaultValues: { names: [{ name: '' }] },
      form,
      fields: 'people',
    })
    fieldGroup.mount()

    fieldGroup.validateArrayFieldsStartingFrom('names', 1, 'change')

    await vi.runAllTimersAsync()

    expect(field0.getMeta().isTouched).toBe(false)
    expect(field1.getMeta().isTouched).toBe(true)
    expect(field2.getMeta().isTouched).toBe(true)

    fieldGroup.pushFieldValue('names', { name: 'Push' })

    expect(form.getFieldValue('people.names')).toEqual([
      {
        name: '',
      },
      {
        name: '',
      },
      {
        name: '',
      },
      {
        name: 'Push',
      },
    ])

    fieldGroup.insertFieldValue('names', 1, { name: 'Insert' })

    expect(form.getFieldValue('people.names')).toEqual([
      {
        name: '',
      },
      {
        name: 'Insert',
      },
      {
        name: '',
      },
      {
        name: '',
      },
      {
        name: 'Push',
      },
    ])

    fieldGroup.replaceFieldValue('names', 2, { name: 'Replace' })

    expect(form.getFieldValue('people.names')).toEqual([
      {
        name: '',
      },
      {
        name: 'Insert',
      },
      {
        name: 'Replace',
      },
      {
        name: '',
      },
      {
        name: 'Push',
      },
    ])

    fieldGroup.removeFieldValue('names', 3)

    expect(form.getFieldValue('people.names')).toEqual([
      {
        name: '',
      },
      {
        name: 'Insert',
      },
      {
        name: 'Replace',
      },
      {
        name: 'Push',
      },
    ])

    fieldGroup.swapFieldValues('names', 2, 3)

    expect(form.getFieldValue('people.names')).toEqual([
      {
        name: '',
      },
      {
        name: 'Insert',
      },
      {
        name: 'Push',
      },
      {
        name: 'Replace',
      },
    ])

    fieldGroup.moveFieldValues('names', 0, 2)

    expect(form.getFieldValue('people.names')).toEqual([
      {
        name: 'Insert',
      },
      {
        name: 'Push',
      },
      {
        name: '',
      },
      {
        name: 'Replace',
      },
    ])
  })

  it('should allow nesting form fieldGroupes within each other', () => {
    type Nested = {
      firstName: string
    }
    type Wrapper = {
      field: Nested
    }
    type FormVals = {
      form: Wrapper
      unrelated: { something: { lastName: string } }
    }

    const defaultValues: FormVals = {
      form: {
        field: {
          firstName: 'Test',
        },
      },
      unrelated: {
        something: {
          lastName: '',
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })

    const fieldGroupWrap = new FieldGroupApi({
      defaultValues: defaultValues.form,
      form,
      fields: 'form',
    })
    fieldGroupWrap.mount()

    const fieldGroupNested = new FieldGroupApi({
      defaultValues: defaultValues.form.field,
      form: fieldGroupWrap,
      fields: 'field',
    })
    fieldGroupNested.mount()

    expect(fieldGroupNested.form).toEqual(fieldGroupWrap.form)
    expect(fieldGroupNested.state.values).toEqual(
      fieldGroupWrap.state.values.field,
    )
    expect(fieldGroupNested.state.values).toEqual(form.state.values.form.field)
  })
})

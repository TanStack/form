import { describe, expect, it, vi } from 'vitest'
import { FieldApi, FieldGroupApi, FormApi } from '../src/index'

describe('form lens api', () => {
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
          name: 'Lens one',
          age: 1,
        },
        {
          name: 'Lens two',
          age: 2,
        },
      ],
      relatives: {
        father: {
          name: 'Lens three',
          age: 3,
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const lens1 = new FieldGroupApi({
      form,
      fields: 'people[0]',
      defaultValues: {} as Person,
    })
    const lens2 = new FieldGroupApi({
      form,
      fields: 'people[1]',
      defaultValues: {} as Person,
    })
    const lens3 = new FieldGroupApi({
      form,
      fields: 'relatives.father',
      defaultValues: {} as Person,
    })
    lens1.mount()
    lens2.mount()
    lens3.mount()

    expect(lens1.state).toMatchObject({
      values: {
        name: 'Lens one',
        age: 1,
      },
    })
    expect(lens2.state).toMatchObject({
      values: {
        name: 'Lens two',
        age: 2,
      },
    })
    expect(lens3.state).toMatchObject({
      values: {
        name: 'Lens three',
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

    const lens = new FieldGroupApi({
      form,
      defaultValues: {} as Person,
      fields: 'relatives.father',
    })
    lens.mount()

    expect(lens.state.values).toEqual(form.state.values.relatives.father)

    form.setFieldValue('relatives.father.name', 'New name')
    form.setFieldValue('relatives.father.age', 50)

    expect(lens.state.values).toEqual(form.state.values.relatives.father)

    lens.setFieldValue('name', 'Second new name')
    lens.setFieldValue('age', 100)

    expect(lens.state.values).toEqual(form.state.values.relatives.father)
    lens.reset()

    expect(lens.state.values).toEqual(form.state.values.relatives.father)
  })

  it('should validate the right field from the form', () => {
    const defaultValues: FormValues = {
      name: '',
      age: 0,
      people: [
        {
          name: 'Lens one',
          age: 1,
        },
        {
          name: 'Lens two',
          age: 2,
        },
      ],
      relatives: {
        father: {
          name: 'Lens three',
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

    const lens1 = new FieldGroupApi({
      form,
      fields: 'people[0]',
      defaultValues: {} as Person,
    })
    const lens2 = new FieldGroupApi({
      form,
      fields: 'people[1]',
      defaultValues: {} as Person,
    })
    const lens3 = new FieldGroupApi({
      form,
      fields: 'relatives.father',
      defaultValues: {} as Person,
    })
    lens1.mount()
    lens2.mount()
    lens3.mount()

    lens1.validateField('age', 'change')

    expect(field1.state.meta.errors).toEqual(['Field 1'])
    expect(field2.state.meta.errors).toEqual([])
    expect(field3.state.meta.errors).toEqual([])

    lens2.validateField('age', 'change')

    expect(field1.state.meta.errors).toEqual(['Field 1'])
    expect(field2.state.meta.errors).toEqual(['Field 2'])
    expect(field3.state.meta.errors).toEqual([])

    lens3.validateField('age', 'change')

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
          name: 'Lens one',
          age: 1,
        },
        {
          name: 'Lens two',
          age: 2,
        },
      ],
      relatives: {
        father: {
          name: 'Lens three',
          age: 3,
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const lens1 = new FieldGroupApi({
      form,
      fields: 'people[0]',
      defaultValues: {} as Person,
    })
    const lens2 = new FieldGroupApi({
      form,
      fields: 'people[1]',
      defaultValues: {} as Person,
    })
    const lens3 = new FieldGroupApi({
      form,
      fields: 'relatives.father',
      defaultValues: {} as Person,
    })
    lens1.mount()
    lens2.mount()
    lens3.mount()

    expect(lens1.getFieldValue('age')).toBe(1)
    expect(lens1.getFieldValue('name')).toBe('Lens one')

    expect(lens2.getFieldValue('age')).toBe(2)
    expect(lens2.getFieldValue('name')).toBe('Lens two')

    expect(lens3.getFieldValue('age')).toBe(3)
    expect(lens3.getFieldValue('name')).toBe('Lens three')
  })

  it('should get the correct field Meta from the nested field', () => {
    const defaultValues: FormValues = {
      name: '',
      age: 0,
      people: [
        {
          name: 'Lens one',
          age: 1,
        },
        {
          name: 'Lens two',
          age: 2,
        },
      ],
      relatives: {
        father: {
          name: 'Lens three',
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

    const lens1 = new FieldGroupApi({
      form,
      fields: 'people[0]',
      defaultValues: {} as Person,
    })
    const lens2 = new FieldGroupApi({
      form,
      fields: 'people[1]',
      defaultValues: {} as Person,
    })
    const lens3 = new FieldGroupApi({
      form,
      fields: 'relatives.father',
      defaultValues: {} as Person,
    })
    lens1.mount()
    lens2.mount()
    lens3.mount()

    expect(lens1.getFieldMeta('age')?.isValid).toBe(true)
    expect(lens2.getFieldMeta('age')?.isValid).toBe(true)
    expect(lens3.getFieldMeta('age')?.isValid).toBe(false)

    expect(lens1.getFieldMeta('age')?.isDirty).toBe(true)
    expect(lens2.getFieldMeta('age')?.isDirty).toBe(false)
    expect(lens3.getFieldMeta('age')?.isDirty).toBe(false)

    expect(lens1.getFieldMeta('age')?.isBlurred).toBe(false)
    expect(lens2.getFieldMeta('age')?.isBlurred).toBe(true)
    expect(lens3.getFieldMeta('age')?.isBlurred).toBe(false)
  })

  it('should be compliant with top level array defaultValues', () => {
    const form = new FormApi({
      defaultValues: { people: [{ name: 'Default' }, { name: 'Default' }] },
    })
    form.mount()

    const lens = new FieldGroupApi({
      form,
      defaultValues: [{ name: '' }],
      fields: 'people',
    })
    lens.mount()

    lens.setFieldValue('[0]', { name: 'Override One' })
    lens.setFieldValue('[1].name', 'Override Two')

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

    const lens = new FieldGroupApi({
      form,
      defaultValues: {
        names: [{ name: '' }],
      },
      fields: 'people',
    })
    lens.mount()

    lens.validateArrayFieldsStartingFrom('names', 1, 'change')

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

    const lens = new FieldGroupApi({
      defaultValues: { name: '' },
      form,
      fields: 'person',
    })
    lens.mount()

    lens.handleSubmit()

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

    const lens = new FieldGroupApi({
      defaultValues: { name: '' },
      form,
      fields: 'nested.field',
    })
    lens.mount()

    lens.setFieldValue('name', 'Nested')

    expect(form.state.values.nested.field.name).toEqual('Nested')

    lens.resetField('name')
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

    const lens = new FieldGroupApi({
      defaultValues: { name: '' },
      form,
      fields: 'nested.field',
    })
    lens.mount()

    lens.deleteField('name')

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

    const lens = new FieldGroupApi({
      defaultValues: { names: [{ name: '' }] },
      form,
      fields: 'people',
    })
    lens.mount()

    lens.validateArrayFieldsStartingFrom('names', 1, 'change')

    await vi.runAllTimersAsync()

    expect(field0.getMeta().isTouched).toBe(false)
    expect(field1.getMeta().isTouched).toBe(true)
    expect(field2.getMeta().isTouched).toBe(true)

    lens.pushFieldValue('names', { name: 'Push' })

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

    lens.insertFieldValue('names', 1, { name: 'Insert' })

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

    lens.replaceFieldValue('names', 2, { name: 'Replace' })

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

    lens.removeFieldValue('names', 3)

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

    lens.swapFieldValues('names', 2, 3)

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

    lens.moveFieldValues('names', 0, 2)

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

  it('should allow nesting form lenses within each other', () => {
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

    const lensWrap = new FieldGroupApi({
      defaultValues: defaultValues.form,
      form,
      fields: 'form',
    })
    lensWrap.mount()

    const lensNested = new FieldGroupApi({
      defaultValues: defaultValues.form.field,
      form: lensWrap,
      fields: 'field',
    })
    lensNested.mount()

    expect(lensNested.form).toEqual(lensWrap.form)
    expect(lensNested.state.values).toEqual(lensWrap.state.values.field)
    expect(lensNested.state.values).toEqual(form.state.values.form.field)
  })
})

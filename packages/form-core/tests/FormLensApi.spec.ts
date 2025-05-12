import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { FieldApi, FormApi, FormLensApi } from '../src/index'
import { defaultFieldMeta } from '../src/metaHelper'

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

    const lens1 = new FormLensApi({
      form,
      name: 'people[0]',
      defaultValues: {} as Person,
    })
    const lens2 = new FormLensApi({
      form,
      name: 'people[1]',
      defaultValues: {} as Person,
    })
    const lens3 = new FormLensApi({
      form,
      name: 'relatives.father',
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

  it('should inherit the name from the constructor', () => {
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

    const lens = new FormLensApi({
      form,
      defaultValues: {} as Person,
      name: 'relatives.father',
    })
    lens.mount()

    expect(lens.name).toEqual('relatives.father')
  })

  it("should expose the form's base properties", () => {
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

    const lens = new FormLensApi({
      form,
      defaultValues: {} as Person,
      name: 'relatives.father',
    })
    lens.mount()

    expect(lens.baseStore).toStrictEqual(form.baseStore)
    expect(lens.options).toStrictEqual(form.options)
    expect(lens.fieldMetaDerived).toStrictEqual(form.fieldMetaDerived)
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

    const lens = new FormLensApi({
      form,
      defaultValues: {} as Person,
      name: 'relatives.father',
    })
    lens.mount()

    function checkIfStateIsSynced() {
      const { values: formValues, errors, errorMap, ...formState } = form.state
      const {
        values: lensValues,
        lensErrors,
        lensErrorMap,
        formErrorMap,
        formErrors,
        ...lensState
      } = lens.state

      expect(lensValues).toEqual(formValues.relatives.father)
      expect(errors).toEqual(formErrors)
      expect(errorMap).toEqual(formErrorMap)
      expect(lensErrors).toEqual(
        form.getFieldMeta('relatives.father')?.errors ??
          defaultFieldMeta.errors,
      )
      expect(lensErrorMap).toEqual(
        form.getFieldMeta('relatives.father')?.errorMap ??
          defaultFieldMeta.errorMap,
      )
      expect(formState).toEqual(lensState)
    }

    checkIfStateIsSynced()

    form.setFieldValue('relatives.father.name', 'New name')
    form.setFieldValue('relatives.father.age', 50)

    checkIfStateIsSynced()

    lens.setFieldValue('name', 'Second new name')
    lens.setFieldValue('age', 100)

    checkIfStateIsSynced()
    lens.reset()

    checkIfStateIsSynced()
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

    const lens1 = new FormLensApi({
      form,
      name: 'people[0]',
      defaultValues: {} as Person,
    })
    const lens2 = new FormLensApi({
      form,
      name: 'people[1]',
      defaultValues: {} as Person,
    })
    const lens3 = new FormLensApi({
      form,
      name: 'relatives.father',
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

    const lens1 = new FormLensApi({
      form,
      name: 'people[0]',
      defaultValues: {} as Person,
    })
    const lens2 = new FormLensApi({
      form,
      name: 'people[1]',
      defaultValues: {} as Person,
    })
    const lens3 = new FormLensApi({
      form,
      name: 'relatives.father',
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

    const lens1 = new FormLensApi({
      form,
      name: 'people[0]',
      defaultValues: {} as Person,
    })
    const lens2 = new FormLensApi({
      form,
      name: 'people[1]',
      defaultValues: {} as Person,
    })
    const lens3 = new FormLensApi({
      form,
      name: 'relatives.father',
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

  it('should get the correct field info from the nested field', () => {
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

    field1.mount()
    field2.mount()

    const lens1 = new FormLensApi({
      form,
      name: 'people[0]',
      defaultValues: {} as Person,
    })
    const lens2 = new FormLensApi({
      form,
      name: 'people[1]',
      defaultValues: {} as Person,
    })
    const lens3 = new FormLensApi({
      form,
      name: 'relatives.father',
      defaultValues: {} as Person,
    })
    lens1.mount()
    lens2.mount()
    lens3.mount()

    field2.handleChange(0)

    expect(lens1.getFieldInfo('age').instance).toEqual(
      field1.getInfo().instance,
    )
    expect(lens2.getFieldInfo('age').instance).toEqual(
      field2.getInfo().instance,
    )
    expect(lens3.getFieldInfo('age').instance).toBeNull()
  })

  it('should set the correct field meta from the nested field', () => {
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

    const lens1 = new FormLensApi({
      form,
      name: 'people[0]',
      defaultValues: {} as Person,
    })
    const lens2 = new FormLensApi({
      form,
      name: 'people[1]',
      defaultValues: {} as Person,
    })
    const lens3 = new FormLensApi({
      form,
      name: 'relatives.father',
      defaultValues: {} as Person,
    })
    lens1.mount()
    lens2.mount()
    lens3.mount()

    lens1.setFieldMeta('age', (p) => ({ ...p, isDirty: true }))
    lens2.setFieldMeta('age', (p) => ({ ...p, isBlurred: true }))
    lens3.setFieldMeta('age', (p) => ({ ...p, isTouched: true }))

    expect(lens1.getFieldInfo('age')).toEqual(
      form.getFieldInfo('people[0].age'),
    )
    expect(lens2.getFieldInfo('age')).toEqual(
      form.getFieldInfo('people[1].age'),
    )
    expect(lens3.getFieldInfo('age')).toEqual(
      form.getFieldInfo('relatives.father.age'),
    )
  })

  it('should be compliant with top level array defaultValues', () => {
    const form = new FormApi({
      defaultValues: { people: [{ name: 'Default' }, { name: 'Default' }] },
    })
    form.mount()

    const lens = new FormLensApi({
      form,
      defaultValues: [{ name: '' }],
      name: 'people',
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

    const lens = new FormLensApi({
      form,
      defaultValues: {
        names: [{ name: '' }],
      },
      name: 'people',
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

    const lens = new FormLensApi({
      defaultValues: { name: '' },
      form,
      name: 'person',
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

    const lens = new FormLensApi({
      defaultValues: { name: '' },
      form,
      name: 'nested.field',
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

    const lens = new FormLensApi({
      defaultValues: { name: '' },
      form,
      name: 'nested.field',
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

    const lens = new FormLensApi({
      defaultValues: { names: [{ name: '' }] },
      form,
      name: 'people',
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

  it('should parse getAllErrors to match subfield names', () => {
    const emptyError = {
      errors: [],
      errorMap: {},
    }
    function errorWith(value: string) {
      return {
        errors: [value],
        errorMap: {
          onMount: value,
        },
      }
    }
    const defaultValues: FormValues = {
      age: 0,
      name: '',
      people: [
        { age: 0, name: '' },
        { age: 0, name: '' },
      ],
      relatives: {
        father: {
          name: '',
          age: 0,
        },
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const field0 = new FieldApi({
      form,
      name: 'people[0].age',
      validators: {
        onMount: () => 'people[0].age',
      },
    })
    const field1 = new FieldApi({
      form,
      name: 'people[1].name',
      validators: {
        onMount: () => 'people[1].name',
      },
    })
    const field2 = new FieldApi({
      form,
      name: 'relatives.father',
      validators: {
        onMount: () => 'relatives.father',
      },
    })
    field0.mount()
    field1.mount()
    field2.mount()

    // Test one: people[0].age -> age
    const lens1 = new FormLensApi({
      defaultValues: {} as Person,
      form,
      name: 'people[0]',
    })
    lens1.mount()

    expect(lens1.getAllErrors()).toEqual({
      form: emptyError,
      lens: emptyError,
      fields: {
        age: errorWith('people[0].age'),
      },
    })

    // Test two: relatives.father -> Lens level error
    const lens2 = new FormLensApi({
      defaultValues: {} as Person,
      form,
      name: 'relatives.father',
    })
    lens2.mount()

    expect(lens2.getAllErrors()).toEqual({
      form: emptyError,
      lens: errorWith('relatives.father'),
      fields: {},
    })

    // Test three: array at top level -> namespaced
    const lens3 = new FormLensApi({
      defaultValues: [] as Person[],
      form,
      name: 'people',
    })
    lens3.mount()

    expect(lens3.getAllErrors()).toEqual({
      form: emptyError,
      lens: emptyError,
      fields: {
        '[0].age': errorWith('people[0].age'),
        '[1].name': errorWith('people[1].name'),
      },
    })
  })

  it('should inherit form errors in getAllErrors', () => {
    type ValueType = { value: string }
    type FormType = { nested: ValueType }

    const defaultValues: FormType = {
      nested: { value: '' },
    }
    const form = new FormApi({
      defaultValues,
      validators: {
        onMount: () => 'Error',
      },
    })
    form.mount()

    const lens = new FormLensApi({
      defaultValues: {} as ValueType,
      form,
      name: 'nested',
    })
    lens.mount()

    expect(lens.getAllErrors()).toEqual({
      form: { errors: ['Error'], errorMap: { onMount: 'Error' } },
      lens: {
        errors: [],
        errorMap: {},
      },
      fields: {},
    })
  })

  it('should parse values with a provided schema', async () => {
    vi.useFakeTimers()
    const schema = z.object({
      nested: z.object({
        value: z.string().min(1),
      }),
    })
    type FormType = z.input<typeof schema>

    const defaultValues: FormType = {
      nested: {
        value: '',
      },
    }

    const form = new FormApi({
      defaultValues,
    })
    form.mount()

    const lens = new FormLensApi({
      defaultValues: { value: '' },
      form,
      name: 'nested',
    })
    lens.mount()

    const issuesSync = lens.parseValuesWithSchema(schema.shape.nested)
    expect(issuesSync?.length).toBe(1)
    expect(issuesSync?.[0]).toHaveProperty('message')

    const issuesPromise = lens.parseValuesWithSchemaAsync(schema.shape.nested)
    expect(issuesPromise).toBeInstanceOf(Promise)
    const issuesAsync = await issuesPromise

    expect(issuesAsync).toEqual(issuesSync)
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

    const lensWrap = new FormLensApi({
      defaultValues: defaultValues.form,
      form,
      name: 'form',
    })
    lensWrap.mount()

    const lensNested = new FormLensApi({
      defaultValues: defaultValues.form.field,
      form: lensWrap,
      name: 'field',
    })
    lensNested.mount()

    expect(lensNested.name).toBe('form.field')
    expect(lensWrap.name).toBe('form')
    expect(lensNested.form).toEqual(lensWrap.form)
    expect(lensNested.state.values).toEqual(lensWrap.state.values.field)
    expect(lensNested.state.values).toEqual(form.state.values.form.field)
  })
})

it('should inherit errors on lens level from FieldApis with the same name', async () => {
  vi.useFakeTimers()
  const defaultValues = {
    test: {
      field: {
        value: '',
      },
    },
  }

  const form = new FormApi({
    defaultValues,
    validators: {
      onChange: () => {
        return {
          fields: {
            'test.field': 'Error',
          },
        }
      },
    },
  })
  form.mount()

  const field = new FieldApi({
    form,
    name: 'test.field',
  })
  field.mount()

  const lens = new FormLensApi({
    defaultValues: defaultValues.test.field,
    form,
    name: 'test.field',
  })
  lens.mount()

  expect(lens.state.lensErrors).toEqual([])
  expect(lens.state.lensErrorMap).toEqual({})

  form.validate('change')

  await vi.runAllTimersAsync()

  expect(lens.state.lensErrors).toEqual(['Error'])
  expect(lens.state.lensErrorMap).toEqual({ onChange: 'Error' })
})

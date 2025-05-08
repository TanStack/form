import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { FieldApi, FormApi, FormLensApi } from '../src/index'
import { sleep } from './utils'
import type { AnyFieldApi, AnyFormApi } from '../src/index'

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

    expect(lens.baseStore).toStrictEqual(form.baseStore)
    expect(lens.options).toStrictEqual(form.options)
    expect(lens.store).toStrictEqual(form.store)
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

    function checkIfStateIsSynced() {
      const { values: formValues, ...formState } = form.state
      const { values: lensValues, ...lensState } = lens.state

      expect(lensValues).toEqual(formValues.relatives.father)
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
})

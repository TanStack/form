import { describe, expect, it, vi } from 'vitest'
import { FieldApi, FormApi } from '../src/index'
import { sleep } from './utils'

describe('form api', () => {
  it('should get default form state when default values are passed', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })
    form.mount()
    expect(form.state).toMatchObject({
      values: {
        name: 'test',
      },
    })
  })

  it('should get default form state when default state is passed', () => {
    const form = new FormApi({
      defaultState: {
        submissionAttempts: 30,
      },
    })
    form.mount()
    expect(form.state).toMatchObject({
      submissionAttempts: 30,
    })
  })

  it('should handle updating form state', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })
    form.mount()
    form.update({
      defaultValues: {
        name: 'other',
      },
      defaultState: {
        submissionAttempts: 300,
      },
    })

    expect(form.state).toMatchObject({
      values: {
        name: 'other',
      },
      submissionAttempts: 300,
    })
  })

  it('should reset the form state properly', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })
    form.mount()
    form.setFieldValue('name', 'other', {
      dontUpdateMeta: true,
    })
    form.state.submissionAttempts = 300

    form.reset()

    expect(form.state).toMatchObject({
      values: {
        name: 'test',
      },
      fieldMeta: {},
      submissionAttempts: 0,
    })
  })

  it('should reset with provided custom default values', () => {
    const defaultValues = {
      name: 'test',
      surname: 'test2',
      age: 30,
    }
    const form = new FormApi({
      defaultValues: defaultValues,
    })

    form.mount()
    form.setFieldValue('name', 'other')

    expect(form.state.values).toEqual({
      name: 'other',
      surname: 'test2',
      age: 30,
    })

    form.reset()

    expect(form.state.values).toEqual(defaultValues)

    form.setFieldValue('name', 'other2')
    form.setFieldValue('age', 33)

    const resetValues = {
      name: 'reset name',
      age: 40,
      surname: 'reset surname',
    }
    form.reset(resetValues)

    expect(form.state).toMatchObject({
      values: {
        name: 'reset name',
        age: 40,
        surname: 'reset surname',
      },
    })
  })

  it('should reset and set the new default values that are restored after an empty reset', () => {
    const form = new FormApi({ defaultValues: { name: 'initial' } })
    form.mount()

    const field = new FieldApi({ form, name: 'name' })
    field.mount()

    form.reset({ name: 'other' })
    expect(form.state.values).toEqual({ name: 'other' })

    field.handleChange('')
    form.reset()
    expect(form.state.values).toEqual({ name: 'other' })
  })

  it('should reset without setting the new default values that are restored after an empty reset if opts.keepDefaultValues is true', () => {
    const form = new FormApi({ defaultValues: { name: 'initial' } })
    form.mount()

    const field = new FieldApi({ form, name: 'name' })
    field.mount()

    form.reset({ name: 'other' }, { keepDefaultValues: true })
    expect(form.state.values).toEqual({ name: 'other' })

    field.handleChange('')
    form.reset()
    expect(form.state.values).toEqual({ name: 'initial' })
  })

  it("should get a field's value", () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })
    form.mount()
    expect(form.getFieldValue('name')).toEqual('test')
  })

  it("should set a field's value", () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })
    form.mount()
    form.setFieldValue('name', 'other')

    expect(form.getFieldValue('name')).toEqual('other')
  })

  it("should be dirty after a field's value has been set", () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })
    form.mount()

    form.setFieldValue('name', 'other')

    expect(form.state.isDirty).toBe(true)
    expect(form.state.isPristine).toBe(false)
  })

  it('should be clean again after being reset from a dirty state', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })
    form.mount()

    form.setFieldMeta('name', (meta) => ({
      ...meta,
      isDirty: true,
      isPristine: false,
    }))

    form.reset()

    expect(form.state.isDirty).toBe(false)
    expect(form.state.isPristine).toBe(true)
  })

  it("should push an array field's value", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test'],
      },
    })
    form.mount()
    form.pushFieldValue('names', 'other')

    expect(form.getFieldValue('names')).toStrictEqual(['test', 'other'])
  })

  it("should insert an array field's value as first element", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })
    form.mount()
    form.insertFieldValue('names', 0, 'other')

    expect(form.getFieldValue('names')).toStrictEqual([
      'other',
      'one',
      'two',
      'three',
    ])
  })

  it("should run onChange validation when pushing an array field's value", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test'],
      },
      validators: {
        onChange: ({ value }) =>
          value.names.length > 3 ? undefined : 'At least 3 names are required',
      },
    })
    form.mount()
    // Since validation runs through the field, a field must be mounted for that array
    const field = new FieldApi({ form, name: 'names' })
    field.mount()

    form.pushFieldValue('names', 'other')

    expect(form.state.errors).toStrictEqual(['At least 3 names are required'])
  })

  it("should insert an array field's value", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })
    form.mount()
    form.insertFieldValue('names', 1, 'other')

    expect(form.getFieldValue('names')).toStrictEqual([
      'one',
      'other',
      'two',
      'three',
    ])
  })

  it("should insert an array field's value at the end if the index is higher than the length", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })
    form.mount()
    form.insertFieldValue('names', 10, 'other')

    expect(form.getFieldValue('names')).toStrictEqual([
      'one',
      'two',
      'three',
      'other',
    ])
  })

  it("should replace an array field's value", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })
    form.mount()
    form.replaceFieldValue('names', 1, 'other')

    expect(form.getFieldValue('names')).toStrictEqual(['one', 'other', 'three'])
  })

  it("should do nothing when replacing an array field's value with an index that doesn't exist", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })
    form.mount()
    form.replaceFieldValue('names', 10, 'other')

    expect(form.getFieldValue('names')).toStrictEqual(['one', 'two', 'three'])
  })

  it("should run onChange validation when inserting an array field's value", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test'],
      },
      validators: {
        onChange: ({ value }) =>
          value.names.length > 3 ? undefined : 'At least 3 names are required',
      },
    })
    form.mount()
    // Since validation runs through the field, a field must be mounted for that array
    new FieldApi({ form, name: 'names' }).mount()

    form.insertFieldValue('names', 1, 'other')

    expect(form.state.errors).toStrictEqual(['At least 3 names are required'])
  })

  it("should shift meta (including errors) when inserting an array field's primitive value", async () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })
    form.mount()

    new FieldApi({ form, name: 'names' }).mount()

    const field0 = new FieldApi({ form, name: 'names[0]' })
    field0.mount()

    const field1 = new FieldApi({
      form,
      name: 'names[1]',
      validators: {
        onChange: ({ value }) => value !== 'test' && 'Invalid value',
      },
    })
    field1.mount()

    const field2 = new FieldApi({
      form,
      name: 'names[2]',
      validators: {
        onChange: ({ value }) => value !== 'test' && 'Invalid value',
      },
    })
    field2.mount()

    const field3 = new FieldApi({ form, name: 'names[3]' })
    field3.mount()

    field0.handleChange('foo')
    expect(field0.state.meta.isDirty).toBe(true)

    field1.handleBlur()
    expect(field1.state.meta.isBlurred).toBe(true)

    field1.handleChange('other')
    expect(field1.state.meta.errors).toStrictEqual(['Invalid value'])

    await form.insertFieldValue('names', 1, 'test')

    // field0 meta didn't move on field1 as we inserted after it
    expect(field0.state.meta.isDirty).toBe(true)
    expect(field1.state.meta.isDirty).toBe(false)

    // field1 meta (isBlurred = true) moved on field2
    expect(field0.state.meta.isBlurred).toBe(false)
    expect(field1.state.meta.isBlurred).toBe(false)
    expect(field2.state.meta.isBlurred).toBe(true)
    expect(field3.state.meta.isBlurred).toBe(false)

    // field1 errors moved on field2
    expect(field0.state.meta.errors).toStrictEqual([])
    expect(field1.state.meta.errors).toStrictEqual([])
    expect(field2.state.meta.errors).toStrictEqual(['Invalid value'])
    expect(field3.state.meta.errors).toStrictEqual([])
  })

  it("should shift meta (including errors) when inserting an array field's primitive value, last element meta", async () => {
    const form = new FormApi({ defaultValues: { names: ['one'] } })
    form.mount()

    new FieldApi({ form, name: 'names' }).mount()

    const field0 = new FieldApi({
      form,
      name: 'names[0]',
      validators: {
        onBlur: ({ value }) => value !== 'test' && 'Invalid value',
      },
    })
    field0.mount()

    const field1 = new FieldApi({ form, name: 'names[1]' })
    field1.mount()

    field0.handleChange('foo')
    expect(field0.state.meta.isDirty).toBe(true)

    field0.handleBlur()
    expect(field0.state.meta.isBlurred).toBe(true)
    expect(field0.state.meta.errors).toStrictEqual(['Invalid value'])

    await form.insertFieldValue('names', 0, 'test')

    expect(field0.state.meta.isDirty).toBe(false)
    expect(field0.state.meta.isBlurred).toBe(false)
    expect(field0.state.meta.errors).toStrictEqual([])

    expect(field1.state.meta.isDirty).toBe(true)
    expect(field1.state.meta.isBlurred).toBe(true)
    expect(field1.state.meta.errors).toStrictEqual(['Invalid value'])
  })

  it("should shift meta (including errors) when inserting an array field's nested value", async () => {
    const form = new FormApi({
      defaultValues: {
        names: [{ first: 'test' }, { first: 'test2' }],
      },
    })
    form.mount()
    // Since validation runs through the field, a field must be mounted for that array
    new FieldApi({ form, name: 'names' }).mount()

    const field0 = new FieldApi({
      form,
      name: 'names[0].first',
      validators: {
        onBlur: ({ value }) => value !== 'test' && 'Invalid value',
      },
      defaultValue: 'other',
    })
    field0.mount()

    const field1 = new FieldApi({
      form,
      name: 'names[1].first',
      validators: {
        onBlur: ({ value }) => value !== 'test' && 'Invalid value',
      },
    })
    field1.mount()

    expect(field0.state.meta.errors).toStrictEqual([])
    expect(field0.state.meta.isBlurred).toBe(false)
    field0.handleBlur()
    expect(field0.state.meta.errors).toStrictEqual(['Invalid value'])
    expect(field0.state.meta.isBlurred).toBe(true)

    await form.insertFieldValue('names', 0, { first: 'test' })

    expect(field0.state.meta.errors).toStrictEqual([])
    expect(field0.state.meta.isBlurred).toBe(false)
    expect(field1.state.meta.errors).toStrictEqual(['Invalid value'])
    expect(field1.state.meta.isBlurred).toBe(true)
  })

  it("should validate all shifted fields when inserting an array field's value", async () => {
    const form = new FormApi({
      defaultValues: {
        names: [{ first: 'test' }, { first: 'test2' }],
      },
      validators: {
        onChange: ({ value }) =>
          value.names.length > 3 ? undefined : 'At least 3 names are required',
      },
    })
    form.mount()
    // Since validation runs through the field, a field must be mounted for that array
    new FieldApi({ form, name: 'names' }).mount()

    const field1 = new FieldApi({
      form,
      name: 'names[0].first',
      defaultValue: 'test',
      validators: {
        onChange: ({ value }) => value !== 'test' && 'Invalid value',
      },
    })
    field1.mount()

    expect(field1.state.meta.errors).toStrictEqual([])

    await form.replaceFieldValue('names', 0, { first: 'other' })

    expect(field1.state.meta.errors).toStrictEqual(['Invalid value'])
  })

  it("should remove an array field's value", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })
    form.mount()
    form.removeFieldValue('names', 1)

    expect(form.getFieldValue('names')).toStrictEqual(['one', 'three'])
  })

  it("should run onChange validation when removing an array field's value", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test'],
      },
      validators: {
        onChange: ({ value }) =>
          value.names.length > 1 ? undefined : 'At least 1 name is required',
      },
    })
    form.mount()
    // Since validation runs through the field, a field must be mounted for that array
    new FieldApi({ form, name: 'names' }).mount()

    form.removeFieldValue('names', 0)

    expect(form.state.errors).toStrictEqual(['At least 1 name is required'])
  })

  it("should validate following fields when removing an array field's value", async () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test', 'test2', 'test3'],
      },
      validators: {
        onChange: ({ value }) =>
          value.names.length > 1 ? undefined : 'At least 1 name is required',
      },
    })
    form.mount()
    // Since validation runs through the field, a field must be mounted for that array
    new FieldApi({ form, name: 'names' }).mount()

    const field1 = new FieldApi({
      form,
      name: 'names[0]',
      defaultValue: 'test',
      validators: {
        onChange: ({ value }) => value !== 'test' && 'Invalid value',
      },
    })
    field1.mount()
    const field2 = new FieldApi({
      form,
      name: 'names[1]',
      defaultValue: 'test2',
      validators: {
        onChange: ({ value }) => value !== 'test2' && 'Invalid value',
      },
    })
    field2.mount()
    const field3 = new FieldApi({
      form,
      name: 'names[2]',
      defaultValue: 'test3',
      validators: {
        onChange: ({ value }) => value !== 'test3' && 'Invalid value',
      },
    })
    field3.mount()

    expect(field1.state.meta.errors).toStrictEqual([])
    expect(field2.state.meta.errors).toStrictEqual([])
    expect(field3.state.meta.errors).toStrictEqual([])

    await form.removeFieldValue('names', 1)

    expect(field1.state.meta.errors).toStrictEqual([])
    expect(field2.state.meta.errors).toStrictEqual(['Invalid value'])
    // This field does not exist anymore. Therefore, its validation should also not run
    expect(field3.state.meta.errors).toStrictEqual([])
  })

  it('should shift meta (nested) when removing array values', () => {
    const form = new FormApi({
      defaultValues: {
        users: [
          { name: 'test', surname: 'test' },
          { name: 'test2', surname: 'test2' },
          { name: 'test3', surname: 'test3' },
        ],
      },
    })
    form.mount()
    new FieldApi({ form, name: 'users' }).mount()
    const field0Name = new FieldApi({ form, name: 'users[0].name' })
    field0Name.mount()
    const field0Surname = new FieldApi({ form, name: 'users[0].surname' })
    field0Surname.mount()
    const field1Name = new FieldApi({ form, name: 'users[1].name' })
    field1Name.mount()
    const field1Surname = new FieldApi({ form, name: 'users[1].surname' })
    field1Surname.mount()
    const field2Name = new FieldApi({ form, name: 'users[2].name' })
    field2Name.mount()
    const field2Surname = new FieldApi({ form, name: 'users[2].surname' })
    field2Surname.mount()

    expect(field0Name.state.meta.isBlurred).toBe(false)
    expect(field0Surname.state.meta.isBlurred).toBe(false)
    expect(field1Name.state.meta.isBlurred).toBe(false)
    expect(field1Surname.state.meta.isBlurred).toBe(false)
    expect(field2Name.state.meta.isBlurred).toBe(false)
    expect(field2Surname.state.meta.isBlurred).toBe(false)

    field0Name.handleBlur()
    field2Name.handleBlur()
    field2Surname.handleBlur()

    expect(field0Name.state.meta.isBlurred).toBe(true)
    expect(field0Surname.state.meta.isBlurred).toBe(false)
    expect(field1Name.state.meta.isBlurred).toBe(false)
    expect(field1Surname.state.meta.isBlurred).toBe(false)
    expect(field2Name.state.meta.isBlurred).toBe(true)
    expect(field2Surname.state.meta.isBlurred).toBe(true)

    form.removeFieldValue('users', 1)

    expect(field0Name.state.meta.isBlurred).toBe(true)
    expect(field0Surname.state.meta.isBlurred).toBe(false)
    // field2's meta moved on field1 now
    expect(field1Name.state.meta.isBlurred).toBe(true)
    expect(field1Surname.state.meta.isBlurred).toBe(true)
  })

  it("should swap an array field's value", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })
    form.mount()
    // Since validation runs through the field, a field must be mounted for that array
    new FieldApi({ form, name: 'names' }).mount()

    form.swapFieldValues('names', 1, 2)

    expect(form.getFieldValue('names')).toStrictEqual(['one', 'three', 'two'])
  })

  it("should run onChange validation when swapping an array field's value", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test', 'test2'],
      },
      validators: {
        onChange: ({ value }) =>
          value.names.length > 3 ? undefined : 'At least 3 names are required',
      },
    })
    form.mount()
    // Since validation runs through the field, a field must be mounted for that array
    new FieldApi({ form, name: 'names' }).mount()
    expect(form.state.errors).toStrictEqual([])

    form.swapFieldValues('names', 1, 2)

    expect(form.state.errors).toStrictEqual(['At least 3 names are required'])
  })

  it('should run validation on swapped fields', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test', 'test2'],
      },
      validators: {
        onChange: ({ value }) =>
          value.names.length > 3 ? undefined : 'At least 3 names are required',
      },
    })
    form.mount()
    // Since validation runs through the field, a field must be mounted for that array
    new FieldApi({ form, name: 'names' }).mount()

    const field1 = new FieldApi({
      form,
      name: 'names[0]',
      defaultValue: 'test',
      validators: {
        onChange: ({ value }) => value !== 'test' && 'Invalid value',
      },
    })
    field1.mount()

    const field2 = new FieldApi({
      form,
      name: 'names[1]',
      defaultValue: 'test2',
    })
    field2.mount()

    expect(field1.state.meta.errors).toStrictEqual([])
    expect(field2.state.meta.errors).toStrictEqual([])

    form.swapFieldValues('names', 0, 1)

    expect(field1.state.meta.errors).toStrictEqual(['Invalid value'])
    expect(field2.state.meta.errors).toStrictEqual([])
  })

  it('should swap meta when swapping array values', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })
    form.mount()
    // Since validation runs through the field, a field must be mounted for that array
    new FieldApi({ form, name: 'names' }).mount()

    const field0 = new FieldApi({ form, name: 'names[0]' })
    field0.mount()

    const field1 = new FieldApi({ form, name: 'names[1]' })
    field1.mount()

    const field2 = new FieldApi({ form, name: 'names[2]' })
    field2.mount()

    field1.handleBlur()
    field1.setErrorMap({ onSubmit: 'test' })

    expect(field0.state.meta.isBlurred).toBe(false)
    expect(field1.state.meta.isBlurred).toBe(true)
    expect(field2.state.meta.isBlurred).toBe(false)

    expect(field0.state.meta.errors).toStrictEqual([])
    expect(field1.state.meta.errors).toStrictEqual(['test'])
    expect(field2.state.meta.errors).toStrictEqual([])

    form.swapFieldValues('names', 1, 2)

    expect(form.getFieldValue('names')).toStrictEqual(['one', 'three', 'two'])

    expect(field0.state.meta.isBlurred).toBe(false)
    expect(field1.state.meta.isBlurred).toBe(false)
    expect(field2.state.meta.isBlurred).toBe(true)

    expect(field0.state.meta.errors).toStrictEqual([])
    expect(field1.state.meta.errors).toStrictEqual([])
    // field2 doesn't have any error since it has been revalidated after swap (but has no validator)
    expect(field2.state.meta.errors).toStrictEqual([])
  })

  it('should swap meta (nested) when swapping array values', () => {
    const form = new FormApi({
      defaultValues: {
        users: [
          { name: 'test', surname: 'test' },
          { name: 'test2', surname: 'test2' },
        ],
      },
    })
    form.mount()
    new FieldApi({ form, name: 'users' }).mount()

    const field0Name = new FieldApi({ form, name: 'users[0].name' })
    field0Name.mount()

    const field0Surname = new FieldApi({ form, name: 'users[0].surname' })
    field0Surname.mount()

    const field1Name = new FieldApi({ form, name: 'users[1].name' })
    field1Name.mount()

    const field1Surname = new FieldApi({ form, name: 'users[1].surname' })
    field1Surname.mount()

    field0Name.handleBlur()
    expect(field0Name.state.meta.isBlurred).toBe(true)
    expect(field0Surname.state.meta.isBlurred).toBe(false)
    expect(field1Name.state.meta.isBlurred).toBe(false)
    expect(field1Surname.state.meta.isBlurred).toBe(false)

    form.swapFieldValues('users', 0, 1)

    expect(form.getFieldValue('users')).toStrictEqual([
      { name: 'test2', surname: 'test2' },
      { name: 'test', surname: 'test' },
    ])

    expect(field0Name.state.meta.isBlurred).toBe(false)
    expect(field0Surname.state.meta.isBlurred).toBe(false)
    expect(field1Name.state.meta.isBlurred).toBe(true)
    expect(field1Surname.state.meta.isBlurred).toBe(false)
  })

  it("should move an array field's value", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })
    form.mount()
    form.moveFieldValues('names', 1, 2)

    expect(form.getFieldValue('names')).toStrictEqual(['one', 'three', 'two'])
  })

  it("should run onChange validation when moving an array field's value", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test', 'test2'],
      },
      validators: {
        onChange: ({ value }) =>
          value.names.length > 3 ? undefined : 'At least 3 names are required',
      },
    })
    form.mount()
    // Since validation runs through the field, a field must be mounted for that array
    new FieldApi({ form, name: 'names' }).mount()

    expect(form.state.errors).toStrictEqual([])
    form.moveFieldValues('names', 0, 1)

    expect(form.state.errors).toStrictEqual(['At least 3 names are required'])
  })

  it('should run validation on moved fields', () => {
    const form = new FormApi({
      defaultValues: {
        names: ['test', 'test2'],
      },
      validators: {
        onChange: ({ value }) =>
          value.names.length > 3 ? undefined : 'At least 3 names are required',
      },
    })
    form.mount()
    // Since validation runs through the field, a field must be mounted for that array
    new FieldApi({ form, name: 'names' }).mount()

    const field1 = new FieldApi({
      form,
      name: 'names[0]',
      defaultValue: 'test',
      validators: {
        onChange: ({ value }) => value !== 'test' && 'Invalid value',
      },
    })
    field1.mount()
    const field2 = new FieldApi({
      form,
      name: 'names[1]',
      defaultValue: 'test2',
    })
    field2.mount()

    expect(field1.state.meta.errors).toStrictEqual([])
    expect(field2.state.meta.errors).toStrictEqual([])

    form.swapFieldValues('names', 0, 1)

    expect(field1.state.meta.errors).toStrictEqual(['Invalid value'])
    expect(field2.state.meta.errors).toStrictEqual([])
  })

  it('should move meta (nested) when moving array values forward', () => {
    const form = new FormApi({
      defaultValues: {
        users: [
          { name: 'test', surname: 'test' },
          { name: 'test2', surname: 'test2' },
          { name: 'test3', surname: 'test3' },
        ],
      },
    })
    form.mount()
    new FieldApi({ form, name: 'users' }).mount()

    const field0Name = new FieldApi({ form, name: 'users[0].name' })
    field0Name.mount()

    const field0Surname = new FieldApi({ form, name: 'users[0].surname' })
    field0Surname.mount()

    const field1Name = new FieldApi({ form, name: 'users[1].name' })
    field1Name.mount()

    const field1Surname = new FieldApi({ form, name: 'users[1].surname' })
    field1Surname.mount()

    const field2Name = new FieldApi({ form, name: 'users[2].name' })
    field2Name.mount()

    const field2Surname = new FieldApi({ form, name: 'users[2].surname' })
    field2Surname.mount()

    field0Name.handleBlur()
    expect(field0Name.state.meta.isBlurred).toBe(true)
    expect(field0Surname.state.meta.isBlurred).toBe(false)
    expect(field1Name.state.meta.isBlurred).toBe(false)
    expect(field1Surname.state.meta.isBlurred).toBe(false)
    expect(field2Name.state.meta.isBlurred).toBe(false)
    expect(field2Surname.state.meta.isBlurred).toBe(false)

    form.moveFieldValues('users', 0, 2)

    expect(form.getFieldValue('users')).toStrictEqual([
      { name: 'test2', surname: 'test2' },
      { name: 'test3', surname: 'test3' },
      { name: 'test', surname: 'test' },
    ])

    expect(field0Name.state.meta.isBlurred).toBe(false)
    expect(field0Surname.state.meta.isBlurred).toBe(false)
    expect(field1Name.state.meta.isBlurred).toBe(false)
    expect(field1Surname.state.meta.isBlurred).toBe(false)
    expect(field2Name.state.meta.isBlurred).toBe(true)
    expect(field2Surname.state.meta.isBlurred).toBe(false)
  })

  it('should move meta (nested) when moving array values backward', () => {
    const form = new FormApi({
      defaultValues: {
        users: [
          { name: 'test', surname: 'test' },
          { name: 'test2', surname: 'test2' },
          { name: 'test3', surname: 'test3' },
        ],
      },
    })
    form.mount()
    new FieldApi({ form, name: 'users' }).mount()

    const field0Name = new FieldApi({ form, name: 'users[0].name' })
    field0Name.mount()

    const field0Surname = new FieldApi({ form, name: 'users[0].surname' })
    field0Surname.mount()

    const field1Name = new FieldApi({ form, name: 'users[1].name' })
    field1Name.mount()

    const field1Surname = new FieldApi({ form, name: 'users[1].surname' })
    field1Surname.mount()

    const field2Name = new FieldApi({ form, name: 'users[2].name' })
    field2Name.mount()

    const field2Surname = new FieldApi({ form, name: 'users[2].surname' })
    field2Surname.mount()

    field1Name.handleBlur()
    field2Name.handleBlur()

    expect(field0Name.state.meta.isBlurred).toBe(false)
    expect(field0Surname.state.meta.isBlurred).toBe(false)
    expect(field1Name.state.meta.isBlurred).toBe(true)
    expect(field1Surname.state.meta.isBlurred).toBe(false)
    expect(field2Name.state.meta.isBlurred).toBe(true)
    expect(field2Surname.state.meta.isBlurred).toBe(false)

    form.moveFieldValues('users', 2, 0)

    expect(form.getFieldValue('users')).toStrictEqual([
      { name: 'test3', surname: 'test3' },
      { name: 'test', surname: 'test' },
      { name: 'test2', surname: 'test2' },
    ])

    expect(field0Name.state.meta.isBlurred).toBe(true)
    expect(field0Surname.state.meta.isBlurred).toBe(false)
    expect(field1Name.state.meta.isBlurred).toBe(false)
    expect(field1Surname.state.meta.isBlurred).toBe(false)
    expect(field2Name.state.meta.isBlurred).toBe(true)
    expect(field2Surname.state.meta.isBlurred).toBe(false)
  })

  it('should handle fields inside an array', async () => {
    interface Employee {
      firstName: string
    }
    interface Form {
      employees: Partial<Employee>[]
    }

    const form = new FormApi({
      defaultValues: {} as Form,
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'employees',
      defaultValue: [],
    })

    field.mount()

    const fieldInArray = new FieldApi({
      form,
      name: `employees[0].firstName`,
      defaultValue: 'Darcy',
    })
    fieldInArray.mount()
    expect(field.state.value.length).toBe(1)
    expect(fieldInArray.getValue()).toBe('Darcy')
  })

  it('should handle deleting fields in an array', async () => {
    interface Employee {
      firstName: string
    }
    interface Form {
      employees: Partial<Employee>[]
    }

    const form = new FormApi({
      defaultValues: {} as Form,
    })
    form.mount()
    const field = new FieldApi({
      form,
      name: 'employees',
      defaultValue: [],
    })

    field.mount()

    const fieldInArray = new FieldApi({
      form,
      name: `employees[0].firstName`,
      defaultValue: 'Darcy',
    })
    fieldInArray.mount()
    form.deleteField(`employees[0].firstName`)
    expect(field.state.value.length).toBe(1)
    expect(Object.keys(field.state.value[0]!).length).toBe(0)
  })

  it('should not wipe values when updating', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })
    form.mount()
    form.setFieldValue('name', 'other')

    expect(form.getFieldValue('name')).toEqual('other')

    form.update()

    expect(form.getFieldValue('name')).toEqual('other')
  })

  it('should wipe default values when not touched', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })
    form.mount()
    expect(form.getFieldValue('name')).toEqual('test')

    form.update({
      defaultValues: {
        name: 'other',
      },
    })

    expect(form.getFieldValue('name')).toEqual('other')
  })

  it('should not wipe default values when touched', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'one',
      },
    })
    form.mount()
    expect(form.getFieldValue('name')).toEqual('one')

    form.setFieldValue('name', 'two')

    form.update({
      defaultValues: {
        name: 'three',
      },
    })

    expect(form.getFieldValue('name')).toEqual('two')
  })

  it('should delete field from the form', () => {
    const form = new FormApi({
      defaultValues: {
        names: 'kittu',
        age: 4,
      },
    })
    form.mount()
    form.deleteField('names')

    expect(form.getFieldValue('age')).toStrictEqual(4)
    expect(form.getFieldValue('names')).toStrictEqual(undefined)
    expect(form.getFieldMeta('names')).toStrictEqual(undefined)
  })

  it("form's valid state should be work fine", () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onChange: ({ value }) => (value.length > 0 ? undefined : 'required'),
      },
    })

    form.mount()

    field.mount()

    field.handleChange('one')

    expect(form.state.isFieldsValid).toEqual(true)
    expect(form.state.canSubmit).toEqual(true)

    field.handleChange('')

    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)

    field.handleChange('two')

    expect(form.state.isFieldsValid).toEqual(true)
    expect(form.state.canSubmit).toEqual(true)
  })

  it('should run validation onChange', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
      validators: {
        onChange: ({ value }) => {
          if (value.name === 'other') return 'Please enter a different value'
          return
        },
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
    })
    form.mount()
    field.mount()

    expect(form.state.errors.length).toBe(0)
    field.setValue('other')
    expect(form.state.errors).toContain('Please enter a different value')
    expect(form.state.errorMap).toMatchObject({
      onChange: 'Please enter a different value',
    })
  })

  it('should run async validation onChange', async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
      validators: {
        onChangeAsync: async ({ value }) => {
          await sleep(1000)
          if (value.name === 'other') return 'Please enter a different value'
          return
        },
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })
    form.mount()

    field.mount()

    expect(form.state.errors.length).toBe(0)
    field.setValue('other')
    await vi.runAllTimersAsync()
    expect(form.state.errors).toContain('Please enter a different value')
    expect(form.state.errorMap).toMatchObject({
      onChange: 'Please enter a different value',
    })
  })

  it('should run async validation onChange with debounce', async () => {
    vi.useFakeTimers()
    const sleepMock = vi.fn().mockImplementation(sleep)

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
      validators: {
        onChangeAsyncDebounceMs: 1000,
        onChangeAsync: async ({ value }) => {
          await sleepMock(1000)
          if (value.name === 'other') return 'Please enter a different value'
          return
        },
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })
    form.mount()

    field.mount()

    expect(form.state.errors.length).toBe(0)
    field.setValue('other')
    field.setValue('other', {
      dontUpdateMeta: true,
    })
    await vi.runAllTimersAsync()
    // sleepMock will have been called 2 times without onChangeAsyncDebounceMs
    expect(sleepMock).toHaveBeenCalledTimes(1)
    expect(form.state.errors).toContain('Please enter a different value')
    expect(form.state.errorMap).toMatchObject({
      onChange: 'Please enter a different value',
    })
  })

  it('should run async validation onChange with asyncDebounceMs', async () => {
    vi.useFakeTimers()
    const sleepMock = vi.fn().mockImplementation(sleep)

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
      asyncDebounceMs: 1000,
      validators: {
        onChangeAsync: async ({ value }) => {
          await sleepMock(1000)
          if (value.name === 'other') return 'Please enter a different value'
          return
        },
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    expect(form.state.errors.length).toBe(0)
    field.setValue('other')
    field.setValue('other', {
      dontUpdateMeta: true,
    })
    await vi.runAllTimersAsync()
    // sleepMock will have been called 2 times without asyncDebounceMs
    expect(sleepMock).toHaveBeenCalledTimes(1)
    expect(form.state.errors).toContain('Please enter a different value')
    expect(form.state.errorMap).toMatchObject({
      onChange: 'Please enter a different value',
    })
  })

  it('should run validation onBlur', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'other',
      },
      validators: {
        onBlur: ({ value }) => {
          if (value.name === 'other') return 'Please enter a different value'
          return
        },
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    field.setValue('other')
    field.validate('blur')
    expect(form.state.errors).toContain('Please enter a different value')
    expect(form.state.errorMap).toMatchObject({
      onBlur: 'Please enter a different value',
    })
  })

  it('should run async validation onBlur', async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
      validators: {
        onBlurAsync: async ({ value }) => {
          await sleep(1000)
          if (value.name === 'other') return 'Please enter a different value'
          return
        },
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()
    expect(form.state.errors.length).toBe(0)
    field.setValue('other')
    field.validate('blur')
    await vi.runAllTimersAsync()
    expect(form.state.errors).toContain('Please enter a different value')
    expect(form.state.errorMap).toMatchObject({
      onBlur: 'Please enter a different value',
    })
  })

  it('should run async validation onBlur with debounce', async () => {
    vi.useFakeTimers()
    const sleepMock = vi.fn().mockImplementation(sleep)

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
      validators: {
        onBlurAsyncDebounceMs: 1000,
        onBlurAsync: async ({ value }) => {
          await sleepMock(10)
          if (value.name === 'other') return 'Please enter a different value'
          return
        },
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    expect(form.state.errors.length).toBe(0)
    field.setValue('other')
    field.validate('blur')
    field.validate('blur')
    await vi.runAllTimersAsync()
    // sleepMock will have been called 2 times without onBlurAsyncDebounceMs
    expect(sleepMock).toHaveBeenCalledTimes(1)
    expect(form.state.errors).toContain('Please enter a different value')
    expect(form.state.errorMap).toMatchObject({
      onBlur: 'Please enter a different value',
    })
  })

  it('should run async validation onBlur with asyncDebounceMs', async () => {
    vi.useFakeTimers()
    const sleepMock = vi.fn().mockImplementation(sleep)

    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
      asyncDebounceMs: 1000,
      validators: {
        onBlurAsync: async ({ value }) => {
          await sleepMock(10)
          if (value.name === 'other') return 'Please enter a different value'
          return
        },
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    expect(form.state.errors.length).toBe(0)
    field.setValue('other')
    field.validate('blur')
    field.validate('blur')
    await vi.runAllTimersAsync()
    // sleepMock will have been called 2 times without asyncDebounceMs
    expect(sleepMock).toHaveBeenCalledTimes(1)
    expect(form.state.errors).toContain('Please enter a different value')
    expect(form.state.errorMap).toMatchObject({
      onBlur: 'Please enter a different value',
    })
  })

  it('should contain multiple errors when running validation onBlur and onChange', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'other',
      },
      validators: {
        onBlur: ({ value }) => {
          if (value.name === 'other') return 'Please enter a different value'
          return
        },
        onChange: ({ value }) => {
          if (value.name === 'other') return 'Please enter a different value'
          return
        },
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    field.setValue('other')
    field.validate('blur')
    expect(form.state.errors).toStrictEqual([
      'Please enter a different value',
      'Please enter a different value',
    ])
    expect(form.state.errorMap).toEqual({
      onBlur: 'Please enter a different value',
      onChange: 'Please enter a different value',
    })
  })

  it('should return all errors', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'other',
        age: 'hi',
      },
      validators: {
        onChange: ({ value }) => {
          if (value.name === 'other') return 'onChange - form'
          return
        },
        onMount: ({ value }) => {
          if (value.name === 'other') return 'onMount - form'
          return
        },
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onChange: ({ value }) => {
          if (value === 'other') {
            return 'onChange - field'
          }
          return
        },
      },
    })

    form.mount()
    field.mount()
    expect(form.getAllErrors()).toEqual({
      fields: {},
      form: {
        errors: ['onMount - form'],
        errorMap: { onMount: 'onMount - form' },
      },
    })

    field.setValue('other')
    expect(form.getAllErrors()).toEqual({
      fields: {
        name: {
          errors: ['onChange - field'],
          errorMap: { onChange: 'onChange - field' },
        },
      },
      form: {
        errors: ['onChange - form'],
        errorMap: { onChange: 'onChange - form' },
      },
    })
  })

  it('should reset onChange errors when the issue is resolved', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'other',
      },
      validators: {
        onChange: ({ value }) => {
          if (value.name === 'other') return 'Please enter a different value'
          return
        },
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    field.setValue('other')
    expect(form.state.errors).toStrictEqual(['Please enter a different value'])
    expect(form.state.errorMap).toEqual({
      onChange: 'Please enter a different value',
    })
    field.setValue('test')
    expect(form.state.errors).toStrictEqual([])
    expect(form.state.errorMap).toEqual({})
  })

  it('should return error onMount', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'other',
      },
      validators: {
        onMount: ({ value }) => {
          if (value.name === 'other') return 'Please enter a different value'
          return
        },
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    expect(form.state.errors).toStrictEqual(['Please enter a different value'])
    expect(form.state.errorMap).toEqual({
      onMount: 'Please enter a different value',
    })
  })

  it('should remove onMount error when the form is touched', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'other',
      },
      validators: {
        onMount: ({ value }) => {
          if (value.name === 'other') return 'Please enter a different value'
          return
        },
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    expect(form.state.errors).toStrictEqual(['Please enter a different value'])
    expect(form.state.errorMap).toEqual({
      onMount: 'Please enter a different value',
    })

    form.setFieldValue('name', 'test')
    expect(form.state.errors).toStrictEqual([])
  })

  it('should validate fields during submit', async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
        lastName: '',
      },
    })
    form.mount()

    const field = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onChange: ({ value }) =>
          value.length > 0 ? undefined : 'first name is required',
      },
    })

    const lastNameField = new FieldApi({
      form,
      name: 'lastName',
      validators: {
        onChange: ({ value }) =>
          value.length > 0 ? undefined : 'last name is required',
      },
    })

    field.mount()
    lastNameField.mount()

    await form.handleSubmit()
    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(form.state.fieldMeta['firstName'].errors).toEqual([
      'first name is required',
    ])
    expect(form.state.fieldMeta['lastName'].errors).toEqual([
      'last name is required',
    ])
  })

  it('should validate optional object fields during submit', async () => {
    const form = new FormApi({
      defaultValues: {
        person: null,
      } as { person: { firstName: string; lastName: string } | null },
    })
    form.mount()
    const field = new FieldApi({
      form,
      name: 'person.firstName',
      validators: {
        onChange: ({ value }) =>
          value && value.length > 0 ? undefined : 'first name is required',
      },
    })

    const lastNameField = new FieldApi({
      form,
      name: 'person.lastName',
      validators: {
        onChange: ({ value }) =>
          value && value.length > 0 ? undefined : 'last name is required',
      },
    })

    field.mount()
    lastNameField.mount()

    await form.handleSubmit()
    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(form.state.fieldMeta['person.firstName'].errors).toEqual([
      'first name is required',
    ])
    expect(form.state.fieldMeta['person.lastName'].errors).toEqual([
      'last name is required',
    ])
  })

  it('should run all types of validation on fields during submit', async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
        lastName: '',
      },
    })
    form.mount()
    const field = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onChange: ({ value }) =>
          value.length > 0 ? undefined : 'first name is required',
        onBlur: ({ value }) =>
          value.length > 3
            ? undefined
            : 'first name must be longer than 3 characters',
      },
    })

    field.mount()

    await form.handleSubmit()
    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(form.state.fieldMeta['firstName'].errors).toEqual([
      'first name is required',
      'first name must be longer than 3 characters',
    ])
  })

  it('should run form submit validation once during submit, not once per field', async () => {
    const formSubmit = vi.fn().mockReturnValue(false)

    const form = new FormApi({
      defaultValues: {
        firstName: '',
        lastName: '',
        age: 0,
      },
      validators: {
        onSubmit: formSubmit,
      },
    })
    form.mount()

    new FieldApi({ form, name: 'firstName' }).mount()
    new FieldApi({ form, name: 'lastName' }).mount()
    new FieldApi({ form, name: 'age' }).mount()

    await form.handleSubmit()

    expect(formSubmit).toHaveBeenCalledOnce()
  })

  it('should run form async submit validation once during submit', async () => {
    vi.useFakeTimers()
    const formSubmit = vi.fn()
    const fieldChangeValidator = vi
      .fn()
      .mockImplementation(async ({ value }) => {
        await sleep(1000)
        return value.length > 0 ? undefined : 'first name is required'
      })

    const form = new FormApi({
      defaultValues: {
        firstName: '',
        lastName: '',
      },
      validators: {
        onSubmitAsync: formSubmit,
      },
    })
    form.mount()
    const field = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onChangeAsync: fieldChangeValidator,
      },
    })

    field.mount()
    field.handleChange('test')

    await vi.runAllTimersAsync()
    expect(fieldChangeValidator).toHaveBeenCalledOnce()

    form.handleSubmit()
    await vi.runAllTimersAsync()

    expect(form.state.isFieldsValid).toEqual(true)
    expect(form.state.isValid).toEqual(true)
    expect(form.state.canSubmit).toEqual(true)

    expect(fieldChangeValidator).toHaveBeenCalledTimes(2)
    expect(formSubmit).toHaveBeenCalledOnce()
  })

  it('should run all types of async validation on fields during submit', async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        firstName: '',
        lastName: '',
      },
    })
    form.mount()
    const field = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onChangeAsync: async ({ value }) => {
          await sleep(1000)
          return value.length > 0 ? undefined : 'first name is required'
        },
        onBlurAsync: async ({ value }) => {
          await sleep(1000)
          return value.length > 3
            ? undefined
            : 'first name must be longer than 3 characters'
        },
      },
    })

    field.mount()

    form.handleSubmit()
    expect(form.state.isFieldsValid).toEqual(true)
    await vi.runAllTimersAsync()
    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(form.state.fieldMeta['firstName'].errorMap).toEqual({
      onChange: 'first name is required',
      onBlur: 'first name must be longer than 3 characters',
    })
  })

  it('should clear onSubmit error when a valid value is entered', async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
    })
    form.mount()
    const field = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onSubmit: ({ value }) =>
          value.length > 0 ? undefined : 'first name is required',
      },
    })

    field.mount()

    await form.handleSubmit()
    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(form.state.fieldMeta['firstName'].errorMap['onSubmit']).toEqual(
      'first name is required',
    )
    field.handleChange('test')
    expect(form.state.isFieldsValid).toEqual(true)
    expect(form.state.canSubmit).toEqual(true)
    expect(
      form.state.fieldMeta['firstName'].errorMap['onSubmit'],
    ).toBeUndefined()
  })

  it('should validate all fields consistently', async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
        lastName: '',
      },
    })

    const field = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onChange: ({ value }) =>
          value.length > 0 ? undefined : 'first name is required',
      },
    })

    form.mount()
    field.mount()

    await form.validateAllFields('change')
    expect(field.getMeta().errorMap.onChange).toEqual('first name is required')
    await form.validateAllFields('change')
    expect(field.getMeta().errorMap.onChange).toEqual('first name is required')
  })

  it('should validate a single field consistently if touched', async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
        lastName: '',
      },
    })

    const field = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onChange: ({ value }) =>
          value.length > 0 ? undefined : 'first name is required',
      },
      defaultMeta: {
        isTouched: true,
      },
    })

    form.mount()
    field.mount()

    await form.validateField('firstName', 'change')
    expect(field.getMeta().errorMap.onChange).toEqual('first name is required')
    await form.validateField('firstName', 'change')
    expect(field.getMeta().errorMap.onChange).toEqual('first name is required')
  })

  it('should show onSubmit errors', async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
      validators: {
        onSubmit: ({ value }) =>
          value.firstName.length > 0 ? undefined : 'first name is required',
      },
    })

    form.mount()

    const field = new FieldApi({
      form,
      name: 'firstName',
    })

    field.mount()

    await form.handleSubmit()
    expect(form.state.errors).toStrictEqual(['first name is required'])
  })

  it('should run onChange validation during submit', async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
      validators: {
        onChange: ({ value }) =>
          value.firstName.length > 0 ? undefined : 'first name is required',
      },
    })
    form.mount()
    const field = new FieldApi({
      form,
      name: 'firstName',
    })

    field.mount()

    await form.handleSubmit()
    expect(form.state.errors).toStrictEqual(['first name is required'])
  })

  it('should run listener onSubmit', async () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    let triggered!: string
    const field = new FieldApi({
      form,
      name: 'name',
      listeners: {
        onSubmit: ({ value }) => {
          triggered = value
        },
      },
    })

    field.mount()
    await form.handleSubmit()

    expect(triggered).toStrictEqual('test')
  })

  it('should update a nullable object', async () => {
    const form = new FormApi({
      defaultValues: {
        person: null,
      } as { person: { firstName: string } | null },
    })
    form.mount()
    const field = new FieldApi({
      form,
      name: 'person.firstName',
    })

    field.mount()

    field.setValue('firstName', {
      dontUpdateMeta: true,
    })
    expect(form.state.values.person?.firstName).toStrictEqual('firstName')
  })

  it('should update a deep nullable object', async () => {
    const form = new FormApi({
      defaultValues: {
        person: null,
      } as { person: { nameInfo: { first: string } | null } | null },
    })
    form.mount()
    const field = new FieldApi({
      form,
      name: 'person.nameInfo.first',
    })

    field.mount()

    field.setValue('firstName', {
      dontUpdateMeta: true,
    })
    expect(form.state.values.person?.nameInfo?.first).toStrictEqual('firstName')
  })

  it('should update a nullable array', async () => {
    const form = new FormApi({
      defaultValues: {
        persons: null,
      } as { persons: Array<{ nameInfo: { first: string } }> | null },
    })
    form.mount()
    const field = new FieldApi({
      form,
      name: 'persons',
    })

    field.mount()

    field.pushValue({ nameInfo: { first: 'firstName' } })
    expect(form.state.values.persons).toStrictEqual([
      { nameInfo: { first: 'firstName' } },
    ])
  })

  it('should add a new value to the formApi errorMap', () => {
    interface Form {
      name: string
    }
    const form = new FormApi({ defaultValues: {} as Form })
    form.mount()
    form.setErrorMap({
      onChange: "name can't be Josh",
    } as never)
    expect(form.state.errorMap.onChange).toEqual("name can't be Josh")
  })

  it('should preserve other values in the formApi errorMap when adding other values', () => {
    interface Form {
      name: string
    }
    const form = new FormApi({ defaultValues: {} as Form })
    form.mount()
    form.setErrorMap({
      onChange: "name can't be Josh",
    } as never)
    expect(form.state.errorMap.onChange).toEqual("name can't be Josh")
    form.setErrorMap({
      onBlur: 'name must begin with uppercase',
    } as never)
    expect(form.state.errorMap.onChange).toEqual("name can't be Josh")
    expect(form.state.errorMap.onBlur).toEqual('name must begin with uppercase')
  })

  it('should replace errorMap value if it exists in the FormApi object', () => {
    interface Form {
      name: string
    }
    const form = new FormApi({ defaultValues: {} as Form })
    form.mount()
    form.setErrorMap({
      onChange: "name can't be Josh",
    } as never)
    expect(form.state.errorMap.onChange).toEqual("name can't be Josh")
    form.setErrorMap({
      onChange: 'other validation error',
    } as never)
    expect(form.state.errorMap.onChange).toEqual('other validation error')
  })

  it("should set errors for the fields from the form's onSubmit validator", async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
      validators: {
        onSubmit: ({ value }) => {
          if (value.firstName.length === 0) {
            return {
              form: 'something went wrong',
              fields: {
                firstName: 'first name is required',
              },
            }
          }

          return null
        },
      },
    })

    form.mount()

    const firstNameField = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onSubmit: ({ value }) => {
          if (value === 'nothing') return 'value cannot be "nothing"'
          return null
        },
      },
    })

    firstNameField.mount()

    // Check if the error is returned from the form's onSubmit validator
    await form.handleSubmit()
    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(firstNameField.state.meta.errorMap.onSubmit).toBe(
      'first name is required',
    )
    expect(form.state.errorMap.onSubmit).toBe('something went wrong')

    // Check if the error is gone after the value is changed
    firstNameField.setValue('nothing')
    // Handling the blur is needed, because the `blur` error on the field
    // is not cleared up before `handleSubmit` is called, so the field
    // is considered to be invalid.
    firstNameField.handleBlur()
    await form.handleSubmit()

    expect(firstNameField.state.meta.errorMap.onSubmit).toBe(
      'value cannot be "nothing"',
    )

    // Check if the error from the field's validator is shown
    firstNameField.setValue('something else')
    await form.handleSubmit()
    expect(firstNameField.state.meta.errorMap.onSubmit).toBe(undefined)
    expect(form.state.errors).toStrictEqual([])
  })

  it('should run validators in order form sync -> field sync -> form async -> field async', async () => {
    const order: string[] = []
    const formAsyncChange = vi.fn().mockImplementation(async () => {
      order.push('formAsyncChange')
      await sleep(1000)
    })
    const formSyncChange = vi.fn().mockImplementation(() => {
      order.push('formSyncChange')
    })
    const fieldAsyncChange = vi.fn().mockImplementation(async () => {
      order.push('fieldAsyncChange')
      await sleep(1000)
    })
    const fieldSyncChange = vi.fn().mockImplementation(() => {
      order.push('fieldSyncChange')
    })

    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
      validators: {
        onChange: formSyncChange,
        onChangeAsync: formAsyncChange,
      },
    })

    const firstNameField = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onChange: fieldSyncChange,
        onChangeAsync: fieldAsyncChange,
      },
    })

    form.mount()
    firstNameField.mount()

    firstNameField.handleChange('something')
    await vi.runAllTimersAsync()

    expect(order).toStrictEqual([
      'formSyncChange',
      'fieldSyncChange',
      'formAsyncChange',
      'fieldAsyncChange',
    ])
  })

  it('should not run form async validator if field sync has errored', async () => {
    const formAsyncChange = vi.fn()
    const formSyncChange = vi.fn()

    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
      validators: {
        onChange: formSyncChange,
        onChangeAsync: formAsyncChange,
      },
    })

    const firstNameField = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onChange: ({ value }) => (value.length > 0 ? undefined : 'field error'),
      },
    })

    form.mount()
    firstNameField.mount()

    firstNameField.handleChange('')
    await vi.runAllTimersAsync()

    expect(formSyncChange).toHaveBeenCalled()
    expect(firstNameField.state.meta.errorMap.onChange).toBe('field error')
    expect(formAsyncChange).not.toHaveBeenCalled()
  })

  it('runs form async validator if field sync has errored and asyncAlways is true', async () => {
    const formAsyncChange = vi.fn()
    const formSyncChange = vi.fn()

    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
      validators: {
        onChange: formSyncChange,
        onChangeAsync: formAsyncChange,
      },
    })

    const firstNameField = new FieldApi({
      form,
      name: 'firstName',
      asyncAlways: true,
      validators: {
        onChange: ({ value }) => (value.length > 0 ? undefined : 'field error'),
      },
    })

    form.mount()
    firstNameField.mount()

    firstNameField.handleChange('')
    await vi.runAllTimersAsync()

    expect(formSyncChange).toHaveBeenCalled()
    expect(firstNameField.state.meta.errorMap.onChange).toBe('field error')
    expect(formAsyncChange).toHaveBeenCalled()
  })

  it("should set errors for the fields from the form's onChange validator", async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: 'something',
      },
      validators: {
        onChange: ({ value }) => {
          if (value.firstName.length === 0) {
            return {
              fields: {
                firstName: 'first name is required',
              },
            }
          }

          return null
        },
      },
    })
    form.mount()
    const firstNameField = new FieldApi({
      form,
      name: 'firstName',
      validators: {
        onChange: ({ value }) => {
          if (value === 'nothing') return 'value cannot be "nothing"'

          return null
        },
      },
    })

    firstNameField.mount()

    // Check if we get an error from the form's `onChange` validator
    firstNameField.setValue('')

    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(firstNameField.state.meta.errorMap.onChange).toBe(
      'first name is required',
    )

    // Check if we can make the error go away by changing the value
    firstNameField.setValue('one')
    expect(firstNameField.state.meta.errorMap.onChange).toBe(undefined)

    // Check if we get an error from the field's `onChange` validator
    firstNameField.setValue('nothing')

    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(firstNameField.state.meta.errorMap.onChange).toBe(
      'value cannot be "nothing"',
    )

    // Check if we can make the error go away by changing the value
    firstNameField.setValue('one')
    expect(firstNameField.state.meta.errorMap.onChange).toBe(undefined)
  })

  it("should remove the onSubmit errors set from the form's validators after the field has been touched", async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
      validators: {
        onSubmit: ({ value }) => {
          if (value.firstName.length === 0) {
            return {
              form: 'something went wrong',
              fields: {
                firstName: 'first name is required',
              },
            }
          }

          return null
        },
      },
    })
    form.mount()
    const firstNameField = new FieldApi({
      form,
      name: 'firstName',
    })

    firstNameField.mount()

    await form.handleSubmit()

    expect(firstNameField.state.meta.errorMap.onSubmit).toEqual(
      'first name is required',
    )

    firstNameField.setValue('this is a first name')

    expect(firstNameField.state.meta.errorMap.onSubmit).toBe(undefined)
  })

  it("should set errors for the fields from the form's onSubmit validator for array fields", async () => {
    const form = new FormApi({
      defaultValues: {
        names: ['person'],
      },
      validators: {
        onSubmit: ({ value }) => {
          return value.names.includes('person-2')
            ? {
                fields: {
                  names: 'person-2 cannot be used',
                },
              }
            : undefined
        },
      },
    })

    form.mount()

    const namesField = new FieldApi({ form, name: 'names' })
    namesField.mount()

    namesField.setValue((value) => [...value, 'person-2'])

    await form.handleSubmit()

    expect(namesField.state.meta.errorMap.onSubmit).toBe(
      'person-2 cannot be used',
    )
  })

  it("should set errors for the fields from the form's onSubmitAsync validator for array fields", async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        names: ['test'],
      },
      asyncDebounceMs: 1,
      validators: {
        onSubmitAsync: async ({ value }) => {
          await sleep(1)
          if (value.names.includes('other')) {
            return { fields: { names: 'Please enter a different value' } }
          }
          return
        },
      },
    })
    form.mount()
    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.mount()
    field.pushValue('other')

    expect(field.state.meta.errors.length).toBe(0)

    form.handleSubmit()
    await vi.runAllTimersAsync()

    expect(field.state.meta.errorMap.onSubmit).toBe(
      'Please enter a different value',
    )

    field.removeValue(1)
    form.handleSubmit()
    await vi.runAllTimersAsync()

    expect(field.state.value).toStrictEqual(['test'])
    expect(field.state.meta.errors.length).toBe(0)
    expect(field.state.meta.errorMap.onSubmit).toBe(undefined)
  })

  it("should be able to set errors on nested field inside of an array from the form's validators", async () => {
    interface Employee {
      firstName: string
    }
    interface Form {
      employees: Partial<Employee>[]
    }

    const form = new FormApi({
      validators: {
        onSubmit: ({ value }) => {
          const fieldWithErrorIndex = value.employees.findIndex(
            (val) => val.firstName === 'person-2',
          )

          if (fieldWithErrorIndex !== -1) {
            return {
              fields: {
                [`employees[${fieldWithErrorIndex}].firstName`]:
                  'person-2 is banned from registering',
              },
            }
          }
          return null
        },
      },
      defaultValues: {} as Form,
    })
    form.mount()
    const field = new FieldApi({
      form,
      name: 'employees',
      defaultValue: [],
    })

    field.mount()

    const fieldInArray = new FieldApi({
      form,
      name: `employees[0].firstName`,
      defaultValue: 'person-2',
    })

    fieldInArray.mount()
    await form.handleSubmit()

    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(fieldInArray.state.meta.errorMap.onSubmit).toBe(
      'person-2 is banned from registering',
    )

    fieldInArray.setValue('Somebody else')

    await form.handleSubmit()
    expect(form.state.isFieldsValid).toEqual(true)
    expect(form.state.canSubmit).toEqual(true)
    expect(fieldInArray.state.meta.errors.length).toBe(0)

    await form.handleSubmit()
  })

  it("should set errors on a linked field from the form's onChange validator", async () => {
    const form = new FormApi({
      defaultValues: {
        password: '',
        confirm_password: '',
      },
      validators: {
        onChange: ({ value }) => {
          if (value.confirm_password !== value.password) {
            return {
              fields: {
                confirm_password: 'passwords do not match',
              },
            }
          }
          return null
        },
      },
    })
    form.mount()
    const passField = new FieldApi({
      form,
      name: 'password',
    })

    const passconfirmField = new FieldApi({
      form,
      name: 'confirm_password',
      validators: {
        onChangeListenTo: ['password'],
      },
    })

    passField.mount()
    passconfirmField.mount()

    passField.setValue('one')

    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(passconfirmField.state.meta.errorMap.onChange).toBe(
      'passwords do not match',
    )

    passconfirmField.setValue('one')
    expect(form.state.isFieldsValid).toEqual(true)
    expect(form.state.canSubmit).toEqual(true)
    expect(passconfirmField.state.meta.errors.length).toBe(0)
  })

  it("should set errors on a linked field from the form's onChangeAsync validator", async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        password: '',
        confirm_password: '',
      },
      validators: {
        onChangeAsync: async ({ value }) => {
          if (value.confirm_password !== value.password) {
            return {
              fields: {
                confirm_password: 'passwords do not match',
              },
            }
          }
          return null
        },
      },
    })
    form.mount()
    const passField = new FieldApi({
      form,
      name: 'password',
    })

    const passconfirmField = new FieldApi({
      form,
      name: 'confirm_password',
      validators: {
        onChangeListenTo: ['password'],
      },
    })

    passField.mount()
    passconfirmField.mount()

    passField.setValue('one')

    await vi.runAllTimersAsync()

    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(passconfirmField.state.meta.errorMap.onChange).toBe(
      'passwords do not match',
    )

    passconfirmField.setValue('one')

    await vi.runAllTimersAsync()

    expect(form.state.isFieldsValid).toBe(true)
    expect(form.state.canSubmit).toBe(true)
    expect(passconfirmField.state.meta.errors.length).toBe(0)
  })

  it("should set field errors from the form's onMount validator", async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
      validators: {
        onMount: () => {
          return {
            form: 'something went wrong',
            fields: {
              firstName: 'first name is required',
            },
          }
        },
      },
    })

    const firstNameField = new FieldApi({
      form,
      name: 'firstName',
    })

    firstNameField.mount()
    form.mount()

    expect(form.state.errorMap.onMount).toBe('something went wrong')
    expect(firstNameField.state.meta.errorMap.onMount).toBe(
      'first name is required',
    )
  })

  it('clears errors on all fields affected by form validation when condition resolves', () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
        lastName: '',
      },
      validators: {
        onChange: ({ value }) => {
          if (value.firstName && value.lastName) {
            return {
              fields: {
                firstName: 'Do not enter both firstName and lastName',
                lastName: 'Do not enter both firstName and lastName',
              },
            }
          }
          return null
        },
      },
    })
    form.mount()

    const firstNameField = new FieldApi({
      form,
      name: 'firstName',
    })
    firstNameField.mount()

    const lastNameField = new FieldApi({
      form,
      name: 'lastName',
    })
    lastNameField.mount()

    // Set values to trigger validation errors
    firstNameField.setValue('John')
    lastNameField.setValue('Doe')

    // Verify both fields have errors
    expect(firstNameField.state.meta.errors).toContain(
      'Do not enter both firstName and lastName',
    )
    expect(lastNameField.state.meta.errors).toContain(
      'Do not enter both firstName and lastName',
    )

    // Clear one field's value
    firstNameField.setValue('')

    // Verify both fields have their errors cleared
    expect(firstNameField.state.meta.errors).toStrictEqual([])
    expect(lastNameField.state.meta.errors).toStrictEqual([])

    // Verify previous error map still contains values for the fields as it should indicate the last error map processed for the fields
    const cumulativeFieldsErrorMap = form.cumulativeFieldsErrorMap
    expect(cumulativeFieldsErrorMap.firstName).toBeDefined()
    expect(cumulativeFieldsErrorMap.lastName).toBeDefined()
    expect(cumulativeFieldsErrorMap.firstName?.onChange).toBeUndefined()
    expect(cumulativeFieldsErrorMap.lastName?.onChange).toBeUndefined()
  })

  it('clears previous form level errors for subfields when they are no longer valid', () => {
    const form = new FormApi({
      defaultValues: {
        interests: [
          { interestName: 'Interest 1' },
          { interestName: 'Interest 2' },
        ],
      },
      validators: {
        onChange: ({ value }) => {
          const interestNames = value.interests.map(
            (interest) => interest.interestName,
          )
          const uniqueInterestNames = new Set(interestNames)

          if (uniqueInterestNames.size !== interestNames.length) {
            return {
              fields: {
                interests: 'No duplicate interests allowed',
              },
            }
          }

          return null
        },
      },
    })
    form.mount()

    const interestsField = new FieldApi({
      form,
      name: 'interests',
    })
    interestsField.mount()

    const field0 = new FieldApi({
      form,
      name: 'interests[0].interestName',
    })
    field0.mount()

    const field1 = new FieldApi({
      form,
      name: 'interests[1].interestName',
    })
    field1.mount()

    // When creating a duplicate interest via form level validator
    field1.setValue('Interest 1')
    expect(interestsField.state.meta.errors).toStrictEqual([
      'No duplicate interests allowed',
    ])

    // When fixing the duplicate interest via form level validator
    field1.setValue('Interest 2')
    expect(interestsField.state.meta.errors).toStrictEqual([])
  })
})

it('should not change the onBlur state of the fields when the form is submitted', async () => {
  const form = new FormApi({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  })

  const firstNameField = new FieldApi({
    form,
    name: 'firstName',
  })
  firstNameField.mount()

  const lastNameField = new FieldApi({
    form,
    name: 'lastName',
  })
  lastNameField.mount()

  firstNameField.handleBlur()

  expect(firstNameField.state.meta.isBlurred).toBe(true)

  await form.handleSubmit()

  expect(firstNameField.state.meta.isBlurred).toBe(true)
  expect(lastNameField.state.meta.isBlurred).toBe(false)
})

it('should pass the handleSubmit meta data to onSubmit', async () => {
  const form = new FormApi({
    onSubmitMeta: {} as { dinosaur: string },
    onSubmit: async ({ meta }) => {
      expect(meta.dinosaur).toEqual('Stegosaurus')
    },
  })

  await form.handleSubmit({ dinosaur: 'Stegosaurus' })
})

it('should pass the handleSubmit default meta data to onSubmit', async () => {
  const form = new FormApi({
    onSubmitMeta: { dinosaur: 'Frank' } as { dinosaur: string },
    onSubmit: async ({ meta }) => {
      expect(meta.dinosaur).toEqual('Frank')
    },
  })

  await form.handleSubmit()
})

it('should read and update union objects', async () => {
  const form = new FormApi({
    defaultValues: {
      person: { firstName: 'firstName' },
    } as { person?: { firstName: string } | { age: number } | null },
  })

  const field = new FieldApi({
    form,
    name: 'person.firstName',
  })
  field.mount()
  expect(field.getValue()).toStrictEqual('firstName')

  form.setFieldValue('person', { age: 0 })

  const field2 = new FieldApi({
    form,
    name: 'person.age',
  })
  field2.mount()
  expect(field2.getValue()).toStrictEqual(0)
})

it('should update isSubmitSuccessful correctly during form submission', async () => {
  const onSubmit = vi.fn().mockResolvedValue(undefined)
  const form = new FormApi({
    defaultValues: {
      name: 'test',
    },
    onSubmit,
  })

  form.mount()

  expect(form.state.isSubmitSuccessful).toBe(false)

  await form.handleSubmit()

  expect(form.state.isSubmitSuccessful).toBe(true)
  expect(onSubmit).toHaveBeenCalledTimes(1)

  // Simulate a failed submission
  onSubmit.mockRejectedValueOnce(new Error('Submission failed'))

  await expect(form.handleSubmit()).rejects.toThrow('Submission failed')

  expect(form.state.isSubmitSuccessful).toBe(false)
})

it('should reset the fields value and meta to default state', async () => {
  const form = new FormApi({
    defaultValues: {
      name: 'tony',
    } as { name: string },
  })
  form.mount()
  const field = new FieldApi({
    form,
    name: 'name',
  })

  field.mount()
  field.setValue('hawk')

  expect(form.state.values.name).toStrictEqual('hawk')
  expect(field.state.meta.isTouched).toBe(true)

  form.resetField('name')
  expect(form.state.values.name).toStrictEqual('tony')
  expect(field.state.meta.isTouched).toBe(false)
})

it('should allow submit when invalid on mount with canSubmitWhenInvalid', async () => {
  const form = new FormApi({
    defaultValues: {
      firstName: '',
    },
    validators: {
      onMount: () => {
        return {
          form: 'something went wrong',
          fields: {
            firstName: 'first name is required',
          },
        }
      },
    },
  })

  const firstNameField = new FieldApi({
    form,
    name: 'firstName',
  })

  firstNameField.mount()
  form.mount()

  expect(form.state.canSubmit).not.toBe(true) // canSubmitWhenInvalid by default not active

  form.update({ canSubmitWhenInvalid: true })

  expect(form.state.canSubmit).toBe(true)
})

it('should allow submit when invalid with canSubmitWhenInvalid', async () => {
  const form = new FormApi({
    defaultValues: {
      firstName: '',
    },
    validators: {
      onChange: ({ value }) => {
        if (value.firstName.length > 18) {
          return {
            form: 'something went wrong',
            fields: {
              firstName: 'first name is longer than 18 characters',
            },
          }
        }
        return null
      },
    },
  })

  const firstNameField = new FieldApi({
    form,
    name: 'firstName',
  })

  firstNameField.mount()
  form.mount()

  firstNameField.setValue('this is a first name')

  expect(form.state.canSubmit).not.toBe(true) // canSubmitWhenInvalid by default not active

  form.update({ canSubmitWhenInvalid: true })

  expect(form.state.canSubmit).toBe(true)
})

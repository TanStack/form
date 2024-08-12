import { describe, expect, it, vi } from 'vitest'
import { FieldApi, FormApi } from '../src/index'
import { sleep } from './utils'

describe('form api', () => {
  it('should get default form state', () => {
    const form = new FormApi()
    form.mount()
    expect(form.state).toEqual({
      values: {},
      fieldMeta: {},
      canSubmit: true,
      isFieldsValid: true,
      isFieldsValidating: false,
      isFormValid: true,
      isFormValidating: false,
      isSubmitted: false,
      errors: [],
      errorMap: {},
      isSubmitting: false,
      isTouched: false,
      isPristine: true,
      isDirty: false,
      isValid: true,
      isValidating: false,
      submissionAttempts: 0,
      validationMetaMap: {
        onChange: undefined,
        onBlur: undefined,
        onSubmit: undefined,
        onMount: undefined,
      },
    })
  })

  it('should get default form state when default values are passed', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })
    form.mount()
    expect(form.state).toEqual({
      values: {
        name: 'test',
      },
      fieldMeta: {},
      canSubmit: true,
      isFieldsValid: true,
      errors: [],
      errorMap: {},
      isFieldsValidating: false,
      isFormValid: true,
      isFormValidating: false,
      isSubmitted: false,
      isSubmitting: false,
      isTouched: false,
      isPristine: true,
      isDirty: false,
      isValid: true,
      isValidating: false,
      submissionAttempts: 0,
      validationMetaMap: {
        onChange: undefined,
        onBlur: undefined,
        onSubmit: undefined,
        onMount: undefined,
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
    expect(form.state).toEqual({
      values: {},
      fieldMeta: {},
      errors: [],
      errorMap: {},
      canSubmit: true,
      isFieldsValid: true,
      isFieldsValidating: false,
      isFormValid: true,
      isFormValidating: false,
      isSubmitted: false,
      isSubmitting: false,
      isTouched: false,
      isPristine: true,
      isDirty: false,
      isValid: true,
      isValidating: false,
      submissionAttempts: 30,
      validationMetaMap: {
        onChange: undefined,
        onBlur: undefined,
        onSubmit: undefined,
        onMount: undefined,
      },
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

    expect(form.state).toEqual({
      values: {
        name: 'other',
      },
      errors: [],
      errorMap: {},
      fieldMeta: {},
      canSubmit: true,
      isFieldsValid: true,
      isFieldsValidating: false,
      isFormValid: true,
      isFormValidating: false,
      isSubmitted: false,
      isSubmitting: false,
      isTouched: false,
      isPristine: true,
      isDirty: false,
      isValid: true,
      isValidating: false,
      submissionAttempts: 300,
      validationMetaMap: {
        onChange: undefined,
        onBlur: undefined,
        onSubmit: undefined,
        onMount: undefined,
        onServer: undefined,
      },
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

    expect(form.state).toEqual({
      values: {
        name: 'test',
      },
      errors: [],
      errorMap: {},
      fieldMeta: {},
      canSubmit: true,
      isFieldsValid: true,
      isFieldsValidating: false,
      isFormValid: true,
      isFormValidating: false,
      isSubmitted: false,
      isSubmitting: false,
      isTouched: false,
      isPristine: true,
      isDirty: false,
      isValid: true,
      isValidating: false,
      submissionAttempts: 0,
      validationMetaMap: {
        onChange: undefined,
        onBlur: undefined,
        onSubmit: undefined,
        onMount: undefined,
      },
    })
  })

  it('should not wipe validators when resetting', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
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

    field.handleChange('')

    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)

    form.reset()

    expect(form.state).toEqual({
      values: { name: 'test' },
      errors: [],
      errorMap: {},
      fieldMeta: {
        name: {
          isValidating: false,
          isTouched: false,
          isDirty: false,
          isPristine: true,
          errors: [],
          errorMap: {},
        },
      },
      canSubmit: true,
      isFieldsValid: true,
      isFieldsValidating: false,
      isFormValid: true,
      isFormValidating: false,
      isSubmitted: false,
      isSubmitting: false,
      isTouched: false,
      isPristine: true,
      isDirty: false,
      isValid: true,
      isValidating: false,
      submissionAttempts: 0,
      validationMetaMap: {
        onChange: undefined,
        onBlur: undefined,
        onSubmit: undefined,
        onMount: undefined,
        onServer: undefined,
      },
    })
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
    new FieldApi({ form, name: 'names' }).mount()

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

  it('should handle fields inside an array', async () => {
    interface Employee {
      firstName: string
    }
    interface Form {
      employees: Partial<Employee>[]
    }

    const form = new FormApi<Form>()

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

    const form = new FormApi<Form>()

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

  it('should validate fields during submit', async () => {
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

  it('should clear onSubmit error when a valid value is entered', async () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
    })

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

    field.mount()
    form.mount()

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

    field.mount()
    form.mount()

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

    const field = new FieldApi({
      form,
      name: 'firstName',
    })

    field.mount()

    await form.handleSubmit()
    expect(form.state.errors).toStrictEqual(['first name is required'])
  })

  it('should update a nullable object', async () => {
    const form = new FormApi({
      defaultValues: {
        person: null,
      } as { person: { firstName: string } | null },
    })

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
    const form = new FormApi<Form>()
    form.setErrorMap({
      onChange: "name can't be Josh",
    })
    expect(form.state.errorMap.onChange).toEqual("name can't be Josh")
  })

  it('should preserve other values in the formApi errorMap when adding other values', () => {
    interface Form {
      name: string
    }
    const form = new FormApi<Form>()
    form.setErrorMap({
      onChange: "name can't be Josh",
    })
    expect(form.state.errorMap.onChange).toEqual("name can't be Josh")
    form.setErrorMap({
      onBlur: 'name must begin with uppercase',
    })
    expect(form.state.errorMap.onChange).toEqual("name can't be Josh")
    expect(form.state.errorMap.onBlur).toEqual('name must begin with uppercase')
  })

  it('should replace errorMap value if it exists in the FormApi object', () => {
    interface Form {
      name: string
    }
    const form = new FormApi<Form>()
    form.setErrorMap({
      onChange: "name can't be Josh",
    })
    expect(form.state.errorMap.onChange).toEqual("name can't be Josh")
    form.setErrorMap({
      onChange: 'other validation error',
    })
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
    expect(firstNameField.getMeta().errorMap).toMatchObject({
      onSubmit: 'first name is required',
    })
    expect(form.state.errorMap).toMatchObject({
      onSubmit: 'something went wrong',
    })

    // Check if the error is gone after the value is changed
    firstNameField.setValue('nothing')
    // Handling the blur is needed, because the `blur` error on the field
    // is not cleared up before `handleSubmit` is called, so the field
    // is considered to be invalid.
    firstNameField.handleBlur()
    await form.handleSubmit()

    expect(firstNameField.getMeta().errors).toStrictEqual([
      'value cannot be "nothing"',
    ])

    // Check if the error from the field's validator is shown
    firstNameField.setValue('something else')
    await form.handleSubmit()
    expect(firstNameField.getMeta().errors).toStrictEqual([])
    expect(form.state.errors).toStrictEqual([])
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
    expect(firstNameField.getMeta().errorMap.onChange).toBe(
      'value cannot be "nothing"',
    )

    // Check if we can make the error go away by changing the value
    firstNameField.setValue('one')
    expect(firstNameField.getMeta().errorMap.onChange).toBe(undefined)
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

    expect(firstNameField.state.meta.errorMap['onSubmit']).toBe(undefined)
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
    // Since validation runs through the field, a field must be mounted for that array
    const namesField = new FieldApi({ form, name: 'names' })
    namesField.mount()

    // form.removeFieldValue('names', 0)
    namesField.setValue((value) => [...value, 'person-2'])

    await form.handleSubmit()

    expect(namesField.state.meta.errorMap.onSubmit).toBe(
      'person-2 cannot be used',
    )
    expect(namesField.state.meta.errors.length).toBe(1)
  })

  it("should set errors for the fields from the form's onSubmitAsync validator for array fields", async () => {
    /*
      Using fake timers will cause the
      TODO: finish this comment
    */
    vi.useRealTimers()

    const form = new FormApi({
      defaultValues: {
        names: ['test'],
      },
      asyncDebounceMs: 1,
      validators: {
        onSubmitAsync: async ({ value }) => {
          await sleep(1)
          console.log({
            "value.names.includes('other')": value.names.includes('other'),
          })
          if (value.names.includes('other')) {
            return { fields: { names: 'Please enter a different value' } }
          }
          return
        },
      },
    })

    const field = new FieldApi({
      form,
      name: 'names',
    })

    field.mount()
    field.pushValue('other')
    console.log({ value: field.state.value })

    expect(field.getMeta().errors.length).toBe(0)

    await form.handleSubmit()

    expect(field.getMeta().errors).toContain('Please enter a different value')
    expect(field.getMeta().errorMap).toMatchObject({
      onSubmit: 'Please enter a different value',
    })

    field.removeValue(1)
    await form.handleSubmit()
    expect(field.state.value).toStrictEqual(['test'])
    expect(field.getMeta().errors.length).toBe(0)
    expect(field.getMeta().errorMap.onSubmit).toBe(undefined)
  })

  it("should be able to set errors on nested field inside of an array from the form's validators", async () => {
    interface Employee {
      firstName: string
    }
    interface Form {
      employees: Partial<Employee>[]
    }

    const form = new FormApi<Form>({
      validators: {
        onSubmit: ({ value }) => {
          const fieldWithErrorIndex = value.employees.findIndex(
            (v) => v.firstName === 'person-2',
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
    })

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
    expect(fieldInArray.state.meta.errorMap).toMatchObject({
      onSubmit: 'person-2 is banned from registering',
    })

    fieldInArray.setValue('Somebody else')

    await form.handleSubmit()
    expect(form.state.isFieldsValid).toEqual(true)
    expect(form.state.canSubmit).toEqual(true)
    expect(fieldInArray.state.meta.errors).toStrictEqual([])

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
    expect(passconfirmField.state.meta.errors).toStrictEqual([])
  })

  it("should set errors on a linked field from the form's onChangeAsync validator", async () => {
    vi.useRealTimers()
    let resolve!: () => void
    const promise = new Promise((r) => {
      resolve = r as never
    })
    const fn = vi.fn()

    const form = new FormApi({
      defaultValues: {
        password: '',
        confirm_password: '',
      },
      validators: {
        onChangeAsync: async ({ value }) => {
          await promise
          fn()
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
    resolve()
    // Allow for some micro-ticks to allow the promise to resolve
    await sleep(4)

    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(passconfirmField.state.meta.errorMap.onChange).toMatch(
      'passwords do not match',
    )

    passconfirmField.setValue('one')
    resolve()
    // Allow for some micro-ticks to allow the promise to resolve
    await sleep(4)
    expect(form.state.isFieldsValid).toBe(true)
    expect(form.state.canSubmit).toBe(true)
    expect(passconfirmField.state.meta.errors).toStrictEqual([])
  })
})

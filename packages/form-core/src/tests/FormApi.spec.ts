import { expect } from 'vitest'

import { FormApi } from '../FormApi'
import { FieldApi } from '../FieldApi'
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
      isValid: true,
      isValidating: false,
      submissionAttempts: 0,
      formValidationCount: 0,
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
      isValid: true,
      isValidating: false,
      submissionAttempts: 0,
      formValidationCount: 0,
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
      isValid: true,
      isValidating: false,
      submissionAttempts: 30,
      formValidationCount: 0,
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
      isValid: true,
      isValidating: false,
      submissionAttempts: 300,
      formValidationCount: 0,
    })
  })

  it('should reset the form state properly', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })
    form.mount()
    form.setFieldValue('name', 'other')
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
      isValid: true,
      isValidating: false,
      submissionAttempts: 0,
      formValidationCount: 0,
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

  it("should insert an array field's value", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })
    form.mount()
    form.insertFieldValue('names', 1, 'other')

    expect(form.getFieldValue('names')).toStrictEqual(['one', 'other', 'three'])
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

  it("should swap an array field's value", () => {
    const form = new FormApi({
      defaultValues: {
        names: ['one', 'two', 'three'],
      },
    })
    form.mount()
    form.swapFieldValues('names', 1, 2)

    expect(form.getFieldValue('names')).toStrictEqual(['one', 'three', 'two'])
  })

  it('should handle fields inside an array', async () => {
    interface Employee {
      firstName: string
    }
    interface Form {
      employees: Partial<Employee>[]
    }

    const form = new FormApi<Form, unknown>()

    const field = new FieldApi({
      form,
      name: 'employees',
      defaultValue: [],
    })

    field.mount()

    const fieldInArray = new FieldApi({
      form,
      name: `employees.${0}.firstName`,
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

    const form = new FormApi<Form, unknown>()

    const field = new FieldApi({
      form,
      name: 'employees',
      defaultValue: [],
    })

    field.mount()

    const fieldInArray = new FieldApi({
      form,
      name: `employees.${0}.firstName`,
      defaultValue: 'Darcy',
    })
    fieldInArray.mount()
    form.deleteField(`employees.${0}.firstName`)
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

    form.setFieldValue('name', 'two', { touch: true })

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
      onChange: (v) => (v.length > 0 ? undefined : 'required'),
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
      onChange: (value) => {
        if (value.name === 'other') return 'Please enter a different value'
        return
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
    })
    form.mount()
    field.mount()

    expect(form.state.errors.length).toBe(0)
    field.setValue('other', { touch: true })
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
      onChangeAsync: async (value) => {
        await sleep(1000)
        if (value.name === 'other') return 'Please enter a different value'
        return
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })
    form.mount()

    field.mount()

    expect(form.state.errors.length).toBe(0)
    field.setValue('other', { touch: true })
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
      onChangeAsyncDebounceMs: 1000,
      onChangeAsync: async (value) => {
        await sleepMock(1000)
        if (value.name === 'other') return 'Please enter a different value'
        return
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })
    form.mount()

    field.mount()

    expect(form.state.errors.length).toBe(0)
    field.setValue('other', { touch: true })
    field.setValue('other')
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
      onChangeAsync: async (value) => {
        await sleepMock(1000)
        if (value.name === 'other') return 'Please enter a different value'
        return
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    expect(form.state.errors.length).toBe(0)
    field.setValue('other', { touch: true })
    field.setValue('other')
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
      onBlur: (value) => {
        if (value.name === 'other') return 'Please enter a different value'
        return
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    field.setValue('other', { touch: true })
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
      onBlurAsync: async (value) => {
        await sleep(1000)
        if (value.name === 'other') return 'Please enter a different value'
        return
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()
    expect(form.state.errors.length).toBe(0)
    field.setValue('other', { touch: true })
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
      onBlurAsyncDebounceMs: 1000,
      onBlurAsync: async (value) => {
        await sleepMock(10)
        if (value.name === 'other') return 'Please enter a different value'
        return
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    expect(form.state.errors.length).toBe(0)
    field.setValue('other', { touch: true })
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
      onBlurAsync: async (value) => {
        await sleepMock(10)
        if (value.name === 'other') return 'Please enter a different value'
        return
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    expect(form.state.errors.length).toBe(0)
    field.setValue('other', { touch: true })
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
      onBlur: (value) => {
        if (value.name === 'other') return 'Please enter a different value'
        return
      },
      onChange: (value) => {
        if (value.name === 'other') return 'Please enter a different value'
        return
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    field.setValue('other', { touch: true })
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
      onChange: (value) => {
        if (value.name === 'other') return 'Please enter a different value'
        return
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    field.mount()

    field.setValue('other', { touch: true })
    expect(form.state.errors).toStrictEqual(['Please enter a different value'])
    expect(form.state.errorMap).toEqual({
      onChange: 'Please enter a different value',
    })
    field.setValue('test', { touch: true })
    expect(form.state.errors).toStrictEqual([])
    expect(form.state.errorMap).toEqual({})
  })

  it('should return error onMount', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'other',
      },
      onMount: (value) => {
        if (value.name === 'other') return 'Please enter a different value'
        return
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
      onChange: (v) => (v.length > 0 ? undefined : 'first name is required'),
    })

    const lastNameField = new FieldApi({
      form,
      name: 'lastName',
      onChange: (v) => (v.length > 0 ? undefined : 'last name is required'),
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
      onChange: (v) => (v.length > 0 ? undefined : 'first name is required'),
      onBlur: (v) =>
        v.length > 3
          ? undefined
          : 'first name must be longer than 3 characters',
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
      onSubmit: (v) => (v.length > 0 ? undefined : 'first name is required'),
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
})

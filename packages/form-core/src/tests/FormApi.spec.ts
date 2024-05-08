import { describe, expect, it, vi } from 'vitest'

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
          touchedErrors: [],
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

    form.setFieldValue('name', 'other', { touch: true })

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
    firstNameField.setValue('nothing', { touch: true })
    // Handling the blur is needed, because the `blur` error on the field
    // is not cleared up before `handleSubmit` is called, so the field
    // is considered to be invalid.
    firstNameField.handleBlur()
    await form.handleSubmit()

    expect(firstNameField.getMeta().errors).toStrictEqual([
      'value cannot be "nothing"',
    ])

    // Check if the error from the field's validator is shown
    firstNameField.setValue('something else', { touch: true })
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
    firstNameField.setValue('', { touch: true })

    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(firstNameField.state.meta.errorMap.onChange).toBe(
      'first name is required',
    )

    // Check if we can make the error go away by changing the value
    firstNameField.setValue('one', { touch: true })
    expect(firstNameField.state.meta.errorMap.onChange).toBe(undefined)

    // Check if we get an error from the field's `onChange` validator
    firstNameField.setValue('nothing', { touch: true })

    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(firstNameField.getMeta().errorMap.onChange).toBe(
      'value cannot be "nothing"',
    )

    // Check if we can make the error go away by changing the value
    firstNameField.setValue('one', { touch: true })
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

    firstNameField.setValue('this is a first name', { touch: true })

    expect(firstNameField.state.meta.errorMap['onSubmit']).toBe(undefined)
  })

  it("should set errors for the fields from the form's onSubmitAsync validator", async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validators: {
        onSubmitAsync: async ({ value }) => {
          await sleep(1000)
          if (value.name === '')
            return {
              form: 'something went wrong',
              fields: {
                name: 'first name is required',
              },
            }
          return null
        },
      },
    })
    const field = new FieldApi({
      form,
      name: 'name',
      validators: {
        onSubmitAsync: async ({ value }) => {
          await sleep(1000)
          if (value === 'nothing') return 'value cannot be "nothing"'
          return null
        },
      },
    })

    form.mount()
    field.mount()

    expect(form.state.errors.length).toBe(0)

    // Check if the error is returned from the form's onSubmit validator
    form.handleSubmit()
    await vi.runAllTimersAsync()
    expect(form.state.errorMap).toMatchObject({
      onSubmit: 'something went wrong',
    })
    expect(field.state.meta.errorMap).toMatchObject({
      onSubmit: 'first name is required',
    })

    // Check if the error goes away when the value is changed
    field.setValue('other', { touch: true })
    field.handleBlur()
    form.handleSubmit()
    await vi.runAllTimersAsync()
    expect(form.state.errors).toStrictEqual([])
    expect(field.state.value).toBe('other')
    expect(field.state.meta.errors).toStrictEqual([])

    // Check if the field validator gives an error
    field.setValue('nothing', { touch: true })
    form.handleSubmit()
    await vi.runAllTimersAsync()
    expect(field.state.meta.errorMap.onSubmit).toBe('value cannot be "nothing"')
  })

  it("should set errors for the fields from the form's onSubmit validator for array fields", async () => {
    const form = new FormApi({
      defaultValues: {
        people: ['person-1'],
      },
      validators: {
        onSubmit: ({ value }) => {
          if (value.people.includes('person-2')) {
            return {
              fields: {
                people: 'person-2 is banned from registering',
              },
            }
          }

          return null
        },
      },
    })

    const peopleField = new FieldApi({
      form,
      name: 'people',
    })

    peopleField.setValue((value) => [...value, 'person-2'])
    peopleField.mount()

    await form.handleSubmit()
    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(form.state.isValid).toEqual(false)
    expect(peopleField.state.meta.errorMap.onSubmit).toBe(
      'person-2 is banned from registering',
    )
  })

  it("should set errors for the fields from the form's onSubmitAsync validator for array fields", async () => {
    vi.useFakeTimers()

    const form = new FormApi({
      defaultValues: {
        people: ['person-1'],
      },
      validators: {
        onSubmitAsync: async ({ value }) => {
          await sleep(1000)
          if (value.people.includes('person-2')) {
            return {
              fields: {
                people: 'person-2 is banned from registering',
              },
            }
          }

          return null
        },
      },
    })

    const peopleField = new FieldApi({
      form,
      name: 'people',
    })

    form.mount()
    peopleField.setValue((value) => [...value, 'person-2'])
    peopleField.mount()
    expect(form.state.errors.length).toBe(0)

    form.handleSubmit()
    await vi.runAllTimersAsync()
    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(form.state.isValid).toEqual(false)
    expect(peopleField.state.meta.errorMap.onSubmit).toEqual(
      'person-2 is banned from registering',
    )
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

    passField.setValue('one', { touch: true })

    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(passconfirmField.state.meta.errorMap.onChange).toBe(
      'passwords do not match',
    )

    passconfirmField.setValue('one', { touch: true })
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

    passField.setValue('one', { touch: true })
    resolve()
    // Allow for some micro-ticks to allow the promise to resolve
    await sleep(4)

    expect(form.state.isFieldsValid).toEqual(false)
    expect(form.state.canSubmit).toEqual(false)
    expect(passconfirmField.state.meta.errorMap.onChange).toMatchObject(
      'passwords do not match',
    )

    passconfirmField.setValue('one', { touch: true })
    resolve()
    // Allow for some micro-ticks to allow the promise to resolve
    await sleep(4)
    expect(form.state.isFieldsValid).toBe(true)
    expect(form.state.canSubmit).toBe(true)
    expect(passconfirmField.state.meta.errors).toStrictEqual([])
  })
})

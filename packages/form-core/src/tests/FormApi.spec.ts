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

  it('form validation should update states', async () => {
    let mounted = false
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      onMount: () => {
        mounted = true
        return undefined
      },
      onChange: (v) => {
        return v.name.length > 2 ? undefined : 'Invalid length'
      },
      async onChangeAsync(values) {
        await sleep(10)
        if (values.name.length === 3) return 'Async invalid length'
        return
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
    })

    form.mount()
    expect(mounted).toBe(true)
    field.mount()

    field.handleChange('a')
    expect(form.state.isFormValidating).toBe(false)
    expect(form.state.isFormValid).toBe(false)
    expect(form.state.isValid).toBe(false)
    expect(form.state.canSubmit).toBe(false)

    field.handleChange('ayo')
    expect(form.state.isFormValidating).toBe(true)
    await sleep(10)
    expect(form.state.isFormValidating).toBe(false)
    expect(form.state.isFormValid).toBe(false)
    expect(form.state.isValid).toBe(false)
    expect(form.state.canSubmit).toBe(false)

    field.handleChange('valid')
    expect(form.state.isFormValidating).toBe(true)
    await sleep(10)
    expect(form.state.isFormValidating).toBe(false)
    expect(form.state.isFormValid).toBe(true)
    expect(form.state.isValid).toBe(true)
    expect(form.state.canSubmit).toBe(true)
  })
})

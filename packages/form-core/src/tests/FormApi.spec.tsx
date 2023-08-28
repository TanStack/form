import { expect } from 'vitest'

import { FormApi } from '../FormApi'

describe('form api', () => {
  it('should get default form state', () => {
    const form = new FormApi()

    expect(form.state).toEqual({
      values: undefined,
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

  it('should get default form state when default values are passed', () => {
    const form = new FormApi({
      defaultValues: {
        name: 'test',
      },
    })

    expect(form.state).toEqual({
      values: {
        name: 'test',
      },
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

  it('should get default form state when default state is passed', () => {
    const form = new FormApi({
      defaultState: {
        submissionAttempts: 30,
      },
    })

    expect(form.state).toEqual({
      values: undefined,
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

    form.pushFieldValue('name', 'other');
    form.state.submissionAttempts = 300;

    form.reset();

    expect(form.state).toEqual({
      values: {
        name: 'test',
      },
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
})

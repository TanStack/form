import { expect, it, describe } from 'vitest'
import { FieldApi, FormApi, mergeAndUpdate, mergeForm } from '../src'
import type { AnyFormState } from '../src'

describe('server validation error propagation (#1704)', () => {
  it('should propagate onServer errors to field meta via mergeAndUpdate', () => {
    const serverState: Partial<AnyFormState> = {
      errorMap: {
        onServer: {
          form: {
            firstName: [
              { message: 'String must contain at least 6 character(s)' },
            ],
          },
          fields: {
            firstName: [
              { message: 'String must contain at least 6 character(s)' },
            ],
          },
        },
      },
    }

    const form = new FormApi({
      defaultValues: {
        firstName: '',
        age: 0,
      },
    })

    form.mount()

    const firstNameField = new FieldApi({
      form,
      name: 'firstName',
    })

    firstNameField.mount()

    expect(firstNameField.state.meta.isValid).toBe(true)
    expect(firstNameField.state.meta.errors).toEqual([])

    mergeAndUpdate(form, (f) => mergeForm(f, serverState))

    expect(firstNameField.state.meta.errorMap.onServer).toBeDefined()
    expect(firstNameField.state.meta.errors.length).toBeGreaterThan(0)
    expect(firstNameField.state.meta.isValid).toBe(false)
  })

  it('should propagate onServer errors via constructor transform', () => {
    const serverState: Partial<AnyFormState> = {
      errorMap: {
        onServer: {
          form: {
            firstName: [{ message: 'Required' }],
          },
          fields: {
            firstName: [{ message: 'Required' }],
          },
        },
      },
    }

    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
      transform: (baseForm) =>
        mergeForm(baseForm as never, serverState),
    })

    form.mount()

    const firstNameField = new FieldApi({
      form,
      name: 'firstName',
    })

    firstNameField.mount()

    expect(firstNameField.state.meta.errorMap.onServer).toBeDefined()
    expect(firstNameField.state.meta.errors.length).toBeGreaterThan(0)
    expect(firstNameField.state.meta.isValid).toBe(false)
  })

  it('should propagate onServer errors after initial empty state', () => {
    const initialFormState: Partial<AnyFormState> = {
      errorMap: {
        onServer: undefined,
      },
      values: undefined,
      errors: [],
    }

    const form = new FormApi({
      defaultValues: {
        firstName: '',
        age: 0,
      },
      transform: (baseForm) =>
        mergeForm(baseForm as never, initialFormState),
    })

    form.mount()

    const firstNameField = new FieldApi({
      form,
      name: 'firstName',
    })

    firstNameField.mount()

    expect(firstNameField.state.meta.isValid).toBe(true)
    expect(firstNameField.state.meta.errors).toEqual([])

    const serverErrorState: Partial<AnyFormState> = {
      errorMap: {
        onServer: {
          form: {
            firstName: [
              { message: 'String must contain at least 5 character(s)' },
            ],
          },
          fields: {
            firstName: [
              { message: 'String must contain at least 5 character(s)' },
            ],
          },
        },
      },
      values: { firstName: '123', age: 0 },
      errors: [],
    }

    mergeAndUpdate(form, (f) => mergeForm(f, serverErrorState))

    expect(firstNameField.state.meta.errorMap.onServer).toBeDefined()
    expect(firstNameField.state.meta.errors.length).toBeGreaterThan(0)
    expect(firstNameField.state.meta.isValid).toBe(false)
  })

  it('should propagate onServer errors to field meta via mergeForm alone', () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
      },
    })

    form.mount()

    const firstNameField = new FieldApi({
      form,
      name: 'firstName',
    })

    firstNameField.mount()

    expect(firstNameField.state.meta.isValid).toBe(true)

    const serverErrorState: Partial<AnyFormState> = {
      errorMap: {
        onServer: {
          form: {
            firstName: [
              { message: 'String must contain at least 5 character(s)' },
            ],
          },
          fields: {
            firstName: [
              { message: 'String must contain at least 5 character(s)' },
            ],
          },
        },
      },
    }

    mergeForm(form as never, serverErrorState)

    expect(form.state.errorMap.onServer).toBeDefined()
    expect(firstNameField.state.meta.errorMap.onServer).toBeDefined()
    expect(firstNameField.state.meta.errors.length).toBeGreaterThan(0)
    expect(firstNameField.state.meta.isValid).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { FieldApi, FormApi } from '../src/index'

describe('fieldMeta accessing', () => {
  it('should return undefined for unmounted fields', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
        email: '',
      },
    })

    expect(form.state.fieldMeta.name).toBeUndefined()
    expect(form.state.fieldMeta.email).toBeUndefined()
  })

  it('should have defined fieldMeta after field is mounted', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.mount()

    expect(form.state.fieldMeta.name).toBeDefined()
    expect(form.state.fieldMeta.name?.isValid).toBe(true)
    expect(form.state.fieldMeta.name?.isTouched).toBe(false)
    expect(form.state.fieldMeta.name?.isDirty).toBe(false)
  })

  it('should handle nested field paths', () => {
    const form = new FormApi({
      defaultValues: {
        user: {
          profile: {
            firstName: '',
            lastName: '',
          },
        },
      },
    })

    expect(form.state.fieldMeta['user.profile.firstName']).toBeUndefined()
    expect(form.state.fieldMeta['user.profile.lastName']).toBeUndefined()

    const firstNameField = new FieldApi({
      form,
      name: 'user.profile.firstName',
    })

    firstNameField.mount()

    expect(form.state.fieldMeta['user.profile.firstName']).toBeDefined()

    expect(form.state.fieldMeta['user.profile.lastName']).toBeUndefined()
  })

  it('should handle array fields', () => {
    const form = new FormApi({
      defaultValues: {
        items: ['item1', 'item2'],
      },
    })

    expect(form.state.fieldMeta['items[0]']).toBeUndefined()
    expect(form.state.fieldMeta['items[1]']).toBeUndefined()

    const field0 = new FieldApi({
      form,
      name: 'items[0]',
    })

    field0.mount()

    expect(form.state.fieldMeta['items[0]']).toBeDefined()
    expect(form.state.fieldMeta['items[1]']).toBeUndefined()
  })

  it('should handle getFieldMeta returning undefined', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const fieldMeta = form.getFieldMeta('name')
    expect(fieldMeta).toBeUndefined()

    const field = new FieldApi({
      form,
      name: 'name',
    })

    field.mount()

    const fieldMetaAfterMount = form.getFieldMeta('name')
    expect(fieldMetaAfterMount).toBeDefined()
    expect(fieldMetaAfterMount?.isValid).toBe(true)
  })

  it('should handle multiple fields with mixed mount states', () => {
    const form = new FormApi({
      defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
      },
    })

    const firstNameField = new FieldApi({
      form,
      name: 'firstName',
    })

    const lastNameField = new FieldApi({
      form,
      name: 'lastName',
    })

    firstNameField.mount()

    expect(form.state.fieldMeta.firstName).toBeDefined()
    expect(form.state.fieldMeta.email).toBeUndefined()
  })

  it('should preserve fieldMeta after unmounting and remounting', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
    })

    const field = new FieldApi({
      form,
      name: 'name',
    })

    const cleanup = field.mount()

    field.setValue('test')
    expect(form.state.fieldMeta.name?.isTouched).toBe(true)
    expect(form.state.fieldMeta.name?.isDirty).toBe(true)

    cleanup()

    const metaAfterCleanup = form.state.fieldMeta.name

    expect(metaAfterCleanup).toBeDefined()
  })

  it('should work with form validation that accesses fieldMeta', () => {
    const form = new FormApi({
      defaultValues: {
        password: '',
        confirmPassword: '',
      },
      validators: {
        onChange: ({ value }) => {
          if (value.password !== value.confirmPassword) {
            return 'Passwords must match'
          }
          return undefined
        },
      },
    })

    form.mount()

    const passwordField = new FieldApi({
      form,
      name: 'password',
    })

    passwordField.mount()

    expect(() => {
      passwordField.setValue('test123')
    }).not.toThrow()
  })
})

import { describe, expect, it } from 'vitest'
import { FormApi } from '../src/FormApi'

describe('setFieldValue validation for fields without components', () => {
  it('should validate field when setFieldValue is called even without field component', () => {
    const form = new FormApi({
      defaultValues: {
        name: '',
      },
      validators: {
        onChange: ({ value }) => {
          if (!value.name) {
            return {
              fields: {
                name: 'Name is required',
              },
            }
          }
          return undefined
        },
      },
    })

    form.mount()

    // Initially, form should be valid (no validation errors yet)
    expect(form.state.isValid).toBe(true)
    expect(form.state.errors).toEqual([])

    // Set field value to empty string (should trigger validation and show error)
    form.setFieldValue('name', '')

    // Form should now be invalid due to validation error
    expect(form.state.isValid).toBe(false)
    expect(form.state.fieldMeta.name?.errors).toEqual(['Name is required'])

    // Set field value to valid value (should clear validation error)
    form.setFieldValue('name', 'John')

    // Form should now be valid again
    expect(form.state.isValid).toBe(true)
    expect(form.state.fieldMeta.name?.errors).toEqual([])
  })

  it('should validate field with form-level async validator', async () => {
    const form = new FormApi({
      defaultValues: {
        email: '',
      },
      validators: {
        onChangeAsync: async ({ value }) => {
          if (!value.email) {
            return {
              fields: {
                email: 'Email is required',
              },
            }
          }
          return undefined
        },
      },
    })

    form.mount()

    // Set field value to empty string (should trigger async validation)
    form.setFieldValue('email', '')

    // Wait for async validation to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Form should now be invalid due to validation error
    expect(form.state.isValid).toBe(false)
    expect(form.state.fieldMeta.email?.errors).toEqual(['Email is required'])

    // Set field value to valid value (should clear validation error)
    form.setFieldValue('email', 'john@example.com')

    // Wait for async validation to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Form should now be valid again
    expect(form.state.isValid).toBe(true)
    expect(form.state.fieldMeta.email?.errors).toEqual([])
  })
})

import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { FieldApi, FormApi } from '../src/index'
import type { FieldMappingConfig } from '../src/types'

interface TestFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const testSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
})

describe('disableFieldMapping', () => {
  describe('shouldApplySchemaToField method', () => {
    it('should return true when no configuration is provided (default behavior)', () => {
      const form = new FormApi<TestFormData>({
        defaultValues: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
      })

      expect(form.shouldApplySchemaToField('username')).toBe(true)
      expect(form.shouldApplySchemaToField('email')).toBe(true)
      expect(form.shouldApplySchemaToField('password')).toBe(true)
    })

    it('should return false for all fields when disableFieldMapping is true', () => {
      const form = new FormApi<TestFormData>({
        defaultValues: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
        disableFieldMapping: true,
      })

      expect(form.shouldApplySchemaToField('username')).toBe(false)
      expect(form.shouldApplySchemaToField('email')).toBe(false)
      expect(form.shouldApplySchemaToField('password')).toBe(false)
    })

    it('should return true for all fields when disableFieldMapping is false', () => {
      const form = new FormApi<TestFormData>({
        defaultValues: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
        disableFieldMapping: false,
      })

      expect(form.shouldApplySchemaToField('username')).toBe(true)
      expect(form.shouldApplySchemaToField('email')).toBe(true)
      expect(form.shouldApplySchemaToField('password')).toBe(true)
    })

    it('should respect field-specific configuration', () => {
      const config: FieldMappingConfig<TestFormData> = {
        fields: {
        },
      }

      const form = new FormApi<TestFormData>({
        defaultValues: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
        disableFieldMapping: config,
      })

    })

    it('should handle empty fields configuration', () => {
      const form = new FormApi<TestFormData>({
        defaultValues: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
        disableFieldMapping: { fields: {} },
      })

      expect(form.shouldApplySchemaToField('username')).toBe(true)
      expect(form.shouldApplySchemaToField('email')).toBe(true)
      expect(form.shouldApplySchemaToField('password')).toBe(true)
    })
  })

  describe('schema validation integration', () => {
    it('should apply schema errors to all fields by default', () => {
      const form = new FormApi({
        defaultValues: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
        validators: {
          onChange: testSchema,
        },
      })
      form.mount()

      const usernameField = new FieldApi({ form, name: 'username' })
      const emailField = new FieldApi({ form, name: 'email' })
      const passwordField = new FieldApi({ form, name: 'password' })
      const confirmPasswordField = new FieldApi({ form, name: 'confirmPassword' })
      
      usernameField.mount()
      emailField.mount()
      passwordField.mount()
      confirmPasswordField.mount()

      usernameField.setValue('')
      emailField.setValue('invalid-email')
      passwordField.setValue('123')
      confirmPasswordField.setValue('456')

      expect(form.state.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            username: expect.any(Array),
            email: expect.any(Array),
            password: expect.any(Array),
            confirmPassword: expect.any(Array),
          }),
        ])
      )
    })

    it('should not apply schema errors when disableFieldMapping is true', () => {
      const form = new FormApi({
        defaultValues: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
        validators: {
          onChange: testSchema,
        },
        disableFieldMapping: true,
      })
      form.mount()

      const usernameField = new FieldApi({ form, name: 'username' })
      const emailField = new FieldApi({ form, name: 'email' })
      const passwordField = new FieldApi({ form, name: 'password' })
      const confirmPasswordField = new FieldApi({ form, name: 'confirmPassword' })
      
      usernameField.mount()
      emailField.mount()
      passwordField.mount()
      confirmPasswordField.mount()

      usernameField.setValue('')
      emailField.setValue('invalid-email')
      passwordField.setValue('123')
      confirmPasswordField.setValue('456')

      expect(form.state.errors).toEqual([])
    })

    it('should selectively apply schema errors based on field configuration', () => {
      const form = new FormApi({
        defaultValues: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
        validators: {
          onChange: testSchema,
        },
        disableFieldMapping: {
          fields: {
          },
        },
      })
      form.mount()

      const usernameField = new FieldApi({ form, name: 'username' })
      const emailField = new FieldApi({ form, name: 'email' })
      const passwordField = new FieldApi({ form, name: 'password' })
      const confirmPasswordField = new FieldApi({ form, name: 'confirmPassword' })
      
      usernameField.mount()
      emailField.mount()
      passwordField.mount()
      confirmPasswordField.mount()

      usernameField.setValue('')
      emailField.setValue('invalid-email')
      passwordField.setValue('123')
      confirmPasswordField.setValue('456')

      expect(form.state.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
          }),
        ])
      )
      
      const errorObj = form.state.errors[0] as Record<string, unknown>
      expect(errorObj).not.toHaveProperty('username')
    })

    it('should handle configuration changes at runtime', () => {
      const form = new FormApi<TestFormData>({
        defaultValues: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
        disableFieldMapping: false,
      })

      expect(form.shouldApplySchemaToField('username')).toBe(true)

      form.update({
        disableFieldMapping: true,
      })

      expect(form.shouldApplySchemaToField('username')).toBe(false)
    })
  })
})

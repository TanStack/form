import { describe, expect, it } from 'vitest'
import { FormApi } from '../FormApi'
import type { FieldMappingConfig } from '../types'

interface TestFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const mockSchemaValidator = {
  validate: (value: TestFormData) => {
    const errors: Record<string, string> = {}
    
    if (!value.username) {
      errors.username = 'Username is required'
    }
    if (!value.email || !value.email.includes('@')) {
      errors.email = 'Valid email is required'
    }
    if (!value.password || value.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
    if (value.password !== value.confirmPassword) {
      errors.confirmPassword = 'Passwords must match'
    }
    
    return Object.keys(errors).length > 0 ? { fields: errors } : null
  }
}

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
          username: true,
          email: false,
        
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

      expect(form.shouldApplySchemaToField('username')).toBe(false)
      expect(form.shouldApplySchemaToField('email')).toBe(true)
      expect(form.shouldApplySchemaToField('password')).toBe(true)
      expect(form.shouldApplySchemaToField('confirmPassword')).toBe(true)
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
    it('should apply schema errors to all fields by default', async () => {
      const form = new FormApi<TestFormData>({
        defaultValues: {
          username: '',
          email: 'invalid-email',
          password: '123',
          confirmPassword: '456',
        },
        validators: {
          onChange: mockSchemaValidator,
        },
      })

    
      const usernameField = form.getFieldInfo('username')
      const emailField = form.getFieldInfo('email')
      const passwordField = form.getFieldInfo('password')
      const confirmPasswordField = form.getFieldInfo('confirmPassword')

    
      await form.validateAllFields('change')

    
      expect(form.getFieldMeta('username')?.errorMap.onChange).toBeDefined()
      expect(form.getFieldMeta('email')?.errorMap.onChange).toBeDefined()
      expect(form.getFieldMeta('password')?.errorMap.onChange).toBeDefined()
      expect(form.getFieldMeta('confirmPassword')?.errorMap.onChange).toBeDefined()
    })

    it('should not apply schema errors when disableFieldMapping is true', async () => {
      const form = new FormApi<TestFormData>({
        defaultValues: {
          username: '',
          email: 'invalid-email',
          password: '123',
          confirmPassword: '456',
        },
        validators: {
          onChange: mockSchemaValidator,
        },
        disableFieldMapping: true,
      })

    
      form.getFieldInfo('username')
      form.getFieldInfo('email')
      form.getFieldInfo('password')
      form.getFieldInfo('confirmPassword')

    
      await form.validateAllFields('change')

    
      expect(form.getFieldMeta('username')?.errorMap.onChange).toBeUndefined()
      expect(form.getFieldMeta('email')?.errorMap.onChange).toBeUndefined()
      expect(form.getFieldMeta('password')?.errorMap.onChange).toBeUndefined()
      expect(form.getFieldMeta('confirmPassword')?.errorMap.onChange).toBeUndefined()
    })

    it('should selectively apply schema errors based on field configuration', async () => {
      const form = new FormApi<TestFormData>({
        defaultValues: {
          username: '',
          email: 'invalid-email',
          password: '123',
          confirmPassword: '456',
        },
        validators: {
          onChange: mockSchemaValidator,
        },
        disableFieldMapping: {
          fields: {
            username: true,
            email: false,
          
          },
        },
      })

    
      form.getFieldInfo('username')
      form.getFieldInfo('email')
      form.getFieldInfo('password')
      form.getFieldInfo('confirmPassword')

    
      await form.validateAllFields('change')

    
      expect(form.getFieldMeta('username')?.errorMap.onChange).toBeUndefined()
      expect(form.getFieldMeta('email')?.errorMap.onChange).toBeDefined()
      expect(form.getFieldMeta('password')?.errorMap.onChange).toBeDefined()
      expect(form.getFieldMeta('confirmPassword')?.errorMap.onChange).toBeDefined()
    })

    it('should handle delayed field mounting with schema errors', async () => {
      const form = new FormApi<TestFormData>({
        defaultValues: {
          username: '',
          email: 'invalid-email',
          password: '123',
          confirmPassword: '456',
        },
        validators: {
          onChange: mockSchemaValidator,
        },
        disableFieldMapping: {
          fields: {
            username: false,
            email: true,
          },
        },
      })

    
      await form.validateAllFields('change')

    
      form.getFieldInfo('username')
      form.getFieldInfo('email')
      form.getFieldInfo('password')
      form.getFieldInfo('confirmPassword')

    
      await form.validateAllFields('change')

    
      expect(form.getFieldMeta('username')?.errorMap.onChange).toBeDefined()
      expect(form.getFieldMeta('email')?.errorMap.onChange).toBeUndefined()
      expect(form.getFieldMeta('password')?.errorMap.onChange).toBeDefined()
      expect(form.getFieldMeta('confirmPassword')?.errorMap.onChange).toBeDefined()
    })

    it('should preserve field-level validators when schema mapping is disabled', async () => {
      const form = new FormApi<TestFormData>({
        defaultValues: {
          username: '',
          email: 'invalid-email',
          password: '123',
          confirmPassword: '456',
        },
        validators: {
          onChange: mockSchemaValidator,
        },
        disableFieldMapping: true,
      })

    
      const usernameField = form.getFieldInfo('username')
      if (usernameField.instance) {
        usernameField.instance.options.validators = {
          onChange: ({ value }) => value ? undefined : 'Field-level error',
        }
      }

    
      await form.validateAllFields('change')

    
      const usernameMeta = form.getFieldMeta('username')
      expect(usernameMeta?.errorMap.onChange).toBeUndefined()

    
      form.setFieldValue('username', '')
      await form.validateField('username', 'change')

    
      const updatedMeta = form.getFieldMeta('username')
      expect(updatedMeta?.errorMap.onChange).toBe('Field-level error')
    })
  })

  describe('performance and edge cases', () => {
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

    it('should handle undefined field names gracefully', () => {
      const form = new FormApi<TestFormData>({
        defaultValues: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
        disableFieldMapping: {
          fields: {
            username: true,
          },
        },
      })

    
      expect(form.shouldApplySchemaToField('nonExistentField' as any)).toBe(true)
    })

    it('should not impact form submission validation', async () => {
      const form = new FormApi<TestFormData>({
        defaultValues: {
          username: '',
          email: 'invalid-email',
          password: '123',
          confirmPassword: '456',
        },
        validators: {
          onSubmit: mockSchemaValidator,
        },
        disableFieldMapping: true,
      })

    
      form.getFieldInfo('username')
      form.getFieldInfo('email')

    
      let submitCalled = false
      form.options.onSubmit = () => {
        submitCalled = true
      }

      await form.handleSubmit()

    
      expect(submitCalled).toBe(false)
      expect(form.state.isFieldsValid).toBe(false)
    })
  })
})

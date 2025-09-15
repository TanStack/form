import { describe, expect, it } from 'vitest'
import { mapServerErrors } from '../src/index'

describe('mapServerErrors', () => {
  describe('Zod-like errors', () => {
    it('should map zod validation errors', () => {
      const zodError = {
        issues: [
          { path: ['name'], message: 'Name is required' },
          { path: ['email'], message: 'Invalid email format' },
          { path: ['items', 0, 'price'], message: 'Price must be positive' },
        ],
      }

      const result = mapServerErrors(zodError)

      expect(result).toEqual({
        fields: {
          name: ['Name is required'],
          email: ['Invalid email format'],
          'items.0.price': ['Price must be positive'],
        },
      })
    })

    it('should handle nested array paths', () => {
      const zodError = {
        issues: [
          { path: ['users', 1, 'addresses', 0, 'street'], message: 'Street is required' },
        ],
      }

      const result = mapServerErrors(zodError)

      expect(result).toEqual({
        fields: {
          'users.1.addresses.0.street': ['Street is required'],
        },
      })
    })
  })

  describe('Rails-like errors', () => {
    it('should map rails validation errors', () => {
      const railsError = {
        errors: {
          name: 'Name is required',
          email: ['Invalid email', 'Email already taken'],
          'user.profile.bio': 'Bio is too long',
        },
      }

      const result = mapServerErrors(railsError)

      expect(result).toEqual({
        fields: {
          name: ['Name is required'],
          email: ['Invalid email', 'Email already taken'],
          'user.profile.bio': ['Bio is too long'],
        },
      })
    })
  })

  describe('NestJS-like errors', () => {
    it('should map nestjs validation errors', () => {
      const nestError = {
        message: [
          { field: 'name', message: 'Name is required' },
          { field: 'email', message: 'Invalid email' },
        ],
      }

      const result = mapServerErrors(nestError)

      expect(result).toEqual({
        fields: {
          name: ['Name is required'],
          email: ['Invalid email'],
        },
      })
    })
  })

  describe('Custom field/form error format', () => {
    it('should map field and form errors', () => {
      const customError = {
        fieldErrors: [
          { path: 'name', message: 'Name is required' },
          { path: 'email', message: 'Invalid email' },
        ],
        formError: { message: 'Form submission failed' },
      }

      const result = mapServerErrors(customError)

      expect(result).toEqual({
        fields: {
          name: ['Name is required'],
          email: ['Invalid email'],
        },
        form: 'Form submission failed',
      })
    })
  })

  describe('Path mapping', () => {
    it('should use custom path mapper', () => {
      const error = {
        issues: [
          { path: ['items[0].price'], message: 'Price is required' },
          { path: ['user[profile][name]'], message: 'Name is required' },
        ],
      }

      const pathMapper = (path: string) => path.replace(/\[(\w+)\]/g, '.$1')
      const result = mapServerErrors(error, { pathMapper })

      expect(result).toEqual({
        fields: {
          'items.0.price': ['Price is required'],
          'user.profile.name': ['Name is required'],
        },
      })
    })

    it('should handle bracket notation with default mapper', () => {
      const error = {
        errors: {
          'items[0].name': 'Name is required',
          'items[1][price]': 'Price is required',
          'user[addresses][0][street]': 'Street is required',
        },
      }

      const result = mapServerErrors(error)

      expect(result).toEqual({
        fields: {
          'items.0.name': ['Name is required'],
          'items.1.price': ['Price is required'],
          'user.addresses.0.street': ['Street is required'],
        },
      })
    })
  })

  describe('Fallback handling', () => {
    it('should use fallback message for unknown error format', () => {
      const unknownError = { someRandomProperty: 'value' }

      const result = mapServerErrors(unknownError)

      expect(result).toEqual({
        fields: {},
        form: 'An error occurred',
      })
    })

    it('should use custom fallback message', () => {
      const unknownError = { someRandomProperty: 'value' }

      const result = mapServerErrors(unknownError, {
        fallbackFormMessage: 'Custom error message',
      })

      expect(result).toEqual({
        fields: {},
        form: 'Custom error message',
      })
    })

    it('should handle non-object errors', () => {
      expect(mapServerErrors(null)).toEqual({
        fields: {},
        form: 'An error occurred',
      })

      expect(mapServerErrors('string error')).toEqual({
        fields: {},
        form: 'An error occurred',
      })

      expect(mapServerErrors(undefined)).toEqual({
        fields: {},
        form: 'An error occurred',
      })
    })

    it('should extract message from generic error object', () => {
      const error = { message: 'Something went wrong' }

      const result = mapServerErrors(error)

      expect(result).toEqual({
        fields: {},
        form: 'Something went wrong',
      })
    })
  })
})

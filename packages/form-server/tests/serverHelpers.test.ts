import { describe, expect, it } from 'vitest'
import { 
  createServerErrorResponse, 
  createServerSuccessResponse,
  getAllErrorMessages,
  getFormError,
  hasFieldErrors
} from '../src/index'

describe('Server helper functions', () => {
  describe('createServerErrorResponse', () => {
    it('should create error response with mapped errors', () => {
      const zodError = {
        issues: [
          { path: ['name'], message: 'Name is required' }
        ]
      }

      const result = createServerErrorResponse(zodError)

      expect(result.success).toBe(false)
      expect(result.errors.fields.name).toEqual(['Name is required'])
    })

    it('should apply path mapper in error response', () => {
      const error = {
        issues: [
          { path: ['user[0].name'], message: 'Name is required' }
        ]
      }

      const result = createServerErrorResponse(error, {
        pathMapper: (path) => path.replace(/\[(\d+)\]/g, '.$1')
      })

      expect(result.success).toBe(false)
      expect(result.errors.fields['user.0.name']).toEqual(['Name is required'])
    })
  })

  describe('createServerSuccessResponse', () => {
    it('should create success response with data', () => {
      const data = { id: 1, name: 'John' }
      const result = createServerSuccessResponse(data)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(data)
    })

    it('should handle undefined data', () => {
      const result = createServerSuccessResponse(undefined)

      expect(result.success).toBe(true)
      expect(result.data).toBeUndefined()
    })
  })

  describe('getFormError', () => {
    it('should extract form error', () => {
      const mapped = {
        fields: { name: ['Name error'] },
        form: 'Form level error'
      }

      expect(getFormError(mapped)).toBe('Form level error')
    })

    it('should return undefined when no form error', () => {
      const mapped = {
        fields: { name: ['Name error'] }
      }

      expect(getFormError(mapped)).toBeUndefined()
    })
  })

  describe('hasFieldErrors', () => {
    it('should return true when field errors exist', () => {
      const mapped = {
        fields: { name: ['Name error'] },
        form: 'Form error'
      }

      expect(hasFieldErrors(mapped)).toBe(true)
    })

    it('should return false when no field errors', () => {
      const mapped = {
        fields: {},
        form: 'Form error'
      }

      expect(hasFieldErrors(mapped)).toBe(false)
    })
  })

  describe('getAllErrorMessages', () => {
    it('should collect all error messages', () => {
      const mapped = {
        fields: {
          name: ['Name is required'],
          email: ['Invalid email', 'Email taken']
        },
        form: 'Form level error'
      }

      const messages = getAllErrorMessages(mapped)

      expect(messages).toEqual([
        'Name is required',
        'Invalid email',
        'Email taken',
        'Form level error'
      ])
    })

    it('should handle empty fields', () => {
      const mapped = {
        fields: {},
        form: 'Form error'
      }

      const messages = getAllErrorMessages(mapped)

      expect(messages).toEqual(['Form error'])
    })

    it('should handle no form error', () => {
      const mapped = {
        fields: {
          name: ['Name error']
        }
      }

      const messages = getAllErrorMessages(mapped)

      expect(messages).toEqual(['Name error'])
    })

    it('should handle completely empty errors', () => {
      const mapped = {
        fields: {}
      }

      const messages = getAllErrorMessages(mapped)

      expect(messages).toEqual([])
    })
  })
})

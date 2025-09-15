import { describe, expect, it } from 'vitest'
import { selectServerFormError, selectServerResponse } from '../src/index'

describe('selectors', () => {
  describe('selectServerResponse', () => {
    it('should return server response when present', () => {
      const store = {
        _serverResponse: { id: 123, name: 'Test' },
        otherData: 'value',
      }

      const result = selectServerResponse(store)

      expect(result).toEqual({ id: 123, name: 'Test' })
    })

    it('should return undefined when server response not present', () => {
      const store = {
        otherData: 'value',
      }

      const result = selectServerResponse(store)

      expect(result).toBeUndefined()
    })

    it('should return undefined for non-object store', () => {
      expect(selectServerResponse(null)).toBeUndefined()
      expect(selectServerResponse(undefined)).toBeUndefined()
      expect(selectServerResponse('string')).toBeUndefined()
      expect(selectServerResponse(123)).toBeUndefined()
    })

    it('should return typed response', () => {
      interface UserResponse {
        id: number
        name: string
      }

      const store = {
        _serverResponse: { id: 123, name: 'Test' },
      }

      const result = selectServerResponse<UserResponse>(store)

      expect(result).toEqual({ id: 123, name: 'Test' })
      
      if (result) {
        expect(typeof result.id).toBe('number')
        expect(typeof result.name).toBe('string')
      }
    })
  })

  describe('selectServerFormError', () => {
    it('should return server form error when present', () => {
      const store = {
        _serverFormError: 'Form submission failed',
        otherData: 'value',
      }

      const result = selectServerFormError(store)

      expect(result).toBe('Form submission failed')
    })

    it('should return undefined when server form error not present', () => {
      const store = {
        otherData: 'value',
      }

      const result = selectServerFormError(store)

      expect(result).toBeUndefined()
    })

    it('should return undefined for non-object store', () => {
      expect(selectServerFormError(null)).toBeUndefined()
      expect(selectServerFormError(undefined)).toBeUndefined()
      expect(selectServerFormError('string')).toBeUndefined()
      expect(selectServerFormError(123)).toBeUndefined()
    })

    it('should handle non-string server form error', () => {
      const store = {
        _serverFormError: 123,
      }

      const result = selectServerFormError(store)

      expect(result).toBe(123)
    })
  })

  describe('integration with complex store', () => {
    it('should work with complex store structure', () => {
      const store = {
        form: {
          values: { name: 'test' },
          errors: {},
        },
        _serverResponse: { success: true, id: 456 },
        _serverFormError: 'Server validation failed',
        ui: {
          loading: false,
        },
      }

      expect(selectServerResponse(store)).toEqual({ success: true, id: 456 })
      expect(selectServerFormError(store)).toBe('Server validation failed')
    })
  })
})

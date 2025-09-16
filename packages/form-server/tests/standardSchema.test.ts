import { describe, expect, it } from 'vitest'
import { mapServerErrors } from '../src/index'

describe('Standard Schema v1 support', () => {
  it('should handle Standard Schema errors with highest priority', () => {
    const standardSchemaError = {
      issues: [
        {
          path: ['name'],
          message: 'Name is required'
        },
        {
          path: ['email'],
          message: 'Invalid email format'
        }
      ]
    }

    const result = mapServerErrors(standardSchemaError)

    expect(result.fields.name).toEqual(['Name is required'])
    expect(result.fields.email).toEqual(['Invalid email format'])
    expect(result.form).toBeUndefined()
  })

  it('should handle nested path arrays in Standard Schema', () => {
    const standardSchemaError = {
      issues: [
        {
          path: ['user', 'profile', 'age'],
          message: 'Age must be a number'
        }
      ]
    }

    const result = mapServerErrors(standardSchemaError)

    expect(result.fields['user.profile.age']).toEqual(['Age must be a number'])
  })

  it('should prioritize Standard Schema over Zod when both formats are present', () => {
    const mixedError = {
      issues: [
        {
          path: ['name'],
          message: 'Standard Schema error'
        }
      ]
    }

    const result = mapServerErrors(mixedError)

    expect(result.fields.name).toEqual(['Standard Schema error'])
  })

  it('should handle invalid Standard Schema format as generic error', () => {
    const invalidStandardSchema = {
      issues: [
        {
          message: 'Invalid format'
        },
        {
          path: 'invalid-path',
          message: 'Another error'
        }
      ]
    }

    const result = mapServerErrors(invalidStandardSchema, {
      fallbackFormMessage: 'Fallback error'
    })

    expect(result.fields.undefined).toEqual(['Invalid format'])
    expect(result.fields['invalid-path']).toEqual(['Another error'])
  })
})

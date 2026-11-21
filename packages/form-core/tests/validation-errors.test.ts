import { describe, expect, it } from 'vitest'
import {
  isErrorResult,
  isValidationErrorMap,
  parseValidationResult,
} from '../src/validation/results/errors.lib'

describe('parseValidationResult', () => {
  it('returns no stored errors for valid results', () => {
    const validResults: Array<null | undefined | false | Array<never>> = [
      null,
      undefined,
      false,
      [],
    ]

    for (const result of validResults) {
      expect(parseValidationResult(result)).toEqual({
        self: null,
        subfields: null,
      })
      expect(isErrorResult(result)).toBe(false)
    }
  })

  it('normalizes errors owned by the validation boundary', () => {
    const result = ['Required', { message: 'Must be valid' }]

    expect(parseValidationResult(result)).toEqual({
      self: [{ message: 'Required' }, { message: 'Must be valid' }],
      subfields: null,
    })
    expect(isErrorResult(result)).toBe(true)
  })

  it('does not misinterpret an issue with fields metadata as an error map', () => {
    const result = { message: 'Required', fields: {} }

    expect(isValidationErrorMap(result)).toBe(false)
    expect(parseValidationResult(result)).toEqual({
      self: [result],
      subfields: null,
    })
    expect(isErrorResult(result)).toBe(true)
  })

  it('normalizes and prunes error maps', () => {
    const result = {
      form: 'Form is invalid',
      fields: {
        name: 'Name is required',
        age: [],
        email: undefined,
      },
    }

    expect(isValidationErrorMap(result)).toBe(true)
    expect(parseValidationResult(result)).toEqual({
      self: [{ message: 'Form is invalid' }],
      subfields: {
        name: [{ message: 'Name is required' }],
      },
    })
    expect(isErrorResult(result)).toBe(true)
  })

  it('recognizes error maps with additional metadata keys', () => {
    const result = {
      form: 'Form is invalid',
      fields: { name: 'Name is required' },
      source: 'server',
    }

    expect(isValidationErrorMap(result)).toBe(true)
    expect(parseValidationResult(result)).toEqual({
      self: [{ message: 'Form is invalid' }],
      subfields: {
        name: [{ message: 'Name is required' }],
      },
    })
    expect(isErrorResult(result)).toBe(true)
  })

  it('preserves an empty error map without storing an error', () => {
    const result = { fields: {} }
    const resultWithEmptyEntries = {
      form: [],
      fields: {
        name: undefined,
        age: [],
      },
    }

    expect(parseValidationResult(result)).toEqual({
      self: null,
      subfields: {},
    })
    expect(parseValidationResult(resultWithEmptyEntries)).toEqual({
      self: null,
      subfields: {},
    })
    expect(isErrorResult(result)).toBe(false)
    expect(isErrorResult(resultWithEmptyEntries)).toBe(false)
  })
})

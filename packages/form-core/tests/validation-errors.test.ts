import { describe, expect, it, vi } from 'vitest'
import {
  isErrorResult,
  isValidationErrorMap,
  parseValidationResult,
  reconcileRoutedFieldErrors,
} from '../src/validation'
import type { AnyInternalFieldApi } from '../src/FieldApi/FieldApi.lib'

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

describe('reconcileRoutedFieldErrors', () => {
  it('sets errors on already-resolved field refs', () => {
    const field = { name: 'name' } as AnyInternalFieldApi
    const errors = [{ message: 'Name is required' }]
    const setFieldError = vi.fn()
    const result = reconcileRoutedFieldErrors(
      2,
      [[field, errors]],
      undefined,
      setFieldError,
      vi.fn(),
    )

    expect(setFieldError).toHaveBeenCalledWith(field, 2, errors)
    expect(result.fieldRefs).toEqual(new Set([field]))
    expect(result.affectedFields).toEqual(new Set([field]))
  })

  it('reports unchanged refs when no new or old field refs exist', () => {
    const result = reconcileRoutedFieldErrors(
      0,
      [],
      undefined,
      vi.fn(),
      vi.fn(),
    )

    expect(result.didFieldRefsChange).toBe(false)
    expect(result.fieldRefs.size).toBe(0)
    expect(result.affectedFields.size).toBe(0)
  })

  it('reports unchanged refs when the old field ref set is empty', () => {
    const result = reconcileRoutedFieldErrors(
      0,
      [],
      new Set(),
      vi.fn(),
      vi.fn(),
    )

    expect(result.didFieldRefsChange).toBe(false)
  })

  it('clears stale old field refs when no new refs replace them', () => {
    const field = { name: 'name' } as AnyInternalFieldApi
    const clearFieldError = vi.fn()
    const result = reconcileRoutedFieldErrors(
      0,
      [],
      new Set([field]),
      vi.fn(),
      clearFieldError,
    )

    expect(result.didFieldRefsChange).toBe(true)
    expect(result.affectedFields).toEqual(new Set([field]))
    expect(clearFieldError).toHaveBeenCalledWith(field, 0)
  })
})

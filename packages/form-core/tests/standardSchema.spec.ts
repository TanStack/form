import { describe, expect, it } from 'vitest'
import { isStandardSchema } from '../src/standardSchema.lib'
import type { StandardSchemaV1 } from '../src/standardSchema.public'

function getSchema<TOutput>(
  validate: StandardSchemaV1<unknown, TOutput>['~standard']['validate'],
): StandardSchemaV1<unknown, TOutput> {
  return {
    '~standard': {
      version: 1,
      vendor: 'test',
      validate,
    },
  }
}

describe('standard schema validation', () => {
  describe('isStandardSchema', () => {
    it('identifies standard schema objects', () => {
      expect(isStandardSchema(getSchema((value) => ({ value })))).toBe(true)
    })

    it('rejects validator functions and plain objects', () => {
      expect(isStandardSchema(() => null)).toBe(false)
      expect(
        isStandardSchema({ run: () => null } as unknown as StandardSchemaV1),
      ).toBe(false)
    })
  })
})

import { describe, expect, it } from 'vitest'
import { mutateMergeDeep } from '../src/mergeForm'

type TestObject = Record<string, any>

describe('mutateMergeDeep', () => {
  it('should prevent prototype pollution through __proto__', () => {
    const target: TestObject = {}
    const malicious = {
      __proto__: {
        polluted: true,
      },
    }

    mutateMergeDeep(target, malicious)
    expect(({} as TestObject).polluted).toBeUndefined()
    expect((Object.prototype as TestObject).polluted).toBeUndefined()
  })

  it('should prevent prototype pollution through constructor', () => {
    const target: TestObject = {}
    const malicious = {
      constructor: {
        prototype: {
          polluted: true,
        },
      },
    }

    mutateMergeDeep(target, malicious)
    expect(({} as TestObject).polluted).toBeUndefined()
  })

  it('should handle null values correctly', () => {
    const target = { details: null }
    const source = { details: { age: 25 } }

    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ details: { age: 25 } })
  })

  it('should preserve object references when updating nested objects', () => {
    const target: { user: { details: TestObject } } = { user: { details: {} } }
    const source = { user: { details: { name: 'test' } } }

    const originalDetails = target.user.details
    mutateMergeDeep(target, source)
    expect(target.user.details).toBe(originalDetails)
    expect(target.user.details.name).toBe('test')
  })
})

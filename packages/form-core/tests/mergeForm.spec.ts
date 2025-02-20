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

  it('Should merge two objects by mutating', () => {
    const a = { a: 1 }
    const b = { b: 2 }
    mutateMergeDeep(a, b)
    expect(a).toStrictEqual({ a: 1, b: 2 })
  })

  it('Should merge two objects including overwriting with undefined', () => {
    const a = { a: 1 }
    const b = { a: undefined }
    mutateMergeDeep(a, b)
    expect(a).toStrictEqual({ a: undefined })
  })

  it('Should merge two object by overriding arrays', () => {
    const target = { a: [1] }
    const source = { a: [2] }
    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ a: [2] })
  })

  it('Should merge add array element when it does not exist in target', () => {
    const target = { a: [] }
    const source = { a: [2] }
    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ a: [2] })
  })

  it('Should override the target array if source is undefined', () => {
    const target = { a: [2] }
    const source = { a: undefined }
    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ a: undefined })
  })

  it('Should merge update array element when it does not exist in source', () => {
    const target = { a: [2] }
    const source = { a: [] }
    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ a: [] })
  })

  it('Should merge two deeply nested objects', () => {
    const a = { a: { a: 1 } }
    const b = { a: { b: 2 } }
    mutateMergeDeep(a, b)
    expect(a).toStrictEqual({ a: { a: 1, b: 2 } })
  })
})

import { describe, expect, test } from 'vitest'
import { mutateMergeDeep } from '../src/index'

describe('mutateMergeDeep', () => {
  test('Should merge two objects by mutating', () => {
    const a = { a: 1 }
    const b = { b: 2 }
    mutateMergeDeep(a, b)
    expect(a).toStrictEqual({ a: 1, b: 2 })
  })

  test('Should merge two objects including overwriting with undefined', () => {
    const a = { a: 1 }
    const b = { a: undefined }
    mutateMergeDeep(a, b)
    expect(a).toStrictEqual({ a: undefined })
  })

  test('Should merge two object by overriding arrays', () => {
    const target = { a: [1] }
    const source = { a: [2] }
    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ a: [2] })
  })

  test('Should merge add array element when it does not exist in target', () => {
    const target = { a: [] }
    const source = { a: [2] }
    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ a: [2] })
  })

  test('Should override the target array if source is undefined', () => {
    const target = { a: [2] }
    const source = { a: undefined }
    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ a: undefined })
  })

  test('Should merge update array element when it does not exist in source', () => {
    const target = { a: [2] }
    const source = { a: [] }
    mutateMergeDeep(target, source)
    expect(target).toStrictEqual({ a: [] })
  })

  test('Should merge two deeply nested objects', () => {
    const a = { a: { a: 1 } }
    const b = { a: { b: 2 } }
    mutateMergeDeep(a, b)
    expect(a).toStrictEqual({ a: { a: 1, b: 2 } })
  })
})

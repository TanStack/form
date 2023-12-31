import { describe } from 'vitest'
import { mutateMergeDeep } from '../mergeForm'

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

  test('Should merge two object by merging arrays', () => {
    const a = { a: [1] }
    const b = { a: [2] }
    mutateMergeDeep(a, b)
    expect(a).toStrictEqual({ a: [1, 2] })
  })

  test('Should merge two deeply nested objects', () => {
    const a = { a: { a: 1 } }
    const b = { a: { b: 2 } }
    mutateMergeDeep(a, b)
    expect(a).toStrictEqual({ a: { a: 1, b: 2 } })
  })
})

import { bench, describe } from 'vitest'
import { makePathArray } from '../src/utils'

describe('makePathArray', () => {
  bench('array input (fast path, no parsing)', () => {
    makePathArray(['a', 'b', 0, 'c'])
  })

  bench('simple key (no nesting)', () => {
    makePathArray('key')
  })

  bench('uuid key', () => {
    makePathArray('550e8400-e29b-41d4-a716-446655440000')
  })

  bench('dot notation', () => {
    makePathArray('foo.bar.baz')
  })

  bench('mixed dot and bracket notation', () => {
    makePathArray('a[0].b[1]')
  })

  bench('deeply nested mixed path', () => {
    makePathArray('a.b[0][1].c.d[2][3].e')
  })

  bench('numeric string with leading zeros (kept as string)', () => {
    makePathArray('01234')
  })

  bench('numeric string (converted to number)', () => {
    makePathArray('12345')
  })
})

import { describe, expect, it } from 'vitest'
import { nameToFieldNodeSegments } from '../src/FieldApi.internal'

describe('nameToFieldNodeSegments', () => {
  it('splits dot-separated field names', () => {
    expect(nameToFieldNodeSegments('foo.bar')).toEqual(['foo', 'bar'])
  })

  it('splits multiple dot-separated field names', () => {
    expect(nameToFieldNodeSegments('foo.bar.foobar')).toEqual([
      'foo',
      'bar',
      'foobar',
    ])
  })

  it('splits bracket array access into segments', () => {
    expect(nameToFieldNodeSegments('foo[0].bar')).toEqual(['foo', '0', 'bar'])
  })

  it('splits chained bracket access into segments', () => {
    expect(nameToFieldNodeSegments('foo[0][1].bar')).toEqual([
      'foo',
      '0',
      '1',
      'bar',
    ])
  })
})

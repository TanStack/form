import { describe, expect, it } from 'vitest'

import { nameToFieldNodeSegments } from '../../src/internals'

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
    expect(nameToFieldNodeSegments('foo[0].bar')).toEqual(['foo', 0, 'bar'])
  })

  it('splits chained bracket access into segments', () => {
    expect(nameToFieldNodeSegments('foo[0][1].bar')).toEqual([
      'foo',
      0,
      1,
      'bar',
    ])
  })

  it('handles empty string', () => {
    expect(nameToFieldNodeSegments('')).toEqual([])
  })

  it('handles single segment', () => {
    expect(nameToFieldNodeSegments('foo')).toEqual(['foo'])
  })

  it('handles array syntax without dot', () => {
    expect(nameToFieldNodeSegments('foo[0]')).toEqual(['foo', 0])
  })

  it('handles mixed brackets and dots', () => {
    expect(nameToFieldNodeSegments('foo.bar[0].baz')).toEqual([
      'foo',
      'bar',
      0,
      'baz',
    ])
  })

  it('returns a shallow copy of array input', () => {
    // A dev may want to reuse segments for multiple calls, so it's essential
    // that we don't mutate the input array.
    const segments = ['foo', 'bar']
    const result = nameToFieldNodeSegments(segments)
    expect(result).toEqual(segments)
    expect(result).not.toBe(segments)
  })
})

import { describe, expect, it } from 'vitest'
import { nameToFieldNodeSegments } from '../src/utils.lib'

describe('nameToFieldNodeSegments', () => {
  it('returns no segments for the root name', () => {
    const segments = nameToFieldNodeSegments('')

    expect(segments).toEqual([])
  })

  it('splits object field names into segments', () => {
    const topLevel = nameToFieldNodeSegments('foo')
    const nested = nameToFieldNodeSegments('foo.bar')
    const deeplyNested = nameToFieldNodeSegments('foo.bar.foobar')

    expect(topLevel).toEqual(['foo'])
    expect(nested).toEqual(['foo', 'bar'])
    expect(deeplyNested).toEqual(['foo', 'bar', 'foobar'])
  })

  it('keeps array indices numeric in mixed object and array paths', () => {
    const item = nameToFieldNodeSegments('foo[0]')
    const property = nameToFieldNodeSegments('foo[0].bar')
    const nestedArray = nameToFieldNodeSegments('foo.bar[0].baz')

    expect(item).toEqual(['foo', 0])
    expect(property).toEqual(['foo', 0, 'bar'])
    expect(nestedArray).toEqual(['foo', 'bar', 0, 'baz'])
  })

  it('splits consecutive array indices', () => {
    const segments = nameToFieldNodeSegments('foo[0][1].bar')

    expect(segments).toEqual(['foo', 0, 1, 'bar'])
  })

  it('keeps supplied segments reusable after changing a parsed path', () => {
    const supplied = ['items', 0, 'name']
    const firstPath = nameToFieldNodeSegments(supplied)

    firstPath[1] = 1
    const nextPath = nameToFieldNodeSegments(supplied)

    expect(supplied).toEqual(['items', 0, 'name'])
    expect(nextPath).toEqual(['items', 0, 'name'])
  })
})

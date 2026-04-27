import { describe, expect, it } from 'vitest'
import { InternalFormApi, nameToFieldNodeSegments } from '../src/internals'

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

describe('Form Field names', () => {
  it('returns the correct name for a top-level field', () => {
    const form = new InternalFormApi({
      defaultValues: { foo: '' },
    })
    const field = form._getOrCreateFieldApi('foo')
    expect(field.name).toBe('foo')
  })

  it('returns the correct name for nested fields with dot notation', () => {
    const form = new InternalFormApi({
      defaultValues: { foo: { bar: { baz: '' } } },
    })
    const field = form._getOrCreateFieldApi('foo.bar.baz')
    expect(field.name).toBe('foo.bar.baz')
  })

  it('returns the correct name for array fields with bracket notation', () => {
    const form = new InternalFormApi({
      defaultValues: { arr: [''] },
    })
    const field = form._getOrCreateFieldApi('arr[0]')
    expect(field.name).toBe('arr[0]')
  })

  it('returns the correct name for nested array fields', () => {
    const form = new InternalFormApi({
      defaultValues: { arr: [{ nested: '' }] },
    })
    const field = form._getOrCreateFieldApi('arr[0].nested')
    expect(field.name).toBe('arr[0].nested')
  })

  it('returns the correct name for deeply nested array fields', () => {
    const form = new InternalFormApi({
      defaultValues: { foo: { arr: [{ bar: '' }] } },
    })
    const field = form._getOrCreateFieldApi('foo.arr[0].bar')
    expect(field.name).toBe('foo.arr[0].bar')
  })

  it('returns the correct name for chained array access', () => {
    const form = new InternalFormApi({
      defaultValues: { arr: [[['']]] },
    })
    const field = form._getOrCreateFieldApi('arr[0][1][2]')
    expect(field.name).toBe('arr[0][1][2]')
  })

  it('updates child fields when the parent name changes', () => {
    const form = new InternalFormApi({
      defaultValues: { arr: [{ foo: '' }, { bar: '' }] },
    })
    const field = form._getOrCreateFieldApi('arr[0]')
    const subField = form._getOrCreateFieldApi('arr[0].bar')

    expect(field.name).toBe('arr[0]')
    expect(subField.name).toBe('arr[0].bar')

    field._segment = 1

    expect(field.name).toBe('arr[1]')
    expect(subField.name).toBe('arr[1].bar')
  })

  it('builds name correctly from parent chain', () => {
    const form = new InternalFormApi({
      defaultValues: { a: { b: { c: '' } } },
    })
    const fieldC = form._getOrCreateFieldApi('a.b.c')

    expect(fieldC.name).toBe('a.b.c')
    expect(fieldC._parent?.name).toBe('a.b')
    expect(fieldC._parent?._parent?.name).toBe('a')
    expect(fieldC._parent?._parent?._parent?.name).toBe('')
  })

  it('uses bracket notation for array parent segments', () => {
    const form = new InternalFormApi({
      defaultValues: { arr: [{ nested: '' }] },
    })
    const field = form._getOrCreateFieldApi('arr[0].nested')

    expect(field.name).toBe('arr[0].nested')
    expect(field._parent?.name).toBe('arr[0]')
  })

  it('allows top-level arrays', () => {
    const form = new InternalFormApi({
      defaultValues: [{ name: '' }],
    })

    const field = form._getOrCreateFieldApi('[0].name')
    expect(field.name).toBe('[0].name')
  })
})

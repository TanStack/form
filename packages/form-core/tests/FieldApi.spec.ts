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

describe('Form Fields', () => {
  it('has the correct name for a field', () => {
    const form = new InternalFormApi({
      defaultValues: { name: '', nested: { name: '' } },
    })

    expect(form._requestField('name').name).toBe('name')
    expect(form._requestField('nested.name').name).toBe('nested.name')
  })
})

import { describe, expect, it } from 'vitest'
import { InternalFormApi } from '../../src/FormApi.lib'

describe('Form Field names', () => {
  it('returns the correct name for a top-level field', () => {
    const form = new InternalFormApi({
      defaultValues: { foo: '' },
    })
    const field = form._getOrCreateFieldApi({ name: 'foo' })
    expect(field.name).toBe('foo')
  })

  it('returns the correct name for nested fields with dot notation', () => {
    const form = new InternalFormApi({
      defaultValues: { foo: { bar: { baz: '' } } },
    })
    const field = form._getOrCreateFieldApi({ name: 'foo.bar.baz' })
    expect(field.name).toBe('foo.bar.baz')
  })

  it('returns the correct name for array fields with bracket notation', () => {
    const form = new InternalFormApi({
      defaultValues: { arr: [''] },
    })
    const field = form._getOrCreateFieldApi({ name: 'arr[0]' })
    expect(field.name).toBe('arr[0]')
  })

  it('returns the correct name for nested array fields', () => {
    const form = new InternalFormApi({
      defaultValues: { arr: [{ nested: '' }] },
    })
    const field = form._getOrCreateFieldApi({ name: 'arr[0].nested' })
    expect(field.name).toBe('arr[0].nested')
  })

  it('returns the correct name for deeply nested array fields', () => {
    const form = new InternalFormApi({
      defaultValues: { foo: { arr: [{ bar: '' }] } },
    })
    const field = form._getOrCreateFieldApi({ name: 'foo.arr[0].bar' })
    expect(field.name).toBe('foo.arr[0].bar')
  })

  it('returns the correct name for chained array access', () => {
    const form = new InternalFormApi({
      defaultValues: { arr: [[['']]] },
    })
    const field = form._getOrCreateFieldApi({ name: 'arr[0][1][2]' })
    expect(field.name).toBe('arr[0][1][2]')
  })

  it('updates child fields when the parent name changes', () => {
    const form = new InternalFormApi({
      defaultValues: { arr: [{ foo: '' }, { bar: '' }] },
    })
    const field = form._getOrCreateFieldApi({ name: 'arr[0]' })
    const subField = form._getOrCreateFieldApi({ name: 'arr[0].bar' })

    expect(field.name).toBe('arr[0]')
    expect(subField.name).toBe('arr[0].bar')

    field._moveTo(1)

    expect(field.name).toBe('arr[1]')
    expect(subField.name).toBe('arr[1].bar')
  })

  it('builds name correctly from parent chain', () => {
    const form = new InternalFormApi({
      defaultValues: { a: { b: { c: '' } } },
    })
    const fieldC = form._getOrCreateFieldApi({ name: 'a.b.c' })

    expect(fieldC.name).toBe('a.b.c')
    expect(fieldC._parent.name).toBe('a.b')
    // Root node doesn't have parent, so it complains about the types
    expect((fieldC._parent as any)._parent.name).toBe('a')
    expect((fieldC._parent as any)._parent._parent.name).toBe('')
  })

  it('uses bracket notation for array parent segments', () => {
    const form = new InternalFormApi({
      defaultValues: { arr: [{ nested: '' }] },
    })
    const field = form._getOrCreateFieldApi({ name: 'arr[0].nested' })

    expect(field.name).toBe('arr[0].nested')
    expect(field._parent.name).toBe('arr[0]')
  })

  it('allows top-level arrays', () => {
    const form = new InternalFormApi({
      defaultValues: [{ name: '' }],
    })

    const field = form._getOrCreateFieldApi({ name: '[0].name' })
    expect(field.name).toBe('[0].name')
  })

  it('updates field lookup after form.swapFieldValues', () => {
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })

    const fieldAt0Before = form._getOrCreateFieldApi({ name: 'items[0]' })
    const fieldAt1Before = form._getOrCreateFieldApi({ name: 'items[1]' })

    expect(fieldAt0Before.name).toBe('items[0]')
    expect(fieldAt1Before.name).toBe('items[1]')

    form.swapFieldValues('items', 0, 1)

    const fieldAt0After = form._getOrCreateFieldApi({ name: 'items[0]' })
    const fieldAt1After = form._getOrCreateFieldApi({ name: 'items[1]' })

    expect(fieldAt0After).toBe(fieldAt1Before)
    expect(fieldAt0After.name).toBe('items[0]')

    expect(fieldAt1After).toBe(fieldAt0Before)
    expect(fieldAt1After.name).toBe('items[1]')
  })
})

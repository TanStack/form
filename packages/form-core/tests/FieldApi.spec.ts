import { describe, expect, it, vi } from 'vitest'

import {
  InternalFieldApi,
  InternalFormApi,
  defaultFieldMeta,
  nameToFieldNodeSegments,
} from '../src/internals'

describe('FieldApi', () => {
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
      const field = form._getOrCreateFieldApi('foo', undefined)
      expect(field.name).toBe('foo')
    })

    it('returns the correct name for nested fields with dot notation', () => {
      const form = new InternalFormApi({
        defaultValues: { foo: { bar: { baz: '' } } },
      })
      const field = form._getOrCreateFieldApi('foo.bar.baz', undefined)
      expect(field.name).toBe('foo.bar.baz')
    })

    it('returns the correct name for array fields with bracket notation', () => {
      const form = new InternalFormApi({
        defaultValues: { arr: [''] },
      })
      const field = form._getOrCreateFieldApi('arr[0]', undefined)
      expect(field.name).toBe('arr[0]')
    })

    it('returns the correct name for nested array fields', () => {
      const form = new InternalFormApi({
        defaultValues: { arr: [{ nested: '' }] },
      })
      const field = form._getOrCreateFieldApi('arr[0].nested', undefined)
      expect(field.name).toBe('arr[0].nested')
    })

    it('returns the correct name for deeply nested array fields', () => {
      const form = new InternalFormApi({
        defaultValues: { foo: { arr: [{ bar: '' }] } },
      })
      const field = form._getOrCreateFieldApi('foo.arr[0].bar', undefined)
      expect(field.name).toBe('foo.arr[0].bar')
    })

    it('returns the correct name for chained array access', () => {
      const form = new InternalFormApi({
        defaultValues: { arr: [[['']]] },
      })
      const field = form._getOrCreateFieldApi('arr[0][1][2]', undefined)
      expect(field.name).toBe('arr[0][1][2]')
    })

    it('updates child fields when the parent name changes', () => {
      const form = new InternalFormApi({
        defaultValues: { arr: [{ foo: '' }, { bar: '' }] },
      })
      const field = form._getOrCreateFieldApi('arr[0]', undefined)
      const subField = form._getOrCreateFieldApi('arr[0].bar', undefined)

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
      const fieldC = form._getOrCreateFieldApi('a.b.c', undefined)

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
      const field = form._getOrCreateFieldApi('arr[0].nested', undefined)

      expect(field.name).toBe('arr[0].nested')
      expect(field._parent.name).toBe('arr[0]')
    })

    it('allows top-level arrays', () => {
      const form = new InternalFormApi({
        defaultValues: [{ name: '' }],
      })

      const field = form._getOrCreateFieldApi('[0].name', undefined)
      expect(field.name).toBe('[0].name')
    })

    it('updates field lookup after form.swapFieldValues', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })

      const fieldAt0Before = form._getOrCreateFieldApi('items[0]', undefined)
      const fieldAt1Before = form._getOrCreateFieldApi('items[1]', undefined)

      expect(fieldAt0Before.name).toBe('items[0]')
      expect(fieldAt1Before.name).toBe('items[1]')

      form.swapFieldValues('items', 0, 1)

      const fieldAt0After = form._getOrCreateFieldApi('items[0]', undefined)
      const fieldAt1After = form._getOrCreateFieldApi('items[1]', undefined)

      expect(fieldAt0After).toBe(fieldAt1Before)
      expect(fieldAt0After.name).toBe('items[0]')

      expect(fieldAt1After).toBe(fieldAt0Before)
      expect(fieldAt1After.name).toBe('items[1]')
    })
  })

  describe('handleChange', () => {
    it('updates the field value', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name', undefined)
      field.handleChange('Alice')
      expect(field.value).toBe('Alice')
    })

    it('accepts an updater function', () => {
      const form = new InternalFormApi({ defaultValues: { count: 1 } })
      const field = form._getOrCreateFieldApi('count', undefined)
      field.handleChange((prev: number) => prev + 1)
      expect(field.value).toBe(2)
    })

    it('marks the field as dirty and touched by default', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name', undefined)
      field.handleChange('Alice')
      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })

    it('respects markAsDirty: false', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name', undefined)
      field.handleChange('Alice', { markAsDirty: false })
      expect(field.meta.isDirty).toBe(false)
    })

    it('respects markAsTouched: false', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name', undefined)
      field.handleChange('Alice', { markAsTouched: false })
      expect(field.meta.isTouched).toBe(false)
    })
  })

  describe('pushValue', () => {
    it('appends a value to an array field', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a'] } })
      const field = form._getOrCreateFieldApi('items', undefined)
      field.pushValue('b')
      expect(field.value).toEqual(['a', 'b'])
    })

    it('marks the field as dirty and touched', () => {
      const form = new InternalFormApi({
        defaultValues: { items: [] as Array<string> },
      })
      const field = form._getOrCreateFieldApi('items', undefined)
      field.pushValue('a')
      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name', undefined)
      field.pushValue('x')
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })
  })

  describe('insertFieldValue', () => {
    it('inserts a value at the specified index', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field = form._getOrCreateFieldApi('items', undefined)
      field.insertValue(1, 'x')
      expect(field.value).toEqual(['a', 'x', 'b'])
      field.insertValue(0, 'y')
      expect(field.value).toEqual(['y', 'a', 'x', 'b'])
      field.insertValue(3, 'z')
      expect(field.value).toEqual(['y', 'a', 'x', 'z', 'b'])
    })

    it('inserts a value in an empty array', () => {
      const form = new InternalFormApi({
        defaultValues: { items: [] as Array<string> },
      })
      const field = form._getOrCreateFieldApi('items', undefined)
      field.insertValue(0, 'x')
      expect(field.value).toEqual(['x'])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name', undefined)
      field.insertValue(0, 'x')
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('warns when index is negative', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field = form._getOrCreateFieldApi('items', undefined)
      field.insertValue(-1, 'x')
      expect(warn).toHaveBeenCalled()
      expect(form.getFieldValue('items')).toEqual(['a', 'b'])
      warn.mockRestore()
    })

    it('warns when index is out of bounds', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field = form._getOrCreateFieldApi('items', undefined)
      field.insertValue(3, 'x')
      expect(warn).toHaveBeenCalled()
      expect(form.getFieldValue('items')).toEqual(['a', 'b'])
      warn.mockRestore()
    })

    it('shifts child field segments after insert', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const arrayField = form._getOrCreateFieldApi('items', undefined)
      const field0 = form._getOrCreateFieldApi('items[0]', undefined)
      const field1 = form._getOrCreateFieldApi('items[1]', undefined)
      const field2 = form._getOrCreateFieldApi('items[2]', undefined)
      arrayField.insertValue(1, 'x')
      expect(field0._segment).toBe(0)
      expect(field1._segment).toBe(2)
      expect(field2._segment).toBe(3)

      expect(form._getOrCreateFieldApi('items[0]', undefined)).toBe(field0)
      expect(form._getOrCreateFieldApi('items[1]', undefined)).not.toBe(field1)
      expect(form._getOrCreateFieldApi('items[2]', undefined)).toBe(field1)
      expect(form._getOrCreateFieldApi('items[3]', undefined)).toBe(field2)
    })

    it("updates the array field's meta", () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b'] },
      })
      const field = form._getOrCreateFieldApi('items', undefined)
      field.insertValue(1, 'x')
      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })
  })

  describe('clearValues', () => {
    it('empties an array field', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const field = form._getOrCreateFieldApi('items', undefined)
      field.clearValues()
      expect(field.value).toEqual([])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name', undefined)
      field.clearValues()
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('kills child fields', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const arrayField = form._getOrCreateFieldApi('items', undefined)
      form._getOrCreateFieldApi('items[0]', undefined)
      form._getOrCreateFieldApi('items[1]', undefined)

      arrayField.clearValues()

      expect(form._tryGetFieldApi('items[0]')).toBeNull()
      expect(form._tryGetFieldApi('items[1]')).toBeNull()
      expect(arrayField._children).toEqual([])
    })
  })

  describe('swapValues', () => {
    it('swaps two elements in an array field', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const field = form._getOrCreateFieldApi('items', undefined)
      field.swapValues(0, 2)
      expect(field.value).toEqual(['c', 'b', 'a'])
    })

    it('swaps child field segments', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field0 = form._getOrCreateFieldApi('items[0]', undefined)
      const field1 = form._getOrCreateFieldApi('items[1]', undefined)
      const arrayField = form._getOrCreateFieldApi('items', undefined)
      arrayField.swapValues(0, 1)
      expect(field0._segment).toBe(1)
      expect(field1._segment).toBe(0)
    })

    it('does nothing when indexA === indexB', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field = form._getOrCreateFieldApi('items', undefined)
      field.swapValues(0, 0)
      expect(field.value).toEqual(['a', 'b'])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name', undefined)
      field.swapValues(0, 1)
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })
  })

  describe('field meta derived properties', () => {
    it('starts with defaultFieldMeta values', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi('x', undefined)
      expect(field.meta).toMatchObject(defaultFieldMeta)
    })

    it('isPristine becomes false after a change', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi('x', undefined)
      field.handleChange('new')
      expect(field.meta.isPristine).toBe(false)
    })

    it('isValid is true and isInvalid is false when there are no errors', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi('x', undefined)
      expect(field.meta.isValid).toBe(true)
      expect(field.meta.isInvalid).toBe(false)
    })
  })

  describe('dirty/touched propagation', () => {
    it('marks parent fields as dirty when a child changes', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi('a', undefined)
      const child = form._getOrCreateFieldApi('a.b', undefined)
      child.handleChange('new')
      expect(parent.meta.isDirty).toBe(true)
    })

    it('marks parent fields as touched when a child changes', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi('a', undefined)
      const child = form._getOrCreateFieldApi('a.b', undefined)
      child.handleChange('new')
      expect(parent.meta.isTouched).toBe(true)
    })

    it('does not mark parent as dirty when markAsDirty is false', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi('a', undefined)
      const child = form._getOrCreateFieldApi('a.b', undefined)
      child.handleChange('new', { markAsDirty: false })
      expect(parent.meta.isDirty).toBe(false)
    })

    it('propagates dirtiness through multiple levels', () => {
      const form = new InternalFormApi({
        defaultValues: { a: { b: { c: '' } } },
      })
      const grandparent = form._getOrCreateFieldApi('a', undefined)
      const parent = form._getOrCreateFieldApi('a.b', undefined)
      const child = form._getOrCreateFieldApi('a.b.c', undefined)
      child.handleChange('new')
      expect(parent.meta.isDirty).toBe(true)
      expect(grandparent.meta.isDirty).toBe(true)
    })
  })

  describe('_setChild type transitions', () => {
    it('transitions from leaf to object when a string child is added', () => {
      const form = new InternalFormApi({ defaultValues: { foo: { bar: '' } } })
      const field = form._getOrCreateFieldApi('foo', undefined)
      expect(field._isLeaf).toBe(true)
      form._getOrCreateFieldApi('foo.bar', undefined)
      expect(field._isLeaf).toBe(false)
      expect(field._isArray).toBe(false)
      expect(field._type).toBe('object')
    })

    it('transitions from leaf to array when a numeric child is added', () => {
      const form = new InternalFormApi({ defaultValues: { arr: [''] } })
      const field = form._getOrCreateFieldApi('arr', undefined)
      expect(field._isLeaf).toBe(true)
      form._getOrCreateFieldApi('arr[0]', undefined)
      expect(field._isArray).toBe(true)
      expect(field._type).toBe('array')
    })

    it('warns when adding a string accessor to an array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({
        defaultValues: { arr: [] as Array<any> },
      })
      const arrField = form._getOrCreateFieldApi('arr', undefined)
      form._getOrCreateFieldApi('arr[0]', undefined)

      const strChild = new InternalFieldApi({
        segment: 'bad',
        parent: arrField,
        form: arrField.form,
      })
      arrField._setChild(strChild)

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('string accessor'),
      )
      warn.mockRestore()
    })

    it('warns when adding a numeric accessor to an object field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { obj: { a: '' } } })
      const objField = form._getOrCreateFieldApi('obj', undefined)
      form._getOrCreateFieldApi('obj.a', undefined)

      const numChild = new InternalFieldApi({
        segment: 0,
        parent: objField,
        form: objField.form,
      })
      objField._setChild(numChild)

      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('numeric accessor'),
      )
      warn.mockRestore()
    })
  })

  describe('Field Meta', () => {
    it('returns default meta for nested fields', () => {
      const form = new InternalFormApi({
        defaultValues: { foo: { bar: '' } },
      })
      const field = form._getOrCreateFieldApi('foo.bar', undefined)
      expect(field.meta).toEqual(defaultFieldMeta)
    })

    it('updates meta via handleChange', () => {
      const form = new InternalFormApi({
        defaultValues: { foo: '' },
      })
      const field = form._getOrCreateFieldApi('foo', undefined)
      expect(field.meta.isDirty).toBe(false)
      expect(field.meta.isTouched).toBe(false)

      field.handleChange('bar')

      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
      expect(field.meta.isPristine).toBe(false)
    })

    it('computes isPristine from isDirty', () => {
      const form = new InternalFormApi({
        defaultValues: { foo: '' },
      })
      const field = form._getOrCreateFieldApi('foo', undefined)

      expect(field.meta.isPristine).toBe(true)
      expect(field.meta.isDirty).toBe(false)

      field.handleChange('bar')

      expect(field.meta.isPristine).toBe(false)
      expect(field.meta.isDirty).toBe(true)
    })

    it('updates meta for array fields when using pushValue', () => {
      const form = new InternalFormApi({
        defaultValues: { arr: ['a'] },
      })
      const field = form._getOrCreateFieldApi('arr', undefined)

      expect(field.meta.isDirty).toBe(false)

      field.pushValue('b')

      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })

    it('updates meta for array fields when using insertValue', () => {
      const form = new InternalFormApi({
        defaultValues: { arr: ['a', 'b'] },
      })
      const field = form._getOrCreateFieldApi('arr', undefined)

      expect(field.meta.isDirty).toBe(false)

      field.insertValue(1, 'x')

      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })

    it('updates meta for array fields when using swapValues', () => {
      const form = new InternalFormApi({
        defaultValues: { arr: ['a', 'b'] },
      })
      const field = form._getOrCreateFieldApi('arr', undefined)

      expect(field.meta.isDirty).toBe(false)

      field.swapValues(0, 1)

      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })
  })

  describe('_isMounted and store', () => {
    it('is false before the store is accessed', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi('x', undefined)
      expect(field._isMounted).toBe(false)
    })

    it('is true after the store is accessed', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi('x', undefined)
      void field.store
      expect(field._isMounted).toBe(true)
    })

    it('store returns consistent state', () => {
      const form = new InternalFormApi({ defaultValues: { x: 'hello' } })
      const field = form._getOrCreateFieldApi('x', undefined)
      const state = field.store.get()
      expect(state.value).toBe('hello')
      expect(state.meta).toMatchObject(defaultFieldMeta)
    })
  })

  describe('_kill', () => {
    it('unmounts the field store', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi('x', undefined)
      void field.store
      expect(field._isMounted).toBe(true)
      field._kill()
      expect(field._isMounted).toBe(false)
    })

    it('also kills child fields', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi('a', undefined)
      const child = form._getOrCreateFieldApi('a.b', undefined)
      void parent.store
      void child.store
      parent._kill()
      expect(parent._isMounted).toBe(false)
      expect(child._isMounted).toBe(false)
    })
  })
})

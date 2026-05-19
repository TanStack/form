import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('form - field array methods', () => {
  describe('swapFieldValues', () => {
    it('swaps two elements in an array field', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      form.swapFieldValues('items', 0, 2)
      expect(form.getFieldValue('items')).toEqual(['c', 'b', 'a'])
    })

    it('does nothing when indexA === indexB', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      form.swapFieldValues('items', 1, 1)
      expect(form.getFieldValue('items')).toEqual(['a', 'b'])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })

      form.swapFieldValues('name', 0, 1)
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('updates field segments after swap', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field0 = form._getOrCreateFieldApi({ name: 'items[0]' })
      const field1 = form._getOrCreateFieldApi({ name: 'items[1]' })
      form.swapFieldValues('items', 0, 1)
      expect(field0._segment).toBe(1)
      expect(field1._segment).toBe(0)
    })
  })

  describe('pushFieldValue', () => {
    it('appends a value to an array field', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      form.pushFieldValue('items', 'c')
      expect(form.getFieldValue('items')).toEqual(['a', 'b', 'c'])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      form.pushFieldValue('name', 'x', { fieldApiOverride: field })
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })
  })

  describe('insertFieldValue', () => {
    it('inserts a value at the specified index', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      form.insertFieldValue('items', 1, 'x')
      expect(form.getFieldValue('items')).toEqual(['a', 'x', 'b'])
      form.insertFieldValue('items', 0, 'y')
      expect(form.getFieldValue('items')).toEqual(['y', 'a', 'x', 'b'])
      form.insertFieldValue('items', 3, 'z')
      expect(form.getFieldValue('items')).toEqual(['y', 'a', 'x', 'z', 'b'])
    })

    it('inserts a value in an empty array', () => {
      const form = new InternalFormApi({
        defaultValues: { items: [] as Array<string> },
      })
      form.insertFieldValue('items', 0, 'x')
      expect(form.getFieldValue('items')).toEqual(['x'])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      form.insertFieldValue('name', 0, 'x')
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('warns when index is negative', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      form.insertFieldValue('items', -1, 'x')
      expect(warn).toHaveBeenCalled()
      expect(form.getFieldValue('items')).toEqual(['a', 'b'])
      warn.mockRestore()
    })

    it('warns when index is out of bounds', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      form.insertFieldValue('items', 3, 'x')
      expect(warn).toHaveBeenCalled()
      expect(form.getFieldValue('items')).toEqual(['a', 'b'])
      warn.mockRestore()
    })

    it('shifts child field segments after insert', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const field0 = form._getOrCreateFieldApi({ name: 'items[0]' })
      const field1 = form._getOrCreateFieldApi({ name: 'items[1]' })
      const field2 = form._getOrCreateFieldApi({ name: 'items[2]' })
      form.insertFieldValue('items', 1, 'x')
      expect(field0._segment).toBe(0)
      expect(field1._segment).toBe(2)
      expect(field2._segment).toBe(3)

      expect(form._getOrCreateFieldApi({ name: 'items[0]' })).toBe(field0)
      expect(form._getOrCreateFieldApi({ name: 'items[1]' })).not.toBe(field1)
      expect(form._getOrCreateFieldApi({ name: 'items[2]' })).toBe(field1)
      expect(form._getOrCreateFieldApi({ name: 'items[3]' })).toBe(field2)
    })

    it("updates the array field's meta", () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b'] },
      })
      const field = form._getOrCreateFieldApi({ name: 'items' })
      form.insertFieldValue('items', 1, 'x')
      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })
  })

  describe('clearFieldValues', () => {
    it('empties an array field', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      form.clearFieldValues('items')
      expect(form.getFieldValue('items')).toEqual([])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      form.clearFieldValues('name')
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('kills child fields', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const arrayField = form._getOrCreateFieldApi({ name: 'items' })
      form._getOrCreateFieldApi({ name: 'items[0]' })
      form._getOrCreateFieldApi({ name: 'items[1]' })

      form.clearFieldValues('items')

      expect(form._tryGetFieldApi('items[0]')).toBeNull()
      expect(form._tryGetFieldApi('items[1]')).toBeNull()
      expect(arrayField._children).toEqual([])
    })
  })

  describe('removeFieldValue', () => {
    it('removes an element at the specified index', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c', 'd', 'e', 'f'] },
      })
      form.removeFieldValue('items', 1)
      expect(form.getFieldValue('items')).toEqual(['a', 'c', 'd', 'e', 'f'])
      form.removeFieldValue('items', 0)
      expect(form.getFieldValue('items')).toEqual(['c', 'd', 'e', 'f'])
      form.removeFieldValue('items', 3)
      expect(form.getFieldValue('items')).toEqual(['c', 'd', 'e'])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      form.removeFieldValue('name', 0)
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('warns when index is negative', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      form.removeFieldValue('items', -1)
      expect(warn).toHaveBeenCalled()
      expect(form.getFieldValue('items')).toEqual(['a', 'b'])
      warn.mockRestore()
    })

    it('warns when index is out of bounds', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      form.removeFieldValue('items', 2)
      expect(warn).toHaveBeenCalled()
      expect(form.getFieldValue('items')).toEqual(['a', 'b'])
      warn.mockRestore()
    })

    it('kills the removed child field and shifts remaining children', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const field0 = form._getOrCreateFieldApi({ name: 'items[0]' })
      form._getOrCreateFieldApi({ name: 'items[1]' })
      const field2 = form._getOrCreateFieldApi({ name: 'items[2]' })

      form.removeFieldValue('items', 1)

      expect(form._tryGetFieldApi('items[0]')).toBe(field0)
      expect(form._tryGetFieldApi('items[1]')).toBe(field2)
      expect(form._tryGetFieldApi('items[2]')).toBeNull()
      expect(field0._segment).toBe(0)
      expect(field2._segment).toBe(1)
    })
  })

  describe('filterFieldValues', () => {
    it('filters array elements based on predicate', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c', 'd'] },
      })
      form.filterFieldValues('items', (value) => value !== 'b' && value !== 'd')
      expect(form.getFieldValue('items')).toEqual(['a', 'c'])
    })

    it('filters with index-aware predicate', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c', 'd'] },
      })
      form.filterFieldValues('items', (_, index) => index % 2 === 0)
      expect(form.getFieldValue('items')).toEqual(['a', 'c'])
    })

    it('filters with array-aware predicate', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      form.filterFieldValues('items', (_, index, array) => {
        return index === array.length - 1
      })
      expect(form.getFieldValue('items')).toEqual(['c'])
    })

    it('uses thisArg when provided', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const thisObj = { threshold: 1 }
      form.filterFieldValues(
        'items',
        function (_, index) {
          // @ts-expect-error - Who tf uses thisArg anyways
          return index >= this.threshold
        },
        { thisArg: thisObj },
      )
      expect(form.getFieldValue('items')).toEqual(['b', 'c'])
    })

    it('filters out all elements', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      form.filterFieldValues('items', () => false)
      expect(form.getFieldValue('items')).toEqual([])
    })

    it('keeps all elements when predicate always returns true', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      form.filterFieldValues('items', () => true)
      expect(form.getFieldValue('items')).toEqual(['a', 'b', 'c'])
    })

    it('filters an empty array', () => {
      const form = new InternalFormApi({
        defaultValues: { items: [] as Array<string> },
      })
      form.filterFieldValues('items', () => true)
      expect(form.getFieldValue('items')).toEqual([])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      form.filterFieldValues('name', () => true)
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('reorganizes child field segments after filtering', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c', 'd'] },
      })
      const field0 = form._getOrCreateFieldApi({ name: 'items[0]' })
      form._getOrCreateFieldApi({ name: 'items[1]' })
      const field2 = form._getOrCreateFieldApi({ name: 'items[2]' })
      form._getOrCreateFieldApi({ name: 'items[3]' })

      // Keep only indices 0 and 2
      form.filterFieldValues('items', (_, index) => index === 0 || index === 2)

      expect(field0._segment).toBe(0)
      expect(field2._segment).toBe(1)
      expect(form._tryGetFieldApi('items[0]')).toBe(field0)
      expect(form._tryGetFieldApi('items[1]')).toBe(field2)
      expect(form._tryGetFieldApi('items[2]')).toBeNull()
      expect(form._tryGetFieldApi('items[3]')).toBeNull()
    })

    it('kills removed child fields', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })

      const field0 = form._getOrCreateFieldApi({ name: 'items[0]' })
      form._getOrCreateFieldApi({ name: 'items[1]' })
      const field2 = form._getOrCreateFieldApi({ name: 'items[2]' })

      form.filterFieldValues('items', (_, index) => index !== 1)

      expect(form._tryGetFieldApi('items[0]')).toBe(field0)
      expect(form._tryGetFieldApi('items[1]')).toBe(field2)
    })

    it('updates array field meta when filtered', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const field = form._getOrCreateFieldApi({ name: 'items' })
      form.filterFieldValues('items', () => true)
      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })

    it('does not set value when no elements are filtered out', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })

      const originalArray = form.getFieldValue('items')
      form.filterFieldValues('items', () => true)
      expect(form.getFieldValue('items')).toBe(originalArray)
    })

    it('handles complex objects in array', () => {
      const form = new InternalFormApi({
        defaultValues: {
          items: [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 },
            { name: 'Charlie', age: 35 },
          ],
        },
      })
      form.filterFieldValues('items', (person: any) => person.age > 28)
      expect(form.getFieldValue('items')).toEqual([
        { name: 'Alice', age: 30 },
        { name: 'Charlie', age: 35 },
      ])
    })
  })
})

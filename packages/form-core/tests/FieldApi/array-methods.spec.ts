import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi.lib'

describe('field - array methods', () => {
  describe('pushValue', () => {
    it('appends a value to an array field', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a'] } })
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.pushValue('b')
      expect(field.value).toEqual(['a', 'b'])
    })

    it('marks the field as dirty and touched', () => {
      const form = new InternalFormApi({
        defaultValues: { items: [] as Array<string> },
      })
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.pushValue('a')
      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field.pushValue('x')
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })
  })

  describe('insertFieldValue', () => {
    it('inserts a value at the specified index', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field = form._getOrCreateFieldApi({ name: 'items' })
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
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.insertValue(0, 'x')
      expect(field.value).toEqual(['x'])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field.insertValue(0, 'x')
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('warns when index is negative', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.insertValue(-1, 'x')
      expect(warn).toHaveBeenCalled()
      expect(form.getFieldValue('items')).toEqual(['a', 'b'])
      warn.mockRestore()
    })

    it('warns when index is out of bounds', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.insertValue(3, 'x')
      expect(warn).toHaveBeenCalled()
      expect(form.getFieldValue('items')).toEqual(['a', 'b'])
      warn.mockRestore()
    })

    it('shifts child field segments after insert', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const arrayField = form._getOrCreateFieldApi({ name: 'items' })
      const field0 = form._getOrCreateFieldApi({ name: 'items[0]' })
      const field1 = form._getOrCreateFieldApi({ name: 'items[1]' })
      const field2 = form._getOrCreateFieldApi({ name: 'items[2]' })
      arrayField.insertValue(1, 'x')
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
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.clearValues()
      expect(field.value).toEqual([])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field.clearValues()
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('kills child fields', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const arrayField = form._getOrCreateFieldApi({ name: 'items' })
      form._getOrCreateFieldApi({ name: 'items[0]' })
      form._getOrCreateFieldApi({ name: 'items[1]' })

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
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.swapValues(0, 2)
      expect(field.value).toEqual(['c', 'b', 'a'])
    })

    it('swaps child field segments', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field0 = form._getOrCreateFieldApi({ name: 'items[0]' })
      const field1 = form._getOrCreateFieldApi({ name: 'items[1]' })
      const arrayField = form._getOrCreateFieldApi({ name: 'items' })
      arrayField.swapValues(0, 1)
      expect(field0._segment).toBe(1)
      expect(field1._segment).toBe(0)
    })

    it('does nothing when indexA === indexB', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.swapValues(0, 0)
      expect(field.value).toEqual(['a', 'b'])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field.swapValues(0, 1)
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })
  })

  describe('removeValue', () => {
    it('removes an element at the specified index', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c', 'd', 'e', 'f'] },
      })
      const field = form._getOrCreateFieldApi({ name: 'items' })

      field.removeValue(1)
      expect(field.value).toEqual(['a', 'c', 'd', 'e', 'f'])
      field.removeValue(0)
      expect(field.value).toEqual(['c', 'd', 'e', 'f'])
      field.removeValue(3)
      expect(field.value).toEqual(['c', 'd', 'e'])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })

      field.removeValue(0)
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('warns when index is negative', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field = form._getOrCreateFieldApi({ name: 'items' })

      field.removeValue(-1)
      expect(warn).toHaveBeenCalled()
      expect(field.value).toEqual(['a', 'b'])
      warn.mockRestore()
    })

    it('warns when index is out of bounds', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field = form._getOrCreateFieldApi({ name: 'items' })

      field.removeValue(2)
      expect(warn).toHaveBeenCalled()
      expect(field.value).toEqual(['a', 'b'])
      warn.mockRestore()
    })

    it('kills the removed child field and shifts remaining children', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const arrayField = form._getOrCreateFieldApi({ name: 'items' })

      const field0 = form._getOrCreateFieldApi({ name: 'items[0]' })
      form._getOrCreateFieldApi({ name: 'items[1]' })
      const field2 = form._getOrCreateFieldApi({ name: 'items[2]' })

      arrayField.removeValue(1)

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
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.filterValues((value) => value !== 'b' && value !== 'd')
      expect(form.getFieldValue('items')).toEqual(['a', 'c'])
    })

    it('filters with index-aware predicate', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c', 'd'] },
      })
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.filterValues((_, index) => index % 2 === 0)
      expect(form.getFieldValue('items')).toEqual(['a', 'c'])
    })

    it('filters with array-aware predicate', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.filterValues((_, index, array) => {
        return index === array.length - 1
      })
      expect(form.getFieldValue('items')).toEqual(['c'])
    })

    it('uses thisArg when provided', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const field = form._getOrCreateFieldApi({ name: 'items' })
      const thisObj = { threshold: 1 }
      field.filterValues(
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
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.filterValues(() => false)
      expect(form.getFieldValue('items')).toEqual([])
    })

    it('keeps all elements when predicate always returns true', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.filterValues(() => true)
      expect(form.getFieldValue('items')).toEqual(['a', 'b', 'c'])
    })

    it('filters an empty array', () => {
      const form = new InternalFormApi({
        defaultValues: { items: [] as Array<string> },
      })
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.filterValues(() => true)
      expect(form.getFieldValue('items')).toEqual([])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      field.filterValues(() => true)
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('reorganizes child field segments after filtering', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c', 'd'] },
      })
      const arrayField = form._getOrCreateFieldApi({ name: 'items' })
      const field0 = form._getOrCreateFieldApi({ name: 'items[0]' })
      form._getOrCreateFieldApi({ name: 'items[1]' })
      const field2 = form._getOrCreateFieldApi({ name: 'items[2]' })
      form._getOrCreateFieldApi({ name: 'items[3]' })

      // Keep only indices 0 and 2
      arrayField.filterValues((_, index) => index === 0 || index === 2)

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
      const arrayField = form._getOrCreateFieldApi({ name: 'items' })

      const field0 = form._getOrCreateFieldApi({ name: 'items[0]' })
      form._getOrCreateFieldApi({ name: 'items[1]' })
      const field2 = form._getOrCreateFieldApi({ name: 'items[2]' })

      arrayField.filterValues((_, index) => index !== 1)

      expect(form._tryGetFieldApi('items[0]')).toBe(field0)
      expect(form._tryGetFieldApi('items[1]')).toBe(field2)
    })

    it('updates array field meta when filtered', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.filterValues(() => true)
      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })

    it('does not set value when no elements are filtered out', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      const field = form._getOrCreateFieldApi({ name: 'items' })

      const originalArray = field.value
      field.filterValues(() => true)
      expect(field.value).toBe(originalArray)
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
      const field = form._getOrCreateFieldApi({ name: 'items' })
      field.filterValues((person: any) => person.age > 28)
      expect(form.getFieldValue('items')).toEqual([
        { name: 'Alice', age: 30 },
        { name: 'Charlie', age: 35 },
      ])
    })
  })

  // End of Field array methods
})

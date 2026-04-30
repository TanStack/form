import { describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../src/internals'

describe('FormApi', () => {
  describe('initial state', () => {
    it('state.values matches defaultValues', () => {
      const form = new InternalFormApi({
        defaultValues: { name: 'Alice', age: 30 },
      })
      expect(form.state.values).toEqual({ name: 'Alice', age: 30 })
    })

    it('state.isTouched starts as false', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      expect(form.state.isTouched).toBe(false)
    })

    it('allows async default values', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      expect(form.state.values).toEqual({ name: '' })
      expect(form.state.isTouched).toBe(false)
      form._update({ defaultValues: { name: 'async' } })

      expect(form.state.isTouched).toBe(false)
      expect(form.state.values).toEqual({ name: 'async' })
    })

    // TODO extend with default state
  })

  // TODO reset behaviour

  describe('getFieldValue', () => {
    it('returns a top-level value', () => {
      const form = new InternalFormApi({ defaultValues: { name: 'Alice' } })
      expect(form.getFieldValue('name')).toBe('Alice')
    })

    it('returns a nested value using dot notation', () => {
      const form = new InternalFormApi({
        defaultValues: { address: { city: 'London' } },
      })
      expect(form.getFieldValue('address.city')).toBe('London')
    })

    it('returns an array element using bracket notation', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b', 'c'] },
      })
      expect(form.getFieldValue('items[1]')).toBe('b')
    })

    it('returns undefined for a path that does not exist', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      expect(form.getFieldValue('nonexistent')).toBeUndefined()
    })
  })

  describe('setFieldValue', () => {
    it('updates a top-level value', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      form.setFieldValue('name', 'Alice')
      expect(form.getFieldValue('name')).toBe('Alice')
    })

    it('updates a nested value without mutating unrelated keys', () => {
      const form = new InternalFormApi({
        defaultValues: { address: { city: 'London', country: 'UK' } },
      })
      form.setFieldValue('address.city', 'Manchester')
      expect(form.getFieldValue('address.city')).toBe('Manchester')
      expect(form.getFieldValue('address.country')).toBe('UK')
    })

    it('accepts an updater function', () => {
      const form = new InternalFormApi({ defaultValues: { count: 1 } })
      form.setFieldValue('count', (prev: number) => prev + 1)
      expect(form.getFieldValue('count')).toBe(2)
    })

    it('marks form isTouched and isDirty after a change', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name')
      void field.store
      form.setFieldValue('name', 'Alice', { fieldApiOverride: field })
      expect(form.state.isTouched).toBe(true)
      expect(form.state.isDirty).toBe(true)
      expect(form.state.isPristine).toBe(false)
    })

    it('does not mark form isTouched when markAsTouched is false', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name')
      form.setFieldValue('name', 'Alice', {
        fieldApiOverride: field,
        markAsTouched: false,
      })
      expect(form.state.isTouched).toBe(false)
    })

    it('does not mark form isDirty when markAsDirty is false', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name')
      form.setFieldValue('name', 'Alice', {
        fieldApiOverride: field,
        markAsDirty: false,
      })
      expect(form.state.isDirty).toBe(false)
      expect(form.state.isPristine).toBe(true)
    })

    it('does not mark the field dirty when markAsDirty is false', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name')
      form.setFieldValue('name', 'Alice', {
        fieldApiOverride: field,
        markAsDirty: false,
      })
      expect(field.meta.isDirty).toBe(false)
    })
  })

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

    it('swaps child field node segments', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field0 = form._getOrCreateFieldApi('items[0]')
      const field1 = form._getOrCreateFieldApi('items[1]')
      form.swapFieldValues('items', 0, 1)
      expect(field0._segment).toBe(1)
      expect(field1._segment).toBe(0)
    })
  })

  describe('pushFieldValue', () => {
    it('appends a value to an array field', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field = form._getOrCreateFieldApi('items')
      form.pushFieldValue('items', 'c', { fieldApiOverride: field })
      expect(form.getFieldValue('items')).toEqual(['a', 'b', 'c'])
    })

    it('warns when called on a non-array field', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name')
      form.pushFieldValue('name', 'x', { fieldApiOverride: field })
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })
  })

  describe('deleteField', () => {
    it('unmounts the field store', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name')
      void field.store
      expect(field._isMounted).toBe(true)
      form.deleteField('name', { fieldApiOverride: field })
      expect(field._isMounted).toBe(false)
    })

    it('also unmounts child field stores', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi('a')
      const child = form._getOrCreateFieldApi('a.b')
      void parent.store
      void child.store
      form.deleteField('a', { fieldApiOverride: parent })
      expect(parent._isMounted).toBe(false)
      expect(child._isMounted).toBe(false)
    })
  })

  describe('validate', () => {
    it('returns empty array when no validators are defined', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: undefined,
      })
      const result = await form.validate('submit')
      expect(result).toEqual([])
    })

    it('returns empty array when validators array is empty', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [],
      })
      const result = await form.validate('submit')
      expect(result).toEqual([])
    })

    it('returns filtered error results from validators', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            validate: () => ({ message: 'error1' as const }),
          },
          {
            validate: () => null,
          },
          {
            validate: () => ({ message: 'error2' as const }),
          },
          {
            validate: () => undefined,
          },
          {
            validate: () => false,
          },
        ],
      })
      const result = await form.validate('submit')
      expect(result).toEqual([{ message: 'error1' }, { message: 'error2' }])
    })

    it('returns ValidationError objects from validators', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            validate: () => ({ message: 'Name is required' }),
          },
        ],
      })
      const result = await form.validate('submit')
      expect(result).toEqual([{ message: 'Name is required' }])
    })

    it('returns array of ValidationError objects from validators', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            validate: () => [{ message: 'Error 1' }, { message: 'Error 2' }],
          },
        ],
      })
      const result = await form.validate('submit')
      expect(result).toEqual([[{ message: 'Error 1' }, { message: 'Error 2' }]])
    })

    it('filters out null and false from mixed results', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            validate: () => null,
          },
          {
            validate: () => ({ message: 'Valid error' }),
          },
          {
            validate: () => false,
          },
          {
            validate: () => undefined,
          },
        ],
      })
      const result = await form.validate('submit')
      expect(result).toEqual([{ message: 'Valid error' }])
    })
  })

  // End of FormApi test
})

import { afterEach, describe, expect, it, vi } from 'vitest'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import { defaultFieldMeta } from '../../src/FieldApi/FieldApi.lib'

describe('field - meta', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('field meta derived properties', () => {
    it('starts with defaultFieldMeta values', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })
      expect(field.meta).toMatchObject(defaultFieldMeta)
    })

    it('isPristine becomes false after a change', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })
      field.handleChange('new')
      expect(field.meta.isPristine).toBe(false)
    })

    it('isValid is true and isInvalid is false when there are no errors', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })
      expect(field.meta.isValid).toBe(true)
      expect(field.meta.isInvalid).toBe(false)
      expect(field.meta.isSelfValid).toBe(true)
      expect(field.meta.subfields.isEveryValid).toBe(true)
      expect(field.meta.subfields.isAnyInvalid).toBe(false)
    })

    it('isDirty is false when self and subfields are pristine', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })
      expect(field.meta.isDirty).toBe(false)
      expect(field.meta.isSelfDirty).toBe(false)
      expect(field.meta.subfields.isSomeDirty).toBe(false)
      expect(field.meta.subfields.isEveryPristine).toBe(true)
      expect(field.meta.isPristine).toBe(true)
    })

    it('isTouched is false when self and subfields are untouched', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })
      expect(field.meta.isTouched).toBe(false)
      expect(field.meta.isSelfTouched).toBe(false)
      expect(field.meta.subfields.isSomeTouched).toBe(false)
    })

    it('tracks self validation state while a field validator is pending', async () => {
      vi.useFakeTimers()
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({
        name: 'x',
        validators: [
          {
            triggers: ['change'],
            run: async () => {
              await new Promise((resolve) => setTimeout(resolve, 100))
              return null
            },
          },
        ],
      })

      const validationPromise = field._runFieldValidation('change')

      expect(field.meta.isValidating).toBe(true)
      expect(field.meta.isSelfValidating).toBe(true)
      expect(field.meta.subfields.isSomeValidating).toBe(false)

      await vi.runAllTimersAsync()
      await validationPromise

      expect(field.meta.isValidating).toBe(false)
      expect(field.meta.isSelfValidating).toBe(false)
      vi.useRealTimers()
    })

    it('aggregates validation state from subfields', async () => {
      vi.useFakeTimers()
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi({ name: 'a' })
      const child = form._getOrCreateFieldApi({
        name: 'a.b',
        validators: [
          {
            triggers: ['change'],
            run: async () => {
              await new Promise((resolve) => setTimeout(resolve, 100))
              return null
            },
          },
        ],
      })

      const validationPromise = child._runFieldValidation('change')

      vi.waitFor(() => {
        expect(child.meta.isValidating).toBe(true)
        expect(parent.meta.isValidating).toBe(true)
        expect(parent.meta.isSelfValidating).toBe(false)
        expect(parent.meta.subfields.isSomeValidating).toBe(true)
      })

      await vi.runAllTimersAsync()
      await validationPromise

      expect(parent.meta.isValidating).toBe(false)
      expect(parent.meta.subfields.isSomeValidating).toBe(false)
      vi.useRealTimers()
    })

    it('separates self validity from subfield validity', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi({ name: 'a' })
      const child = form._getOrCreateFieldApi({ name: 'a.b' })

      child._setMeta((prev) => ({
        ...prev,
        _fieldValidatorErrors: [[{ message: 'Required' }]],
      }))

      vi.waitFor(() => {
        expect(child.meta.isSelfValid).toBe(false)
        expect(child.meta.subfields.isEveryValid).toBe(true)
        expect(child.meta.subfields.isAnyInvalid).toBe(false)
        expect(child.meta.isValid).toBe(false)

        expect(parent.meta.isSelfValid).toBe(true)
        expect(parent.meta.subfields.isEveryValid).toBe(false)
        expect(parent.meta.subfields.isAnyInvalid).toBe(true)
        expect(parent.meta.isValid).toBe(false)
        expect(parent.meta.isInvalid).toBe(true)
      })
    })

    it('keeps aggregate validity invalid when self and subfields both have errors', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi({ name: 'a' })
      const child = form._getOrCreateFieldApi({ name: 'a.b' })

      parent._setMeta((prev) => ({
        ...prev,
        _fieldValidatorErrors: [[{ message: 'Parent error' }]],
      }))
      child._setMeta((prev) => ({
        ...prev,
        _fieldValidatorErrors: [[{ message: 'Child error' }]],
      }))

      vi.waitFor(() => {
        expect(parent.meta.isSelfValid).toBe(false)
        expect(parent.meta.subfields.isEveryValid).toBe(false)
        expect(parent.meta.subfields.isAnyInvalid).toBe(true)
        expect(parent.meta.isValid).toBe(false)
        expect(parent.meta.isInvalid).toBe(true)
      })
    })
  })

  describe('dirty/touched propagation', () => {
    it('marks parent fields as dirty when a child changes', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi({ name: 'a' })
      const child = form._getOrCreateFieldApi({ name: 'a.b' })
      child.handleChange('new')
      expect(parent.meta.isDirty).toBe(true)
      expect(parent.meta.isSelfDirty).toBe(false)
      expect(parent.meta.subfields.isSomeDirty).toBe(true)
      expect(parent.meta.subfields.isEveryPristine).toBe(false)
      expect(child.meta.isDirty).toBe(true)
      expect(child.meta.isSelfDirty).toBe(true)
      expect(child.meta.subfields.isSomeDirty).toBe(false)
      expect(child.meta.subfields.isEveryPristine).toBe(true)
    })

    it('keeps self and subfield dirtiness separate when both are dirty', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi({ name: 'a' })
      const child = form._getOrCreateFieldApi({ name: 'a.b' })

      parent.handleChange({ b: 'parent' })
      child.handleChange('child')

      expect(parent.meta.isSelfDirty).toBe(true)
      expect(parent.meta.subfields.isSomeDirty).toBe(true)
      expect(parent.meta.isDirty).toBe(true)
      expect(parent.meta.isPristine).toBe(false)
    })

    it('marks parent fields as touched when a child changes', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi({ name: 'a' })
      const child = form._getOrCreateFieldApi({ name: 'a.b' })
      child.handleChange('new')
      expect(parent.meta.isTouched).toBe(true)
      expect(parent.meta.isSelfTouched).toBe(false)
      expect(parent.meta.subfields.isSomeTouched).toBe(true)
      expect(child.meta.isTouched).toBe(true)
      expect(child.meta.isSelfTouched).toBe(true)
      expect(child.meta.subfields.isSomeTouched).toBe(false)
    })

    it('keeps self and subfield touched state separate when both are touched', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi({ name: 'a' })
      const child = form._getOrCreateFieldApi({ name: 'a.b' })

      parent.handleBlur()
      child.handleBlur()

      expect(parent.meta.isSelfTouched).toBe(true)
      expect(parent.meta.subfields.isSomeTouched).toBe(true)
      expect(parent.meta.isTouched).toBe(true)
    })

    it('does not mark parent as dirty when markAsDirty is false', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi({ name: 'a' })
      const child = form._getOrCreateFieldApi({ name: 'a.b' })
      child.handleChange('new', { markAsDirty: false })
      expect(parent.meta.isDirty).toBe(false)
    })

    it('propagates dirtiness through multiple levels', () => {
      const form = new InternalFormApi({
        defaultValues: { a: { b: { c: '' } } },
      })
      const grandparent = form._getOrCreateFieldApi({ name: 'a' })
      const parent = form._getOrCreateFieldApi({ name: 'a.b' })
      const child = form._getOrCreateFieldApi({ name: 'a.b.c' })
      child.handleChange('new')
      // This needs waitFor? Why? Why is this a race condition?
      vi.waitFor(() => {
        expect(parent.meta.isDirty).toBe(true)
        expect(grandparent.meta.isDirty).toBe(true)
      })
    })
  })

  describe('Field Meta', () => {
    it('returns default meta for nested fields', () => {
      const form = new InternalFormApi({
        defaultValues: { foo: { bar: '' } },
      })
      const field = form._getOrCreateFieldApi({ name: 'foo.bar' })
      expect(field.meta).toEqual(defaultFieldMeta)
    })

    it('updates meta via handleChange', () => {
      const form = new InternalFormApi({
        defaultValues: { foo: '' },
      })
      const field = form._getOrCreateFieldApi({ name: 'foo' })
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
      const field = form._getOrCreateFieldApi({ name: 'foo' })

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
      const field = form._getOrCreateFieldApi({ name: 'arr' })

      expect(field.meta.isDirty).toBe(false)

      field.pushValue('b')

      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })

    it('updates meta for array fields when using insertValue', () => {
      const form = new InternalFormApi({
        defaultValues: { arr: ['a', 'b'] },
      })
      const field = form._getOrCreateFieldApi({ name: 'arr' })

      expect(field.meta.isDirty).toBe(false)

      field.insertValue(1, 'x')

      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })

    it('updates meta for array fields when using swapValues', () => {
      const form = new InternalFormApi({
        defaultValues: { arr: ['a', 'b'] },
      })
      const field = form._getOrCreateFieldApi({ name: 'arr' })

      expect(field.meta.isDirty).toBe(false)

      field.swapValues(0, 1)

      expect(field.meta.isDirty).toBe(true)
      expect(field.meta.isTouched).toBe(true)
    })
  })
})

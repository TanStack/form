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

    it('supports updating defaultValues after initialization', () => {
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
      const field = form._getOrCreateFieldApi('name', undefined)
      void field.store
      form.setFieldValue('name', 'Alice', { fieldApiOverride: field })
      expect(form.state.isTouched).toBe(true)
      expect(form.state.isDirty).toBe(true)
      expect(form.state.isPristine).toBe(false)
    })

    it('does not mark form isTouched when markAsTouched is false', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name', undefined)
      form.setFieldValue('name', 'Alice', {
        fieldApiOverride: field,
        markAsTouched: false,
      })
      expect(form.state.isTouched).toBe(false)
    })

    it('does not mark form isDirty when markAsDirty is false', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name', undefined)
      form.setFieldValue('name', 'Alice', {
        fieldApiOverride: field,
        markAsDirty: false,
      })
      expect(form.state.isDirty).toBe(false)
      expect(form.state.isPristine).toBe(true)
    })

    it('does not mark the field dirty when markAsDirty is false', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name', undefined)
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

    it('updates field segments after swap', () => {
      const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
      const field0 = form._getOrCreateFieldApi('items[0]', undefined)
      const field1 = form._getOrCreateFieldApi('items[1]', undefined)
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
      const field = form._getOrCreateFieldApi('name', undefined)
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
      const field0 = form._getOrCreateFieldApi('items[0]', undefined)
      const field1 = form._getOrCreateFieldApi('items[1]', undefined)
      const field2 = form._getOrCreateFieldApi('items[2]', undefined)
      form.insertFieldValue('items', 1, 'x')
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
      const arrayField = form._getOrCreateFieldApi('items', undefined)
      form._getOrCreateFieldApi('items[0]', undefined)
      form._getOrCreateFieldApi('items[1]', undefined)

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
      const field0 = form._getOrCreateFieldApi('items[0]', undefined)
      form._getOrCreateFieldApi('items[1]', undefined)
      const field2 = form._getOrCreateFieldApi('items[2]', undefined)

      form.removeFieldValue('items', 1)

      expect(form._tryGetFieldApi('items[0]')).toBe(field0)
      expect(form._tryGetFieldApi('items[1]')).toBe(field2)
      expect(form._tryGetFieldApi('items[2]')).toBeNull()
      expect(field0._segment).toBe(0)
      expect(field2._segment).toBe(1)
    })
  })

  describe('deleteField', () => {
    it('unmounts the field store', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi('name', undefined)
      void field.store
      expect(field._isMounted).toBe(true)
      form.deleteField('name', { fieldApiOverride: field })
      expect(field._isMounted).toBe(false)
    })

    it('also unmounts child field stores', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi('a', undefined)
      const child = form._getOrCreateFieldApi('a.b', undefined)
      void parent.store
      void child.store
      form.deleteField('a', { fieldApiOverride: parent })
      expect(parent._isMounted).toBe(false)
      expect(child._isMounted).toBe(false)
    })
  })

  describe('validate', () => {
    describe('form-level validation', () => {
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

      it('filters out falsy validator results', async () => {
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

      it('returns ValidationError objects', async () => {
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

      it('handles validators returning error arrays', async () => {
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => [{ message: 'Error 1' }, { message: 'Error 2' }],
            },
          ],
        })
        const result = await form.validate('submit')
        expect(result).toEqual([
          [{ message: 'Error 1' }, { message: 'Error 2' }],
        ])
        expect(form.state.formErrors).toEqual([
          { message: 'Error 1' },
          { message: 'Error 2' },
        ])
      })

      it('filters out falsy values from mixed validator results', async () => {
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

      it('populates formErrors', async () => {
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => ({ message: 'Form error' }),
              signals: ['change'],
            },
          ],
        })
        await form.validate('change')
        expect(form.state.formErrors).toEqual([{ message: 'Form error' }])
      })

      it('maintains validator order with async debounced and sync validators', async () => {
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              signalDebounceMs: 100,
              validate: () => ({ message: 'Async debounced error' }),
              signals: ['change'],
            },
            {
              validate: () => ({ message: 'Sync error' }),
              signals: ['change'],
            },
          ],
        })

        // Start validation but don't await
        const validatePromise = form.validate('change')

        // The sync validator should populate formErrors first
        await vi.waitFor(() => {
          expect(form.state.formErrors).toContainEqual({
            message: 'Sync error',
          })
        })

        // After debounce, the async validator result should also be in formErrors
        // The errors should be ordered by validator index
        await validatePromise
        expect(form.state.formErrors).toEqual([
          { message: 'Async debounced error' },
          { message: 'Sync error' },
        ])
      })

      it('collects all errors from multiple sync validators', async () => {
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => ({ message: 'Error 1' }),
              signals: ['change'],
            },
            {
              validate: () => ({ message: 'Error 2' }),
              signals: ['change'],
            },
            {
              validate: () => ({ message: 'Error 3' }),
              signals: ['change'],
            },
            {
              validate: () => ({ message: 'Error 4' }),
              signals: ['change'],
            },
          ],
        })

        await form.validate('change')
        expect(form.state.formErrors).toEqual([
          { message: 'Error 1' },
          { message: 'Error 2' },
          { message: 'Error 3' },
          { message: 'Error 4' },
        ])
      })

      it('partially populates errors before debounce completes', async () => {
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => ({ message: 'Sync error' }),
              signals: ['blur'],
            },
            {
              signalDebounceMs: 100,
              validate: () => ({ message: 'Debounced error' }),
              signals: ['blur'],
            },
          ],
        })

        // Start validation but don't await
        const validatePromise = form.validate('blur')

        // The sync validator should populate formErrors first
        await vi.waitFor(() => {
          expect(form.state.formErrors).toContainEqual({
            message: 'Sync error',
          })
        })

        // After debounce, both errors should be present
        await validatePromise
        expect(form.state.formErrors).toEqual([
          { message: 'Sync error' },
          { message: 'Debounced error' },
        ])
      })

      it('partially populates errors before async validator completes', async () => {
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => ({ message: 'Sync error' }),
              signals: ['blur'],
            },
            {
              // eslint-disable-next-line @typescript-eslint/require-await
              validate: async () => ({ message: 'Async error' }),
              signals: ['blur'],
            },
          ],
        })

        // Start validation but don't await
        const validatePromise = form.validate('blur')

        // The sync validator should populate formErrors first
        await vi.waitFor(() => {
          expect(form.state.formErrors).toContainEqual({
            message: 'Sync error',
          })
        })

        // After async completes, both errors should be present
        await validatePromise
        expect(form.state.formErrors).toEqual([
          { message: 'Sync error' },
          { message: 'Async error' },
        ])
      })

      it('skips validators with runOnlyIfValid when errors exist', async () => {
        const thirdValidatorFn = vi
          .fn()
          .mockImplementation(() => ({ message: 'Should not run' }))
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => ({ message: 'Sync error' }),
              signals: ['blur'],
            },
            {
              // eslint-disable-next-line @typescript-eslint/require-await
              validate: async () => ({ message: 'Async error' }),
              signals: ['blur'],
            },
            {
              runOnlyIfValid: true,
              validate: thirdValidatorFn,
              signals: ['blur'],
            },
          ],
        })

        // Start validation
        await form.validate('blur')

        // First two validators should have populated errors
        expect(form.state.formErrors).toEqual([
          { message: 'Sync error' },
          { message: 'Async error' },
        ])

        // Third validator should NOT have been called because there were errors from previous validators
        expect(thirdValidatorFn).not.toHaveBeenCalled()
      })
    })

    describe('handleSubmit', () => {
      it('validates with submit signal', async () => {
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => ({ message: 'Submit error' }),
            },
          ],
        })
        await form.handleSubmit()
        expect(form.state.formErrors).toEqual([{ message: 'Submit error' }])
      })

      it('skips validators with runOnlyIfValid on submit when errors exist', async () => {
        const thirdValidatorFn = vi
          .fn()
          .mockImplementation(() => ({ message: 'Should not run' }))
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => ({ message: 'First error' }),
            },
            {
              runOnlyIfValid: true,
              validate: thirdValidatorFn,
            },
          ],
        })
        await form.handleSubmit()
        expect(form.state.formErrors).toEqual([{ message: 'First error' }])
        expect(thirdValidatorFn).not.toHaveBeenCalled()
      })

      it('skips validators with runOnSubmit: false', async () => {
        const validatorFn = vi
          .fn()
          .mockImplementation(() => ({ message: 'Should not run' }))
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              runOnSubmit: false,
              validate: validatorFn,
              signals: ['change'],
            },
          ],
        })
        await form.handleSubmit()
        expect(form.state.formErrors).toEqual([])
        expect(validatorFn).not.toHaveBeenCalled()
      })

      it('runs validators with runOnSubmit: true on submit', async () => {
        const validatorFn = vi
          .fn()
          .mockImplementation(() => ({ message: 'Submit error' }))
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              runOnSubmit: true,
              validate: validatorFn,
            },
          ],
        })
        await form.handleSubmit()
        expect(form.state.formErrors).toEqual([{ message: 'Submit error' }])
        expect(validatorFn).toHaveBeenCalled()
      })

      it('runs validators with runOnSubmit: false on their signals', async () => {
        const validatorFn = vi
          .fn()
          .mockImplementation(() => ({ message: 'Change error' }))
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              runOnSubmit: false,
              validate: validatorFn,
              signals: ['change'],
            },
          ],
        })
        await form.validate('change')
        // runOnSubmit: false only affects submit, not the configured signals
        expect(form.state.formErrors).toEqual([{ message: 'Change error' }])
        expect(validatorFn).toHaveBeenCalled()
      })

      it('skips validators with runOnSubmit: false and no signals on submit', async () => {
        const validatorFn = vi
          .fn()
          .mockImplementation(() => ({ message: 'Should not run' }))
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              runOnSubmit: false,
              validate: validatorFn,
            },
          ],
        })
        await form.handleSubmit()
        expect(form.state.formErrors).toEqual([])
        expect(validatorFn).not.toHaveBeenCalled()
      })

      it('supports runOnSubmit as a function', async () => {
        const validatorFn = vi
          .fn()
          .mockImplementation(() => ({ message: 'Conditional submit error' }))
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              runOnSubmit: ({ formApi }) => formApi.state.values.name === '',
              validate: validatorFn,
            },
          ],
        })
        await form.handleSubmit()
        expect(form.state.formErrors).toEqual([
          { message: 'Conditional submit error' },
        ])
        expect(validatorFn).toHaveBeenCalled()
      })
    })

    describe('causing validations', () => {
      it('runs change validators on value updates', async () => {
        const validatorFn = vi
          .fn()
          .mockImplementation(() => ({ message: 'Change error' }))
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: validatorFn,
              signals: ['change'],
            },
          ],
        })
        const field = form._getOrCreateFieldApi('name', undefined)
        form.setFieldValue('name', 'Alice', { fieldApiOverride: field })
        await vi.waitFor(() => {
          expect(validatorFn).toHaveBeenCalled()
        })
      })

      it('runs only change validators when updating values', async () => {
        const onChangeValidatorFn = vi
          .fn()
          .mockImplementation(() => ({ message: 'Change error' }))
        const onBlurValidatorFn = vi
          .fn()
          .mockImplementation(() => ({ message: 'Blur error' }))
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: onChangeValidatorFn,
              signals: ['change'],
            },
            {
              validate: onBlurValidatorFn,
              signals: ['blur'],
            },
          ],
        })
        const field = form._getOrCreateFieldApi('name', undefined)
        form.setFieldValue('name', 'Alice', { fieldApiOverride: field })
        await vi.waitFor(() => {
          expect(onChangeValidatorFn).toHaveBeenCalled()
          expect(onBlurValidatorFn).not.toHaveBeenCalled()
        })
      })

      it('skips validators when change signal is disabled', async () => {
        vi.useFakeTimers()
        const validatorFn = vi
          .fn()
          .mockImplementation(() => ({ message: 'Change error' }))
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: validatorFn,
              signals: [{ signal: 'change', enabled: false }],
            },
          ],
        })
        const field = form._getOrCreateFieldApi('name', undefined)
        field.handleChange('Alice')
        await vi.runAllTimersAsync()

        expect(validatorFn).not.toHaveBeenCalled()
      })

      it('skips validation when explicitly disabled per update', async () => {
        vi.useFakeTimers()
        const validatorFn = vi
          .fn()
          .mockImplementation(() => ({ message: 'Change error' }))
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: validatorFn,
              signals: ['change'],
            },
          ],
        })
        const field = form._getOrCreateFieldApi('name', undefined)
        field.handleChange('Alice', { causeValidation: false })
        await vi.runAllTimersAsync()

        expect(validatorFn).not.toHaveBeenCalled()
      })

      it('debounces change validators across rapid updates', async () => {
        vi.useFakeTimers()
        const validatorFn = vi
          .fn()
          .mockImplementation(() => ({ message: 'Debounced error' }))
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: validatorFn,
              signals: ['change'],
              signalDebounceMs: 100,
            },
          ],
        })
        const field = form._getOrCreateFieldApi('name', undefined)
        form.setFieldValue('name', 'A', { fieldApiOverride: field })
        form.setFieldValue('name', 'Al', { fieldApiOverride: field })
        form.setFieldValue('name', 'Ali', { fieldApiOverride: field })
        expect(validatorFn).not.toHaveBeenCalled()
        await vi.advanceTimersByTimeAsync(100)
        expect(validatorFn).toHaveBeenCalledOnce()
      })

      it('discards stale async validation results', async () => {
        vi.useFakeTimers()
        const validatorFn = vi
          .fn()
          .mockImplementationOnce(
            () =>
              new Promise((resolve) =>
                setTimeout(() => resolve({ message: 'Stale error' }), 50),
              ),
          )
          .mockImplementationOnce(() =>
            Promise.resolve({ message: 'Current error' }),
          )
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: validatorFn,
              signals: ['change'],
            },
          ],
        })
        const field = form._getOrCreateFieldApi('name', undefined)
        form.setFieldValue('name', 'A', { fieldApiOverride: field })
        form.setFieldValue('name', 'Alice', { fieldApiOverride: field })
        await vi.runAllTimersAsync()

        expect(validatorFn).toHaveBeenCalledTimes(2)
        expect(form.state.formErrors).toEqual([{ message: 'Current error' }])
      })
    })

    describe('setting field-level errors from form validators', () => {
      it('populates field errors from validator with fields property', async () => {
        const form = new InternalFormApi({
          defaultValues: { name: '', age: 0 },
          validators: [
            {
              validate: () => ({
                fields: {
                  name: { message: 'Name is required' },
                },
              }),
              signals: ['change'],
            },
          ],
        })
        const field = form._getOrCreateFieldApi('name', undefined)
        void field.store
        await form.validate('change')
        expect(field.errors).toEqual([{ message: 'Name is required' }])
      })

      it('handles multiple field errors from a single validator', async () => {
        const form = new InternalFormApi({
          defaultValues: { name: '', age: 0 },
          validators: [
            {
              validate: () => ({
                fields: {
                  name: { message: 'Name is required' },
                  age: { message: 'Age is required' },
                },
              }),
              signals: ['change'],
            },
          ],
        })
        const nameField = form._getOrCreateFieldApi('name', undefined)
        const ageField = form._getOrCreateFieldApi('age', undefined)
        void nameField.store
        void ageField.store
        await form.validate('change')
        expect(nameField.errors).toEqual([{ message: 'Name is required' }])
        expect(ageField.errors).toEqual([{ message: 'Age is required' }])
      })

      it('handles array error format in field-level errors', async () => {
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => ({
                fields: {
                  name: [{ message: 'Error 1' }, { message: 'Error 2' }],
                  lastName: { message: 'Error 3' },
                },
              }),
              signals: ['change'],
            },
          ],
        })
        const nameField = form._getOrCreateFieldApi('name', undefined)
        const lastNameField = form._getOrCreateFieldApi('lastName', undefined)
        void nameField.store
        void lastNameField.store

        await form.validate('change')
        expect(nameField.errors).toEqual([
          { message: 'Error 1' },
          { message: 'Error 2' },
        ])
        expect(lastNameField.errors).toEqual([{ message: 'Error 3' }])
      })

      it('combines field-level and form-level errors in field.errors', async () => {
        vi.useFakeTimers()
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => ({
                fields: {
                  name: { message: 'Form-level error' },
                },
              }),
              signals: ['change'],
            },
          ],
        })
        const field = form._getOrCreateFieldApi('name', [
          { validate: () => ({ message: 'Field-level error' }) },
        ])
        void field.store
        field.handleChange('New value')
        await vi.runAllTimersAsync()
        expect(field.errors).toEqual([{ message: 'Form-level error' }])
      })

      it('clears field errors when validator no longer reports them', async () => {
        let shouldError = true
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => {
                if (shouldError) {
                  return {
                    fields: {
                      name: { message: 'Error' },
                    },
                  }
                }
                return null
              },
              signals: ['change'],
            },
          ],
        })
        const field = form._getOrCreateFieldApi('name', undefined)
        void field.store

        await form.validate('change')
        expect(field.errors).toEqual([{ message: 'Error' }])

        shouldError = false
        await form.validate('change')
        expect(field.errors).toEqual([])
      })

      it('handles multiple validators with field errors', async () => {
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => ({
                fields: {
                  name: { message: 'Error from validator 1' },
                },
              }),
              signals: ['change'],
            },
            {
              validate: () => ({
                fields: {
                  name: { message: 'Error from validator 2' },
                },
              }),
              signals: ['change'],
            },
          ],
        })
        const field = form._getOrCreateFieldApi('name', undefined)
        void field.store
        await form.validate('change')
        expect(field.errors).toEqual([
          { message: 'Error from validator 1' },
          { message: 'Error from validator 2' },
        ])
      })

      it('handles formError and field errors together', async () => {
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => ({
                form: { message: 'Form-wide error' },
                fields: {
                  name: { message: 'Field-specific error' },
                },
              }),
              signals: ['change'],
            },
          ],
        })
        const field = form._getOrCreateFieldApi('name', undefined)
        void field.store
        await form.validate('change')
        expect(form.state.formErrors).toEqual([{ message: 'Form-wide error' }])
        expect(field.errors).toEqual([{ message: 'Field-specific error' }])
      })

      it('sets errors for fields even if they are not created yet', async () => {
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => ({
                fields: {
                  nonexistent: { message: 'Error on nonexistent field' },
                },
              }),
              signals: ['change'],
            },
          ],
        })
        // Field doesn't exist yet
        let field = form._tryGetFieldApi(['nonexistent'])
        expect(field).toBeNull()

        await form.validate('change')

        // Field should now exist with error
        field = form._tryGetFieldApi(['nonexistent'])
        expect(field).not.toBeNull()
        void field!.store
        expect(field!.errors).toEqual([
          { message: 'Error on nonexistent field' },
        ])
      })

      it('allows removal of field errors even if the field is unmounted', async () => {
        let shouldError = true
        const form = new InternalFormApi({
          defaultValues: { name: '' },
          validators: [
            {
              validate: () => {
                if (shouldError) {
                  return {
                    fields: {
                      nonexistent: { message: 'Error on nonexistent field' },
                    },
                  }
                }
                return null
              },
              signals: ['change'],
            },
          ],
        })
        let field = form._tryGetFieldApi('nonexistent')
        expect(field).toBeNull()

        await form.validate('change')

        field = form._tryGetFieldApi('nonexistent')
        expect(field).not.toBeNull()
        void field!.store

        expect(field!.errors).toEqual([
          { message: 'Error on nonexistent field' },
        ])

        shouldError = false
        await form.validate('change')
        field = form._tryGetFieldApi('nonexistent')
        expect(field?.errors).toEqual([])
      })
    })
  })
  // End of FormApi test
})

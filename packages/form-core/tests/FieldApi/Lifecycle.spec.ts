import { describe, expect, it, vi } from 'vitest'
import {
  defaultFieldMeta,
  defaultInternalBaseFieldMeta,
} from '../../src/FieldApi/FieldApi.lib'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'

describe('field - lifecycle', () => {
  describe('_isMounted and atom', () => {
    it('is false before the atom is accessed', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })
      expect(field._isMounted).toBe(false)
    })

    it('is true after registering', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })
      field._register()
      expect(field._isMounted).toBe(true)
    })

    it('atom returns consistent state', () => {
      const form = new InternalFormApi({ defaultValues: { x: 'hello' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })
      const state = field.atom.get()
      expect(state.value).toBe('hello')
      expect(state.meta).toMatchObject(defaultFieldMeta)
    })
  })

  describe('_kill', () => {
    it('unmounts the field atom', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })
      field._register()
      expect(field._isMounted).toBe(true)
      field._kill()
      expect(field._isMounted).toBe(false)
      expect(field._isKilled).toBe(true)
    })

    it('also kills child fields', () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi({ name: 'a' })
      const child = form._getOrCreateFieldApi({ name: 'a.b' })
      void parent.atom
      void child.atom
      parent._kill()
      expect(parent._isMounted).toBe(false)
      expect(child._isMounted).toBe(false)
      expect(parent._isKilled).toBe(true)
      expect(child._isKilled).toBe(true)
    })

    it('can notify a listener event before killing the field subtree', () => {
      const parentListener = vi.fn()
      const childListener = vi.fn()

      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi({
        name: 'a',
        listeners: [{ triggers: ['reset'], run: parentListener }],
      })
      form._getOrCreateFieldApi({
        name: 'a.b',
        listeners: [{ triggers: ['reset'], run: childListener }],
      })

      parent._kill({ listenerEvent: 'reset' })

      expect(parentListener).toHaveBeenCalledOnce()
      expect(childListener).toHaveBeenCalledOnce()
    })

    it('ignores validation started after a field is killed', async () => {
      const validator = vi.fn(() => ({ message: 'Too late' }))
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({
        name: 'x',
        validators: [{ run: validator, triggers: [] }],
      })

      field._kill()

      const result = await field._runFieldValidation('submit')

      expect(validator).not.toHaveBeenCalled()
      expect(result.results).toEqual([])
      expect(field.errors).toEqual([])
    })

    it('ignores validation results that arrive after a field is killed', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })

      field._kill()
      field._processValidationResult(
        {
          validatorIndex: 0,
          result: { message: 'Too late' },
          schemaResult: null,
        },
        'submit',
      )

      expect(field.errors).toEqual([])
    })

    it('ignores stale field writes after a field is killed', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })

      field._kill()
      field.handleChange('ignored')

      expect(form.getFieldValue('x')).toBe('')
    })

    it('ignores stale array and blur methods after a field is killed', () => {
      const formListener = vi.fn()
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b'] },
        listeners: [{ triggers: ['blur'], run: formListener }],
      })
      const field = form._getOrCreateFieldApi({ name: 'items' })

      field._kill()
      field.swapValues(0, 1)
      field.clearValues()
      field.pushValue('c')
      field.insertValue(1, 'x')
      field.removeValue(0)
      field.filterValues(() => false)
      field.handleBlur()

      expect(form.getFieldValue('items')).toEqual(['a', 'b'])
      expect(formListener).not.toHaveBeenCalled()
    })

    it('returns a no-op unregister callback for a killed field', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })

      field._kill()
      const unregister = field._register()
      unregister()
      field._unregister()

      expect(field._isMounted).toBe(false)
    })

    it('does not prune killed fields or fields with retained meta state', () => {
      const cases = [
        (
          field: ReturnType<
            InternalFormApi<any, any, any>['_getOrCreateFieldApi']
          >,
        ) => field._setMeta((prev) => ({ ...prev, isDirty: true })),
        (
          field: ReturnType<
            InternalFormApi<any, any, any>['_getOrCreateFieldApi']
          >,
        ) => field._setMeta((prev) => ({ ...prev, isBlurred: true })),
        (
          field: ReturnType<
            InternalFormApi<any, any, any>['_getOrCreateFieldApi']
          >,
        ) => field._setMeta((prev) => ({ ...prev, isValidating: true })),
        (
          field: ReturnType<
            InternalFormApi<any, any, any>['_getOrCreateFieldApi']
          >,
        ) => field._setMeta((prev) => ({ ...prev, _validationCount: 1 })),
        (
          field: ReturnType<
            InternalFormApi<any, any, any>['_getOrCreateFieldApi']
          >,
        ) => field._setMeta((prev) => ({ ...prev, _arrayVersion: 1 })),
      ]

      cases.forEach((markRetainedMeta, index) => {
        const form = new InternalFormApi({ defaultValues: { x: '' } })
        const field = form._getOrCreateFieldApi({ name: `x${index}` })
        markRetainedMeta(field)

        expect(field._canPrune()).toBe(false)
      })

      const form = new InternalFormApi({ defaultValues: { killed: '' } })
      const killedField = form._getOrCreateFieldApi({ name: 'killed' })
      killedField._kill()

      expect(killedField._canPrune()).toBe(false)
    })

    it('removes killed fields from form-level routed error bookkeeping', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '' },
        validators: [
          {
            triggers: [],
            run: () => ({
              fields: {
                name: 'Name is required',
              },
            }),
          },
        ],
      })
      const field = form._getOrCreateFieldApi({ name: 'name' })

      await form.validate('submit')
      expect(field.errors).toEqual([{ message: 'Name is required' }])
      expect(form.state.canSubmit).toBe(false)

      field._kill()

      expect(form.state.canSubmit).toBe(true)
      expect(form._atoms.meta.fieldErrors.get()[0]?.size).toBe(0)
    })

    it('preserves routed errors for fields outside the killed subtree', async () => {
      const form = new InternalFormApi({
        defaultValues: { name: '', other: '' },
        validators: [
          {
            triggers: [],
            run: () => ({
              fields: {
                name: 'Name is required',
              },
            }),
          },
        ],
      })
      const nameField = form._getOrCreateFieldApi({ name: 'name' })
      const otherField = form._getOrCreateFieldApi({ name: 'other' })

      await form.validate('submit')
      otherField._kill()

      expect(nameField.errors).toEqual([{ message: 'Name is required' }])
      expect(form.state.canSubmit).toBe(false)
    })

    it('does not prune source fields while watched validators are attached', () => {
      const form = new InternalFormApi({
        defaultValues: { source: '', target: '' },
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })
      form._getOrCreateFieldApi({
        name: 'target',
        validators: [
          {
            triggers: ['change'],
            watchFields: ['source'],
            run: () => null,
          },
        ],
      })

      expect(sourceField._canPrune()).toBe(false)
    })
  })

  describe('_unregister', () => {
    it('unmounts when no registers remain', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })

      const unregister = field._register()
      expect(field._isMounted).toBe(true)

      unregister()
      expect(field._isMounted).toBe(false)
    })

    it('cleans up the atom cache on unmount', async () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })

      const unregister = field._register()
      expect(field._atoms.store).toBeDefined()

      unregister()

      await vi.waitFor(() => {
        expect(field._atoms.store).toBeUndefined()
      })
    })

    it('cleans up atoms on unmount when meta was not modified', async () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })

      const unregister = field._register()
      expect(field._atoms.meta).toBeDefined()
      expect(field._atoms.meta?.get()).toBe(defaultInternalBaseFieldMeta)

      unregister()

      await vi.waitFor(() => {
        expect(field._atoms.meta).toBeUndefined()
        expect(field._atoms.store).toBeUndefined()
      })
    })

    it('keeps meta atom on unmount when meta was modified', async () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })

      const unregister = field._register()
      expect(field._atoms.meta).toBeDefined()
      expect(field._atoms.meta?.get()).toBe(defaultInternalBaseFieldMeta)

      field.handleChange('New value')

      unregister()

      await vi.waitFor(() => {
        expect(field._atoms.meta).toBeDefined()
        expect(field._atoms.store).toBeUndefined()
      })
    })

    it('does not clean up when registers still exist', async () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })

      const unregister1 = field._register()
      const unregister2 = field._register()

      expect(field._atoms.store).toBeDefined()

      unregister1()
      // Still mounted because of second registration
      expect(field._isMounted).toBe(true)

      unregister2()
      expect(field._isMounted).toBe(false)

      await vi.waitFor(() => {
        expect(field._atoms.store).toBeUndefined()
      })
    })

    it('cleans up atom caches for child fields when parent unregisters', async () => {
      const form = new InternalFormApi({ defaultValues: { a: { b: '' } } })
      const parent = form._getOrCreateFieldApi({ name: 'a' })
      const child = form._getOrCreateFieldApi({ name: 'a.b' })

      const unregisterParent = parent._register()
      const unregisterChild = child._register()

      expect(parent._atoms.store).toBeDefined()
      expect(child._atoms.store).toBeDefined()

      unregisterChild()
      unregisterParent()

      await vi.waitFor(() => {
        expect(parent._atoms.store).toBeUndefined()
        // Child's atom cache should also be cleaned up (separate refCount)
        expect(child._atoms.store).toBeUndefined()
      })
    })
  })
})

import { describe, expect, it, vi } from 'vitest'
import {
  defaultFieldMeta,
  defaultInternalBaseFieldMeta,
} from '../../src/FieldApi.lib'
import { InternalFormApi } from '../../src/FormApi.lib'

describe('field - lifecycle', () => {
  describe('_isMounted and store', () => {
    it('is false before the store is accessed', () => {
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

    it('store returns consistent state', () => {
      const form = new InternalFormApi({ defaultValues: { x: 'hello' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })
      const state = field.store.get()
      expect(state.value).toBe('hello')
      expect(state.meta).toMatchObject(defaultFieldMeta)
    })
  })

  describe('_kill', () => {
    it('unmounts the field store', () => {
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
      void parent.store
      void child.store
      parent._kill()
      expect(parent._isMounted).toBe(false)
      expect(child._isMounted).toBe(false)
      expect(parent._isKilled).toBe(true)
      expect(child._isKilled).toBe(true)
    })

    it('ignores validation started after a field is killed', async () => {
      const validator = vi.fn(() => ({ message: 'Too late' }))
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({
        name: 'x',
        validators: [{ run: validator }],
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
      field._processValidationResult({
        validatorIndex: 0,
        result: { message: 'Too late' },
        schemaResult: null,
      })

      expect(field.errors).toEqual([])
    })

    it('ignores stale field writes after a field is killed', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({ name: 'x' })

      field._kill()
      field.handleChange('ignored')

      expect(form.getFieldValue('x')).toBe('')
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

    it('cleans up store on unmount', async () => {
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

    it('cleans up store for child fields when parent unregisters', async () => {
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
        // Child's store should also be cleaned up (separate refCount)
        expect(child._atoms.store).toBeUndefined()
      })
    })
  })
})

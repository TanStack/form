import { describe, expect, it, vi } from 'vitest'
import {
  defaultFieldMeta,
  defaultInternalBaseFieldMeta,
} from '../../src/FieldApi/fieldState.lib'
import { canPruneField } from '../../src/FieldApi/fieldTree.lib'
import { InternalFormApi } from '../../src/FormApi/FormApi.lib'
import { installDevtoolsBridge } from '../../src/devtoolsBridge.lib'

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

  describe('validator instances', () => {
    it('keeps instances stable by slot and distinguishes omitted validators from an empty array', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const firstDefinition = { run: () => null, triggers: [] }
      const field = form._getOrCreateFieldApi({
        name: 'x',
        validators: [firstDefinition],
      })
      const instance = field._validatorInstances?.[0]
      const initialRevision = instance?.revision
      const nextDefinition = { run: () => null, triggers: [] }

      field._update({ validators: [nextDefinition] })

      expect(field._validatorInstances?.[0]).toBe(instance)
      expect(instance?.definition).toBe(nextDefinition)
      expect(instance?.owner).toBe(field)
      expect(instance?.scope).toBe('field')
      expect(instance?.revision).toBe((initialRevision ?? 0) + 1)

      field._update({})
      expect(field._validatorInstances?.[0]).toBe(instance)

      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      field._update({ validators: [] })
      expect(field._validatorInstances).toBeNull()
      expect(instance?.disposed).toBe(true)
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('resets runtime on field reset and disposes instances on kill', () => {
      const form = new InternalFormApi({ defaultValues: { x: '' } })
      const field = form._getOrCreateFieldApi({
        name: 'x',
        validators: [{ run: () => null, triggers: [] }],
      })
      const instance = field._validatorInstances?.[0]
      const abortController = new AbortController()
      instance?.setAbortController(abortController)
      instance?.setSchemaOutput('output')

      field.reset()

      expect(field._validatorInstances?.[0]).toBe(instance)
      expect(abortController.signal.aborted).toBe(true)
      expect(instance?.hasSchemaOutput).toBe(false)
      expect(instance?.disposed).toBe(false)

      field._kill()

      expect(field._validatorInstances).toBeNull()
      expect(instance?.disposed).toBe(true)
    })
  })

  describe('devtools bridge notifications', () => {
    it('notifies field mount and final unmount transitions only', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      const mountField = vi.fn()
      const unmountField = vi.fn()
      const uninstallBridge = installDevtoolsBridge({
        mountField,
        unmountField,
      })

      try {
        const unregister1 = field._register()
        const unregister2 = field._register()

        expect(mountField).toHaveBeenCalledOnce()
        expect(mountField).toHaveBeenCalledWith(field)

        unregister1()
        expect(unmountField).not.toHaveBeenCalled()

        unregister2()
        expect(unmountField).toHaveBeenCalledOnce()
        expect(unmountField).toHaveBeenCalledWith(field, 'name')
      } finally {
        uninstallBridge()
      }
    })

    it('notifies field moves with the previous path', () => {
      const form = new InternalFormApi({
        defaultValues: { items: ['a', 'b'] },
      })
      const field0 = form._getOrCreateFieldApi({ name: 'items[0]' })
      const field1 = form._getOrCreateFieldApi({ name: 'items[1]' })
      const moveField = vi.fn()
      const uninstallBridge = installDevtoolsBridge({ moveField })

      try {
        form.swapFieldValues('items', 0, 1)

        expect(moveField).toHaveBeenCalledWith(field0, 'items[0]')
        expect(moveField).toHaveBeenCalledWith(field1, 'items[1]')
        expect(field0.name).toBe('items[1]')
        expect(field1.name).toBe('items[0]')
      } finally {
        uninstallBridge()
      }
    })

    it('notifies field meta updates for changed fields and their parents', () => {
      const form = new InternalFormApi({
        defaultValues: { user: { name: '' } },
      })
      const parent = form._getOrCreateFieldApi({ name: 'user' })
      const child = form._getOrCreateFieldApi({ name: 'user.name' })
      const updateField = vi.fn()
      const uninstallBridge = installDevtoolsBridge({ updateField })

      try {
        child.handleChange('changed')

        expect(child.meta.isDirty).toBe(true)
        expect(parent.meta.isDirty).toBe(true)
        expect(updateField).toHaveBeenCalledWith(child)
        expect(updateField).toHaveBeenCalledWith(parent)
      } finally {
        uninstallBridge()
      }
    })

    it('notifies field value updates for the field and its parents even when summary meta is unchanged', () => {
      const form = new InternalFormApi({
        defaultValues: { user: { name: '' } },
      })
      const parent = form._getOrCreateFieldApi({ name: 'user' })
      const field = form._getOrCreateFieldApi({ name: 'user.name' })
      const updateField = vi.fn()
      const uninstallBridge = installDevtoolsBridge({ updateField })

      try {
        field.handleChange('first')
        updateField.mockClear()

        field.handleChange('second')

        expect(field.meta.isDirty).toBe(true)
        expect(updateField).toHaveBeenCalledWith(field)
        expect(updateField).toHaveBeenCalledWith(parent)
      } finally {
        uninstallBridge()
      }
    })

    it('notifies field and default value updates that bypass field change events', () => {
      const form = new InternalFormApi({ defaultValues: { name: '' } })
      const field = form._getOrCreateFieldApi({ name: 'name' })
      const updateField = vi.fn()
      const uninstallBridge = installDevtoolsBridge({ updateField })

      try {
        field.handleChange('changed')
        updateField.mockClear()

        form.resetField('name')
        expect(updateField).toHaveBeenCalledWith(field)

        updateField.mockClear()
        form._update({ defaultValues: { name: 'new default' } })
        expect(updateField).toHaveBeenCalledWith(field)
      } finally {
        uninstallBridge()
      }
    })

    it('notifies removed field subtrees with previous paths', () => {
      const form = new InternalFormApi({
        defaultValues: { user: { name: '' } },
      })
      const parent = form._getOrCreateFieldApi({ name: 'user' })
      const child = form._getOrCreateFieldApi({ name: 'user.name' })
      const removeFieldSubtree = vi.fn()
      const uninstallBridge = installDevtoolsBridge({ removeFieldSubtree })

      try {
        parent._kill()

        expect(removeFieldSubtree).toHaveBeenCalledOnce()
        expect(removeFieldSubtree).toHaveBeenCalledWith(form, [
          { field: parent, previousPath: 'user' },
          { field: child, previousPath: 'user.name' },
        ])
      } finally {
        uninstallBridge()
      }
    })

    it('notifies semantic field topology changes', () => {
      const form = new InternalFormApi({
        defaultValues: { parent: {}, source: '', target: '' },
      })
      form._getOrCreateFieldApi({ name: 'parent' })
      const source = form._getOrCreateFieldApi({ name: 'source' })
      const target = form._getOrCreateFieldApi({ name: 'target' })
      const fieldAdded = vi.fn()
      const fieldDependenciesChanged = vi.fn()
      const uninstallBridge = installDevtoolsBridge({
        fieldAdded,
        fieldDependenciesChanged,
      })

      try {
        const child = form._getOrCreateFieldApi({ name: 'parent.child' })

        expect(fieldAdded).toHaveBeenCalledWith(child)
        expect(form._tryGetFieldApi('parent.child')).toBe(child)

        target._update({
          listeners: [
            {
              triggers: ['change'],
              watchFields: ['source'],
              run: () => {},
            },
          ],
        })

        expect(fieldDependenciesChanged).toHaveBeenCalledWith([
          { sourceField: source, watchingField: target, watcherIndex: 0 },
        ])

        fieldDependenciesChanged.mockClear()
        target._kill()

        expect(fieldDependenciesChanged).toHaveBeenCalledWith([
          { sourceField: source, watchingField: target, watcherIndex: 0 },
        ])
        expect(source._watchingFields).toBeNull()
      } finally {
        uninstallBridge()
      }
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
      field.moveValue(0, 1)
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

        expect(canPruneField(field)).toBe(false)
      })

      const form = new InternalFormApi({ defaultValues: { killed: '' } })
      const killedField = form._getOrCreateFieldApi({ name: 'killed' })
      killedField._kill()

      expect(canPruneField(killedField)).toBe(false)
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

    it('does not prune either endpoint while watched validators are attached', () => {
      const form = new InternalFormApi({
        defaultValues: { source: '', target: '' },
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })
      const targetField = form._getOrCreateFieldApi({
        name: 'target',
        validators: [
          {
            triggers: ['change'],
            watchFields: ['source'],
            run: () => null,
          },
        ],
      })

      expect(canPruneField(sourceField)).toBe(false)
      expect(canPruneField(targetField)).toBe(false)
    })

    it('prunes an unmounted watcher after its final source is killed', () => {
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

      sourceField._kill()

      expect(form._tryGetFieldApi('source')).toBeNull()
      expect(form._tryGetFieldApi('target')).toBeNull()
    })

    it('keeps a mounted watcher after its source is killed', () => {
      const form = new InternalFormApi({
        defaultValues: { source: '', target: '' },
      })
      const sourceField = form._getOrCreateFieldApi({ name: 'source' })
      const targetField = form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['source'],
            run: () => {},
          },
        ],
      })
      const unregisterTarget = targetField._register()

      try {
        sourceField._kill()

        expect(form._tryGetFieldApi('target')).toBe(targetField)
        expect(targetField._listenToFields).toBeNull()
      } finally {
        unregisterTarget()
      }
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

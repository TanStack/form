import {
  InternalFormApi,
  installDevtoolsBridge,
} from '@tanstack/form-core/internals'
import { describe, expect, it } from 'vitest'
import { createFieldsController } from '../src/bridge/fields'
import { createMountedFormsController } from '../src/bridge/forms/mountedForms'
import { createFormDevtoolsBridge } from '../src/bridge/createBridge'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { connectTestEventBus } from './testEventBus'
import type { FormDevtoolsEventMap } from '../src/eventClientTypes'

type FieldListSnapshot = FormDevtoolsEventMap['field-list-snapshot']
type FieldListPatch = FormDevtoolsEventMap['field-list-patch']

const flushPatches = () => Promise.resolve()

describe('field list bridge', () => {
  it('uses snapshots for recovery and sparse patches for live meta', async () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unregisterField = field._register()
    const snapshots: Array<FieldListSnapshot> = []
    const patches: Array<FieldListPatch> = []
    const cleanupSnapshotListener = formDevtoolsEventClient.on(
      'field-list-snapshot',
      (event) => snapshots.push(event.payload),
    )
    const cleanupPatchListener = formDevtoolsEventClient.on(
      'field-list-patch',
      (event) => patches.push(event.payload),
    )

    try {
      mountedForms.mountForm(form)
      const { instanceId } = mountedForms.getMountedFormsSnapshot()[0]!

      formDevtoolsEventClient.emit('field-list-subscribe', {
        formInstanceId: instanceId,
      })
      expect(snapshots.at(-1)?.fields).toEqual([
        { path: 'name', fieldId: expect.any(String) },
      ])
      const fieldId = snapshots.at(-1)!.fields[0]!.fieldId

      field.handleChange('changed')
      fields.updateField(field)
      await flushPatches()

      expect(snapshots).toHaveLength(1)
      expect(patches.at(-1)).toEqual({
        formInstanceId: instanceId,
        upsert: [{ fieldId, setSummary: { isDirty: true } }],
      })

      const patchCount = patches.length
      field._setMeta((meta) => ({ ...meta, isBlurred: true }))
      fields.updateField(field)
      await flushPatches()
      expect(patches).toHaveLength(patchCount)

      field._setMeta((meta) => ({ ...meta, isDirty: false }))
      fields.updateField(field)
      await flushPatches()
      expect(patches.at(-1)).toEqual({
        formInstanceId: instanceId,
        upsert: [{ fieldId, clearSummary: ['isDirty'] }],
      })

      formDevtoolsEventClient.emit('field-list-unsubscribe', {
        formInstanceId: instanceId,
      })
      const unsubscribedPatchCount = patches.length
      field.handleChange('changed again')
      fields.updateField(field)
      await flushPatches()
      expect(patches).toHaveLength(unsubscribedPatchCount)

      formDevtoolsEventClient.emit('field-list-subscribe', {
        formInstanceId: instanceId,
      })
      expect(snapshots.at(-1)?.fields[0]?.summary).toEqual({ isDirty: true })

      const patchCountBeforeUnmount = patches.length
      field._setMeta((meta) => ({ ...meta, isDirty: false }))
      fields.updateField(field)
      mountedForms.unmountForm(form, fields.unmountForm)
      await flushPatches()
      expect(snapshots.at(-1)?.fields).toEqual([])
      expect(patches).toHaveLength(patchCountBeforeUnmount)
    } finally {
      cleanupPatchListener()
      cleanupSnapshotListener()
      unregisterField()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

  it('coalesces structural changes to each field final state', async () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const form = new InternalFormApi({ defaultValues: { stable: '' } })
    const stableField = form._getOrCreateFieldApi({ name: 'stable' })
    const unregisterStable = stableField._register()
    const patches: Array<FieldListPatch> = []
    const snapshots: Array<FieldListSnapshot> = []
    const cleanupPatchListener = formDevtoolsEventClient.on(
      'field-list-patch',
      (event) => patches.push(event.payload),
    )
    const cleanupSnapshotListener = formDevtoolsEventClient.on(
      'field-list-snapshot',
      (event) => snapshots.push(event.payload),
    )

    try {
      mountedForms.mountForm(form)
      const { instanceId } = mountedForms.getMountedFormsSnapshot()[0]!
      formDevtoolsEventClient.emit('field-list-subscribe', {
        formInstanceId: instanceId,
      })

      const transient = form._getOrCreateFieldApi({ name: 'transient' })
      const unregisterTransient = transient._register()
      fields.mountField(transient)
      unregisterTransient()
      fields.unmountField(transient, 'transient')
      await flushPatches()

      const transientId = patches.at(-1)?.remove?.[0]
      expect(transientId).toEqual(expect.any(String))
      expect(patches.at(-1)?.upsert).toBeUndefined()

      patches.length = 0
      unregisterStable()
      fields.unmountField(stableField, 'stable')
      const unregisterRemounted = stableField._register()
      fields.mountField(stableField)
      fields.updateField(stableField)
      await flushPatches()

      expect(patches).toEqual([
        {
          formInstanceId: instanceId,
          upsert: [
            {
              fieldId: snapshots[0]!.fields[0]!.fieldId,
              path: 'stable',
            },
          ],
        },
      ])
      unregisterRemounted()
    } finally {
      cleanupSnapshotListener()
      cleanupPatchListener()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

  it('coalesces parent and child meta updates into one patch event', async () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const bridge = createFormDevtoolsBridge({ fields, mountedForms })
    const uninstallBridge = installDevtoolsBridge(bridge)
    const form = new InternalFormApi({
      defaultValues: { user: { name: '' } },
    })
    const parent = form._getOrCreateFieldApi({ name: 'user' })
    const child = form._getOrCreateFieldApi({ name: 'user.name' })
    const unmountForm = form.mount()
    const unregisterParent = parent._register()
    const unregisterChild = child._register()
    const patches: Array<FieldListPatch> = []
    const snapshots: Array<FieldListSnapshot> = []
    const cleanupPatchListener = formDevtoolsEventClient.on(
      'field-list-patch',
      (event) => patches.push(event.payload),
    )
    const cleanupSnapshotListener = formDevtoolsEventClient.on(
      'field-list-snapshot',
      (event) => snapshots.push(event.payload),
    )

    try {
      const { instanceId } = mountedForms.getMountedFormsSnapshot()[0]!
      formDevtoolsEventClient.emit('field-list-subscribe', {
        formInstanceId: instanceId,
      })
      const fieldIds = new Map(
        snapshots[0]!.fields.map((field) => [field.path, field.fieldId]),
      )

      child.handleChange('changed')
      await flushPatches()

      expect(patches).toHaveLength(1)
      expect(patches[0]?.formInstanceId).toBe(instanceId)
      expect(patches[0]?.upsert).toEqual(
        expect.arrayContaining([
          {
            fieldId: fieldIds.get('user'),
            setSummary: { isDirty: true },
          },
          {
            fieldId: fieldIds.get('user.name'),
            setSummary: { isDirty: true },
          },
        ]),
      )

      patches.length = 0
      parent._kill()
      await flushPatches()

      expect(patches).toEqual([
        {
          formInstanceId: instanceId,
          remove: expect.arrayContaining([
            fieldIds.get('user'),
            fieldIds.get('user.name'),
          ]),
        },
      ])
    } finally {
      cleanupSnapshotListener()
      cleanupPatchListener()
      unregisterChild()
      unregisterParent()
      unmountForm()
      uninstallBridge()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

  it('emits only final paths after repeated moves in one microtask', async () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const bridge = createFormDevtoolsBridge({ fields, mountedForms })
    const uninstallBridge = installDevtoolsBridge(bridge)
    const form = new InternalFormApi({ defaultValues: { items: ['a', 'b'] } })
    const field0 = form._getOrCreateFieldApi({ name: 'items[0]' })
    const field1 = form._getOrCreateFieldApi({ name: 'items[1]' })
    const unmountForm = form.mount()
    const unregister0 = field0._register()
    const unregister1 = field1._register()
    const patches: Array<FieldListPatch> = []
    const snapshots: Array<FieldListSnapshot> = []
    const cleanupPatchListener = formDevtoolsEventClient.on(
      'field-list-patch',
      (event) => patches.push(event.payload),
    )
    const cleanupSnapshotListener = formDevtoolsEventClient.on(
      'field-list-snapshot',
      (event) => snapshots.push(event.payload),
    )

    try {
      const { instanceId } = mountedForms.getMountedFormsSnapshot()[0]!
      formDevtoolsEventClient.emit('field-list-subscribe', {
        formInstanceId: instanceId,
      })
      const fieldIds = new Map(
        snapshots[0]!.fields.map((field) => [field.path, field.fieldId]),
      )

      form.swapFieldValues('items', 0, 1)
      form.swapFieldValues('items', 0, 1)
      await flushPatches()

      expect(patches).toHaveLength(1)
      expect(patches[0]).toEqual({
        formInstanceId: instanceId,
        upsert: expect.arrayContaining([
          { fieldId: fieldIds.get('items[0]'), path: 'items[0]' },
          { fieldId: fieldIds.get('items[1]'), path: 'items[1]' },
        ]),
      })
    } finally {
      cleanupSnapshotListener()
      cleanupPatchListener()
      unregister1()
      unregister0()
      unmountForm()
      uninstallBridge()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })
})

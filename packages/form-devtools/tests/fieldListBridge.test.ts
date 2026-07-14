import { InternalFormApi } from '@tanstack/form-core/internals'
import { describe, expect, it } from 'vitest'
import { createFieldsController } from '../src/bridge/fields'
import { createMountedFormsController } from '../src/bridge/forms/mountedForms'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import type { DevtoolsMountedFieldRow } from '../src/eventClientTypes'
import { connectTestEventBus } from './testEventBus'

describe('field list bridge', () => {
  it('emits a subscribed snapshot and clears it on final form unmount', () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unregisterField = field._register()
    const snapshots: Array<Array<DevtoolsMountedFieldRow>> = []
    const cleanupSnapshotListener = formDevtoolsEventClient.on(
      'field-list-snapshot',
      (event) => snapshots.push(event.payload.fields),
    )

    try {
      mountedForms.mountForm(form)
      const { instanceId } = mountedForms.getMountedFormsSnapshot()[0]!

      formDevtoolsEventClient.emit('field-list-subscribe', {
        formInstanceId: instanceId,
      })
      expect(snapshots.at(-1)).toEqual([
        { path: 'name', fieldId: expect.any(String) },
      ])

      mountedForms.unmountForm(form, fields.unmountForm)
      expect(snapshots.at(-1)).toEqual([])
    } finally {
      cleanupSnapshotListener()
      unregisterField()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })
})

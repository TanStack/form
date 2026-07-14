import { InternalFormApi } from '@tanstack/form-core/internals'
import { describe, expect, it, vi } from 'vitest'
import { createMountedFormsController } from '../src/bridge/forms/mountedForms'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { connectTestEventBus } from './testEventBus'

describe('mounted forms bridge', () => {
  it('tracks duplicate mounts until the final unmount', () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const form = new InternalFormApi({
      formId: 'profile',
      defaultValues: { name: '' },
    })
    const onFinalUnmount = vi.fn()

    try {
      expect(mountedForms.mountForm(form)).toBe(true)
      expect(mountedForms.mountForm(form)).toBe(false)

      const { instanceId } = mountedForms.getMountedFormsSnapshot()[0]!
      expect(mountedForms.getMountedForm(instanceId)).toBe(form)

      expect(mountedForms.unmountForm(form, onFinalUnmount)).toBe(false)
      expect(onFinalUnmount).not.toHaveBeenCalled()
      expect(mountedForms.getMountedFormsSnapshot()).toHaveLength(1)

      expect(mountedForms.unmountForm(form, onFinalUnmount)).toBe(true)
      expect(onFinalUnmount).toHaveBeenCalledWith(instanceId)
      expect(mountedForms.getMountedForm(instanceId)).toBeUndefined()
      expect(mountedForms.getMountedFormsSnapshot()).toEqual([])
    } finally {
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

  it('updates mounted-form labels and responds to snapshot requests', () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const form = new InternalFormApi({
      formId: 'profile',
      defaultValues: { name: '' },
    })
    const snapshots: Array<Array<string>> = []
    const cleanupSnapshotListener = formDevtoolsEventClient.on(
      'mounted-forms-changed',
      (event) => {
        snapshots.push(event.payload.forms.map((item) => item.label))
      },
    )

    try {
      mountedForms.mountForm(form)
      form._update({
        formId: 'renamed-profile',
        defaultValues: { name: '' },
      })
      mountedForms.updateForm(form)

      snapshots.length = 0
      formDevtoolsEventClient.emit('request-mounted-forms', {})

      expect(snapshots).toEqual([['renamed-profile']])
    } finally {
      cleanupSnapshotListener()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })
})

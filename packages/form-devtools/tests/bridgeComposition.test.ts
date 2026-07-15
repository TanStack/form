import { InternalFormApi } from '@tanstack/form-core/internals'
import { describe, expect, it, vi } from 'vitest'
import { createFormDevtoolsBridge } from '../src/bridge/createBridge'
import type {
  FieldsBridgeController,
  MountedFormsBridgeController,
} from '../src/bridge/createBridge'
import type { FormId } from '../src/types/branded'

describe('form devtools bridge composition', () => {
  it('routes form and field lifecycle events to their purpose controllers', () => {
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const formInstanceId = 'form-instance' as FormId
    const mountedForms: MountedFormsBridgeController = {
      mountForm: vi.fn(() => true),
      unmountForm: vi.fn((_form, onFinalUnmount) => {
        onFinalUnmount(formInstanceId)
        return true
      }),
      updateForm: vi.fn(),
    }
    const fields: FieldsBridgeController = {
      mountForm: vi.fn(),
      unmountForm: vi.fn(),
      mountField: vi.fn(),
      updateField: vi.fn(),
      unmountField: vi.fn(),
      moveField: vi.fn(),
      removeFieldSubtree: vi.fn(),
    }
    const bridge = createFormDevtoolsBridge({ fields, mountedForms })
    const removedFields = [{ field, previousPath: 'name' }]

    bridge.mountForm?.(form)
    bridge.updateForm?.(form)
    bridge.mountField?.(field)
    bridge.updateField?.(field)
    bridge.unmountField?.(field, 'name')
    bridge.moveField?.(field, 'previousName')
    bridge.removeFieldSubtree?.(form, removedFields)
    bridge.unmountForm?.(form)

    expect(fields.mountForm).toHaveBeenCalledWith(form)
    expect(fields.unmountForm).toHaveBeenCalledWith(formInstanceId)
    expect(fields.mountField).toHaveBeenCalledWith(field)
    expect(fields.updateField).toHaveBeenCalledWith(field)
    expect(fields.unmountField).toHaveBeenCalledWith(field, 'name')
    expect(fields.moveField).toHaveBeenCalledWith(field, 'previousName')
    expect(fields.removeFieldSubtree).toHaveBeenCalledWith(form, removedFields)
    expect(mountedForms.updateForm).toHaveBeenCalledWith(form)
  })

  it('does not repeat field form-mount work for duplicate mounts', () => {
    const form = new InternalFormApi({ defaultValues: {} })
    const mountedForms: MountedFormsBridgeController = {
      mountForm: vi.fn(() => false),
      unmountForm: vi.fn(() => false),
      updateForm: vi.fn(),
    }
    const fields: FieldsBridgeController = {
      mountForm: vi.fn(),
      unmountForm: vi.fn(),
      mountField: vi.fn(),
      updateField: vi.fn(),
      unmountField: vi.fn(),
      moveField: vi.fn(),
      removeFieldSubtree: vi.fn(),
    }

    createFormDevtoolsBridge({ fields, mountedForms }).mountForm?.(form)

    expect(fields.mountForm).not.toHaveBeenCalled()
  })
})

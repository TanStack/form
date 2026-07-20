import { InternalFormApi } from '@tanstack/form-core/internals'
import { describe, expect, it, vi } from 'vitest'
import { createFieldsController } from '../src/bridge/fields'
import { createMountedFormsController } from '../src/bridge/forms/mountedForms'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { connectTestEventBus } from './testEventBus'
import type { DevtoolsFieldDetail } from '../src/eventClientTypes'
import type { FieldId } from '../src/types/branded'

describe('field actions bridge', () => {
  it('runs change, blur, and reset actions on an unmounted field', () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const changeListener = vi.fn()
    const blurListener = vi.fn()
    const resetListener = vi.fn()
    const details: Array<DevtoolsFieldDetail> = []
    const cleanupDetails = formDevtoolsEventClient.on(
      'field-detail-changed',
      (event) => details.push(event.payload),
    )
    const form = new InternalFormApi({ defaultValues: { name: 'Ada' } })
    const field = form._getOrCreateFieldApi({
      name: 'name',
      listeners: [
        { triggers: ['change'], run: changeListener },
        { triggers: ['blur'], run: blurListener },
        { triggers: ['reset'], run: resetListener },
      ],
    })

    try {
      mountedForms.mountForm(form)
      const formInstanceId =
        mountedForms.getMountedFormsSnapshot()[0]!.instanceId
      const fieldId = fields.getFieldRowsSnapshot(form)[0]!.fieldId
      const request = { formInstanceId, fieldId }
      formDevtoolsEventClient.emit('field-detail-subscribe', {
        ...request,
        settings: {
          includeValues: true,
          errorPayloadMode: 'full',
          debounceMs: 0,
        },
      })

      expect(field._isMounted).toBe(false)

      formDevtoolsEventClient.emit('field-handle-change-request', request)
      expect(changeListener).toHaveBeenCalledOnce()
      expect(field.value).toBe('Ada')

      formDevtoolsEventClient.emit('field-handle-blur-request', request)
      expect(blurListener).toHaveBeenCalledOnce()
      expect(field.meta).toMatchObject({
        isTouched: true,
        isBlurred: true,
      })

      field.handleChange('Grace')
      changeListener.mockClear()
      formDevtoolsEventClient.emit('field-reset-request', request)
      expect(resetListener).toHaveBeenCalledOnce()
      expect(changeListener).not.toHaveBeenCalled()
      expect(field.value).toBe('Ada')
      expect(field.meta).toMatchObject({
        isTouched: false,
        isDirty: false,
        isBlurred: false,
      })
      expect(details.at(-1)?.state.meta).toMatchObject({
        isTouched: false,
        isDirty: false,
        isBlurred: false,
      })
      expect(field._isMounted).toBe(false)
    } finally {
      cleanupDetails()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

  it('ignores invalid targets and stops handling requests after disposal', () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const firstForm = new InternalFormApi({ defaultValues: { name: '' } })
    const secondForm = new InternalFormApi({ defaultValues: { name: '' } })
    const firstField = firstForm._getOrCreateFieldApi({ name: 'name' })
    const secondField = secondForm._getOrCreateFieldApi({ name: 'name' })
    const firstBlur = vi.spyOn(firstField, 'handleBlur')
    const secondBlur = vi.spyOn(secondField, 'handleBlur')

    mountedForms.mountForm(firstForm)
    mountedForms.mountForm(secondForm)
    const [firstMountedForm, secondMountedForm] =
      mountedForms.getMountedFormsSnapshot()
    const firstFieldId = fields.getFieldRowsSnapshot(firstForm)[0]!.fieldId
    const secondFieldId = fields.getFieldRowsSnapshot(secondForm)[0]!.fieldId

    formDevtoolsEventClient.emit('field-handle-blur-request', {
      formInstanceId: secondMountedForm!.instanceId,
      fieldId: firstFieldId,
    })
    formDevtoolsEventClient.emit('field-handle-blur-request', {
      formInstanceId: firstMountedForm!.instanceId,
      fieldId: 'missing-field' as FieldId,
    })
    firstField._kill()
    formDevtoolsEventClient.emit('field-handle-blur-request', {
      formInstanceId: firstMountedForm!.instanceId,
      fieldId: firstFieldId,
    })

    expect(firstBlur).not.toHaveBeenCalled()
    expect(secondBlur).not.toHaveBeenCalled()

    fields.dispose()
    formDevtoolsEventClient.emit('field-handle-blur-request', {
      formInstanceId: secondMountedForm!.instanceId,
      fieldId: secondFieldId,
    })
    expect(secondBlur).not.toHaveBeenCalled()

    mountedForms.dispose()
    disconnectEventBus()
  })
})

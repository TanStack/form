import {
  InternalFormApi,
  InternalFormGroupApi,
} from '@tanstack/form-core/internals'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createFieldsController } from '../src/bridge/fields'
import { createMountedFormsController } from '../src/bridge/forms/mountedForms'
import { getDevtoolsFieldDetail } from '../src/bridge/fields/detailSnapshot'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { connectTestEventBus } from './testEventBus'
import type {
  DevtoolsFieldDetail,
  FieldDetailSubscriptionDescriptor,
} from '../src/eventClientTypes'
import type { FieldId, FormId } from '../src/types/branded'

const callbackValidator = {
  triggers: ['change'] as const,
  run: () => null,
}

const schemaValidator = {
  triggers: ['change'] as const,
  run: {
    '~standard': {
      version: 1,
      vendor: 'field-detail-test',
      validate: () => ({ value: undefined }),
    },
  },
}

function descriptor(
  formInstanceId: FormId,
  fieldId: FieldId,
  overrides: Partial<FieldDetailSubscriptionDescriptor['settings']> = {},
): FieldDetailSubscriptionDescriptor {
  return {
    formInstanceId,
    fieldId,
    settings: {
      includeValues: true,
      errorPayloadMode: 'full',
      debounceMs: 0,
      ...overrides,
    },
  }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('field detail snapshots', () => {
  it('projects validator provenance and preserves FieldState error visibility', () => {
    const form = new InternalFormApi({
      defaultValues: { profile: { name: 'Ada' } },
      validators: [callbackValidator, schemaValidator] as never,
    })
    const group = new InternalFormGroupApi({
      form,
      name: 'profile',
      validators: [schemaValidator] as never,
    })
    const field = form._getOrCreateFieldApi({
      name: 'profile.name',
      validators: [callbackValidator, schemaValidator] as never,
    })
    const unregister = field._register()
    const subscription = descriptor('form' as FormId, 'field' as FieldId)

    try {
      field._setMeta((meta) => ({
        ...meta,
        _fieldValidatorErrors: [
          [
            { message: 'Field callback', code: 'field-code' } as never,
            { message: 'Field callback second', code: 'field-code-2' } as never,
          ],
          [{ message: 'Field schema', path: ['name'] } as never],
        ],
        _fieldValidatorErrorSourceEvents: ['change', 'blur'],
        _formGroupValidatorErrors: new Map([
          [
            group._errorOwner,
            {
              errors: [[{ message: 'Group schema', path: ['name'] } as never]],
              errorSourceEvents: ['server'],
            },
          ],
        ]),
        _formValidatorErrors: [
          [{ message: 'Form callback', code: 'form-code' } as never],
          [{ message: 'Form schema', path: ['profile', 'name'] } as never],
          [{ message: 'Submit callback', code: 'submit-code' } as never],
        ],
        _formValidatorErrorSourceEvents: ['change', 'server', 'submit'],
      }))

      const full = getDevtoolsFieldDetail(field, subscription)
      expect(full.state.value).toBe('Ada')
      expect(full.defaultValue).toBe('Ada')
      expect(
        full.state.meta.original.errors.map(({ source }) => source),
      ).toEqual([
        { scope: 'field', validatorIndex: 0, validatorType: 'callback' },
        { scope: 'field', validatorIndex: 0, validatorType: 'callback' },
        { scope: 'field', validatorIndex: 1, validatorType: 'schema' },
        {
          scope: 'formGroup',
          formGroupPath: 'profile',
          validatorIndex: 0,
          validatorType: 'schema',
        },
        { scope: 'form', validatorIndex: 0, validatorType: 'callback' },
        { scope: 'form', validatorIndex: 1, validatorType: 'schema' },
        { scope: 'onSubmit', validatorType: 'callback' },
      ])
      expect(
        full.state.meta.original.errors.map(({ sourceEvent }) => sourceEvent),
      ).toEqual([
        'change',
        'change',
        'blur',
        'server',
        'change',
        'server',
        'submit',
      ])
      expect(
        full.state.meta.original.errors.map(({ error }) => error.message),
      ).toEqual(field.state.meta.original.errors.map(({ message }) => message))
      expect(full.state.meta.errors).toEqual(full.state.meta.original.errors)
      expect(full.state.meta.errors[0]?.error).toEqual({
        message: 'Field callback',
        code: 'field-code',
      })

      const messages = getDevtoolsFieldDetail(field, {
        ...subscription,
        settings: { ...subscription.settings, errorPayloadMode: 'messages' },
      })
      expect(messages.state.meta.original.errors[0]?.error).toEqual({
        message: 'Field callback',
      })
      expect(messages.state.meta.original.errors[2]?.error).toEqual({
        message: 'Field schema',
      })

      field._errorVisibility = () => false
      field._setMeta((meta) => ({ ...meta, isBlurred: true }))
      const hidden = getDevtoolsFieldDetail(field, subscription)
      expect(hidden.state.meta.errors).toEqual([])
      expect(hidden.state.meta.original.errors).toHaveLength(7)

      const metaOnly = getDevtoolsFieldDetail(field, {
        ...subscription,
        settings: { ...subscription.settings, includeValues: false },
      })
      expect(Object.hasOwn(metaOnly.state, 'value')).toBe(false)
      expect(Object.hasOwn(metaOnly, 'defaultValue')).toBe(false)
    } finally {
      unregister()
      group._cleanup()
    }
  })
})

describe('field detail bridge', () => {
  it('streams directly from the field atom and keeps errored unmounted fields subscribed', async () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unregister = field._register()
    const details: Array<DevtoolsFieldDetail> = []
    const cleanupDetails = formDevtoolsEventClient.on(
      'field-detail-changed',
      (event) => details.push(event.payload),
    )

    try {
      mountedForms.mountForm(form)
      const formInstanceId =
        mountedForms.getMountedFormsSnapshot()[0]!.instanceId
      const fieldId = fields.getFieldRowsSnapshot(form)[0]!.fieldId
      const subscription = descriptor(formInstanceId, fieldId)

      formDevtoolsEventClient.emit('field-detail-subscribe', subscription)
      expect(details).toHaveLength(1)
      expect(details[0]?.state.value).toBe('')

      field.handleChange('Ada')
      expect(details.at(-1)?.state.value).toBe('Ada')
      expect(details.at(-1)?.state.meta.isDirty).toBe(true)

      field._setMeta((meta) => ({
        ...meta,
        _fieldValidatorErrors: [[{ message: 'Keep this field' }]],
        _fieldValidatorErrorSourceEvents: ['change'],
      }))
      unregister()
      await new Promise((resolve) => setTimeout(resolve, 0))
      field.handleChange('Grace')

      expect(field._isMounted).toBe(false)
      expect(details.at(-1)?.state.value).toBe('Grace')

      const countBeforeUnsubscribe = details.length
      formDevtoolsEventClient.emit('field-detail-unsubscribe', subscription)
      field.handleChange('Lin')
      expect(details).toHaveLength(countBeforeUnsubscribe)
    } finally {
      cleanupDetails()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

  it('debounces transformation and emission to the latest atom state', async () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unregister = field._register()
    const details: Array<DevtoolsFieldDetail> = []
    const cleanupDetails = formDevtoolsEventClient.on(
      'field-detail-changed',
      (event) => details.push(event.payload),
    )

    try {
      mountedForms.mountForm(form)
      const formInstanceId =
        mountedForms.getMountedFormsSnapshot()[0]!.instanceId
      const fieldId = fields.getFieldRowsSnapshot(form)[0]!.fieldId
      const subscription = descriptor(formInstanceId, fieldId, {
        debounceMs: 100,
      })

      formDevtoolsEventClient.emit('field-detail-subscribe', subscription)
      expect(details).toHaveLength(1)

      vi.useFakeTimers()
      field.handleChange('A')
      field.handleChange('B')
      field.handleChange('C')

      await vi.advanceTimersByTimeAsync(99)
      expect(details).toHaveLength(1)

      await vi.advanceTimersByTimeAsync(1)
      expect(details).toHaveLength(2)
      expect(details.at(-1)?.state.value).toBe('C')

      field.handleChange('pending')
      fields.removeFieldSubtree(form, [{ field, previousPath: field.name }])
      await vi.advanceTimersByTimeAsync(100)
      expect(details).toHaveLength(2)
    } finally {
      cleanupDetails()
      unregister()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

  it('ignores stale descriptor unsubscriptions after settings change', () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const form = new InternalFormApi({ defaultValues: { name: '' } })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unregister = field._register()
    const details: Array<DevtoolsFieldDetail> = []
    const cleanupDetails = formDevtoolsEventClient.on(
      'field-detail-changed',
      (event) => details.push(event.payload),
    )

    try {
      mountedForms.mountForm(form)
      const formInstanceId =
        mountedForms.getMountedFormsSnapshot()[0]!.instanceId
      const fieldId = fields.getFieldRowsSnapshot(form)[0]!.fieldId
      const oldDescriptor = descriptor(formInstanceId, fieldId, {
        debounceMs: 100,
      })
      const newDescriptor = descriptor(formInstanceId, fieldId, {
        includeValues: false,
      })

      formDevtoolsEventClient.emit('field-detail-subscribe', oldDescriptor)
      formDevtoolsEventClient.emit('field-detail-subscribe', newDescriptor)
      formDevtoolsEventClient.emit('field-detail-unsubscribe', oldDescriptor)
      field._setMeta((meta) => ({ ...meta, isBlurred: true }))

      expect(details.at(-1)?.settings).toEqual(newDescriptor.settings)
      expect(details.at(-1)?.state.meta.isBlurred).toBe(true)
      expect(Object.hasOwn(details.at(-1)!.state, 'value')).toBe(false)

      field.handleChange('A', {
        causeValidation: false,
        markAsDirty: false,
        markAsTouched: false,
      })
      const countAfterMetaChange = details.length
      field.handleChange('B', {
        causeValidation: false,
        markAsDirty: false,
        markAsTouched: false,
      })
      expect(details).toHaveLength(countAfterMetaChange)

      mountedForms.unmountForm(form, fields.unmountForm)
      field._setMeta((meta) => ({ ...meta, isBlurred: false }))
      expect(details).toHaveLength(countAfterMetaChange)
    } finally {
      cleanupDetails()
      unregister()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })
})

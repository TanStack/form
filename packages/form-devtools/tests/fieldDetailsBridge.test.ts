import {
  InternalFormApi,
  InternalFormGroupApi,
  installDevtoolsBridge,
} from '@tanstack/form-core/internals'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { createFieldsController } from '../src/bridge/fields'
import { createFieldIdentityController } from '../src/bridge/fields/identity'
import { createMountedFormsController } from '../src/bridge/forms/mountedForms'
import { getDevtoolsFieldDetail } from '../src/bridge/fields/detailSnapshot'
import { createFormDevtoolsBridge } from '../src/bridge/createBridge'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { connectTestEventBus } from './testEventBus'
import type {
  DevtoolsFieldDetail,
  FieldDetailSubscriptionDescriptor,
  FormDevtoolsEventMap,
} from '../src/eventClientTypes'
import type { FieldId, FormId } from '../src/types/branded'

const callbackValidator = {
  triggers: ['change'] as const,
  run: () => null,
}

const schemaValidator = {
  triggers: ['change'] as const,
  run: z.unknown(),
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
    const identity = createFieldIdentityController()
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
    const subscription = descriptor('form', 'field')

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

      const full = getDevtoolsFieldDetail(field, subscription, identity)
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

      const messages = getDevtoolsFieldDetail(
        field,
        {
          ...subscription,
          settings: { ...subscription.settings, errorPayloadMode: 'messages' },
        },
        identity,
      )
      expect(messages.state.meta.original.errors[0]?.error).toEqual({
        message: 'Field callback',
      })
      expect(messages.state.meta.original.errors[2]?.error).toEqual({
        message: 'Field schema',
      })

      field._errorVisibility = () => false
      field._setMeta((meta) => ({ ...meta, isBlurred: true }))
      const hidden = getDevtoolsFieldDetail(field, subscription, identity)
      expect(hidden.state.meta.errors).toEqual([])
      expect(hidden.state.meta.original.errors).toHaveLength(7)

      const metaOnly = getDevtoolsFieldDetail(
        field,
        {
          ...subscription,
          settings: { ...subscription.settings, includeValues: false },
        },
        identity,
      )
      expect(Object.hasOwn(metaOnly.state, 'value')).toBe(false)
      expect(Object.hasOwn(metaOnly, 'defaultValue')).toBe(false)
    } finally {
      unregister()
      group._cleanup()
    }
  })

  it('projects direct children and normalized relations in both directions', () => {
    const identity = createFieldIdentityController()
    const form = new InternalFormApi({
      defaultValues: {
        parent: { child: { grandchild: '' } },
        other: '',
        source: '',
        target: '',
      },
    })
    const parent = form._getOrCreateFieldApi({
      name: 'parent',
    })
    form._getOrCreateFieldApi({ name: 'parent.child.grandchild' })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        {
          triggers: ['change'],
          watchFields: ['source', 'other'],
          run: () => {},
        },
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: () => {},
        },
      ],
      validators: [
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: () => null,
        },
      ],
    })
    const source = form._getOrCreateFieldApi({ name: 'source' })
    const other = form._getOrCreateFieldApi({ name: 'other' })
    const subscription = descriptor('form', 'field')

    const parentDetail = getDevtoolsFieldDetail(parent, subscription, identity)
    expect(parentDetail.relations.directChildCount).toBe(1)
    expect(parentDetail.state.meta.subfields).toEqual({
      isEveryValid: true,
      isAnyInvalid: false,
      isEveryPristine: true,
      isSomeDirty: false,
      isSomeTouched: false,
      isSomeValidating: false,
    })

    expect(
      getDevtoolsFieldDetail(target, subscription, identity).relations,
    ).toEqual({
      directChildCount: 0,
      listensTo: [
        {
          fieldId: identity.getFieldId(other),
          causes: [{ kind: 'listener', itemIndex: 0 }],
        },
        {
          fieldId: identity.getFieldId(source),
          causes: [
            { kind: 'listener', itemIndex: 0 },
            { kind: 'listener', itemIndex: 1 },
            { kind: 'validator', itemIndex: 0 },
          ],
        },
      ],
      listenedToBy: [],
    })
    expect(
      getDevtoolsFieldDetail(source, subscription, identity).relations,
    ).toEqual({
      directChildCount: 0,
      listensTo: [],
      listenedToBy: [
        {
          fieldId: identity.getFieldId(target),
          causes: [
            { kind: 'listener', itemIndex: 0 },
            { kind: 'listener', itemIndex: 1 },
            { kind: 'validator', itemIndex: 0 },
          ],
        },
      ],
    })
  })
})

describe('field detail bridge', () => {
  it('streams topology changes and registers newly watched fields', async () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const uninstallBridge = installDevtoolsBridge(
      createFormDevtoolsBridge({ fields, mountedForms }),
    )
    const form = new InternalFormApi({
      defaultValues: { parent: {}, target: '' },
    })
    const unmountForm = form.mount()
    form._getOrCreateFieldApi({ name: 'parent' })
    const target = form._getOrCreateFieldApi({ name: 'target' })
    const details: Array<DevtoolsFieldDetail> = []
    const patches: Array<FormDevtoolsEventMap['field-list-patch']> = []
    const cleanupDetails = formDevtoolsEventClient.on(
      'field-detail-changed',
      (event) => details.push(event.payload),
    )
    const cleanupPatches = formDevtoolsEventClient.on(
      'field-list-patch',
      (event) => patches.push(event.payload),
    )

    try {
      const formInstanceId =
        mountedForms.getMountedFormsSnapshot()[0]!.instanceId
      formDevtoolsEventClient.emit('field-list-subscribe', { formInstanceId })
      const rows = fields.getFieldRowsSnapshot(form)
      const parentId = rows.find(({ path }) => path === 'parent')!.fieldId
      const targetId = rows.find(({ path }) => path === 'target')!.fieldId
      formDevtoolsEventClient.emit(
        'field-detail-subscribe',
        descriptor(formInstanceId, parentId),
      )
      formDevtoolsEventClient.emit(
        'field-detail-subscribe',
        descriptor(formInstanceId, targetId),
      )

      form._getOrCreateFieldApi({ name: 'parent.child.grandchild' as never })
      expect(
        details.filter(({ fieldId }) => fieldId === parentId).at(-1)?.relations
          .directChildCount,
      ).toBe(1)

      target._update({
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['source'],
            run: () => {},
          },
        ],
        validators: [
          {
            triggers: ['change'],
            watchFields: ['source'],
            run: () => null,
          },
        ],
      })

      const targetRelations = details
        .filter(({ fieldId }) => fieldId === targetId)
        .at(-1)!.relations
      expect(targetRelations.listensTo).toHaveLength(1)
      expect(targetRelations.listensTo[0]?.causes).toEqual([
        { kind: 'listener', itemIndex: 0 },
        { kind: 'validator', itemIndex: 0 },
      ])

      await Promise.resolve()
      const sourceId = targetRelations.listensTo[0]!.fieldId
      expect(
        patches.some((patch) =>
          patch.upsert?.some(
            (field) => field.fieldId === sourceId && field.path === 'source',
          ),
        ),
      ).toBe(true)

      const source = form._tryGetFieldApi('source')!
      const unregisterSource = source._register()
      formDevtoolsEventClient.emit(
        'field-detail-subscribe',
        descriptor(formInstanceId, sourceId),
      )
      expect(details.at(-1)?.relations.listenedToBy).toEqual([
        {
          fieldId: targetId,
          causes: [
            { kind: 'listener', itemIndex: 0 },
            { kind: 'validator', itemIndex: 0 },
          ],
        },
      ])

      target._update({ listeners: [], validators: [] })
      expect(
        details.filter(({ fieldId }) => fieldId === sourceId).at(-1)?.relations
          .listenedToBy,
      ).toEqual([])
      unregisterSource()
      await new Promise((resolve) => setTimeout(resolve, 0))
      await Promise.resolve()
      expect(patches.some((patch) => patch.remove?.includes(sourceId))).toBe(
        true,
      )

      const child = form._tryGetFieldApi('parent.child')!
      child._kill()
      expect(
        details.filter(({ fieldId }) => fieldId === parentId).at(-1)?.relations
          .directChildCount,
      ).toBe(0)

      expect(source._isKilled).toBe(false)
    } finally {
      cleanupPatches()
      cleanupDetails()
      unmountForm()
      uninstallBridge()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

  it('streams initial relations for a newly added field', async () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const uninstallBridge = installDevtoolsBridge(
      createFormDevtoolsBridge({ fields, mountedForms }),
    )
    const form = new InternalFormApi({
      defaultValues: { source: '', target: '' },
    })
    const unmountForm = form.mount()
    const source = form._getOrCreateFieldApi({ name: 'source' })
    const unregisterSource = source._register()
    const details: Array<DevtoolsFieldDetail> = []
    const patches: Array<FormDevtoolsEventMap['field-list-patch']> = []
    const cleanupDetails = formDevtoolsEventClient.on(
      'field-detail-changed',
      (event) => details.push(event.payload),
    )
    const cleanupPatches = formDevtoolsEventClient.on(
      'field-list-patch',
      (event) => patches.push(event.payload),
    )

    try {
      const formInstanceId =
        mountedForms.getMountedFormsSnapshot()[0]!.instanceId
      formDevtoolsEventClient.emit('field-list-subscribe', { formInstanceId })
      const sourceId = fields
        .getFieldRowsSnapshot(form)
        .find(({ path }) => path === 'source')!.fieldId
      formDevtoolsEventClient.emit(
        'field-detail-subscribe',
        descriptor(formInstanceId, sourceId),
      )

      const target = form._getOrCreateFieldApi({
        name: 'target',
        listeners: [
          {
            triggers: ['change'],
            watchFields: ['source'],
            run: () => {},
          },
        ],
      })
      const targetRelation = details
        .filter(({ fieldId }) => fieldId === sourceId)
        .at(-1)!.relations.listenedToBy[0]!

      expect(targetRelation.causes).toEqual([
        { kind: 'listener', itemIndex: 0 },
      ])
      await Promise.resolve()
      expect(
        patches.some((patch) =>
          patch.upsert?.some(
            ({ fieldId, path }) =>
              fieldId === targetRelation.fieldId && path === 'target',
          ),
        ),
      ).toBe(true)

      target._kill()
      expect(
        details.filter(({ fieldId }) => fieldId === sourceId).at(-1)?.relations
          .listenedToBy,
      ).toEqual([])
    } finally {
      cleanupPatches()
      cleanupDetails()
      unregisterSource()
      unmountForm()
      uninstallBridge()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

  it('keeps relation IDs and canonical rows aligned across array moves', async () => {
    const disconnectEventBus = connectTestEventBus()
    const mountedForms = createMountedFormsController()
    const fields = createFieldsController(mountedForms)
    const uninstallBridge = installDevtoolsBridge(
      createFormDevtoolsBridge({ fields, mountedForms }),
    )
    const form = new InternalFormApi({
      defaultValues: { users: [{ name: 'first' }], target: '' },
    })
    const unmountForm = form.mount()
    const source = form._getOrCreateFieldApi({ name: 'users[0].name' })
    const target = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        {
          triggers: ['change'],
          watchFields: ['users[0].name'],
          run: () => {},
        },
      ],
    })
    const details: Array<DevtoolsFieldDetail> = []
    const patches: Array<FormDevtoolsEventMap['field-list-patch']> = []
    const cleanupDetails = formDevtoolsEventClient.on(
      'field-detail-changed',
      (event) => details.push(event.payload),
    )
    const cleanupPatches = formDevtoolsEventClient.on(
      'field-list-patch',
      (event) => patches.push(event.payload),
    )

    try {
      const formInstanceId =
        mountedForms.getMountedFormsSnapshot()[0]!.instanceId
      formDevtoolsEventClient.emit('field-list-subscribe', { formInstanceId })
      const rows = fields.getFieldRowsSnapshot(form)
      const sourceId = rows.find(
        ({ path }) => path === 'users[0].name',
      )!.fieldId
      const targetId = rows.find(({ path }) => path === 'target')!.fieldId
      formDevtoolsEventClient.emit(
        'field-detail-subscribe',
        descriptor(formInstanceId, targetId),
      )

      expect(details.at(-1)?.relations.listensTo).toEqual([
        {
          fieldId: sourceId,
          causes: [{ kind: 'listener', itemIndex: 0 }],
        },
      ])

      form.insertFieldValue('users', 0, { name: 'inserted' })

      expect(source.name).toBe('users[1].name')
      expect(details.at(-1)?.relations.listensTo).toEqual([
        {
          fieldId: sourceId,
          causes: [
            {
              kind: 'listener',
              itemIndex: 0,
              configuredPath: 'users[0].name',
            },
          ],
        },
      ])

      await Promise.resolve()
      expect(
        patches.some((patch) =>
          patch.upsert?.some(
            (field) =>
              field.fieldId === sourceId && field.path === 'users[1].name',
          ),
        ),
      ).toBe(true)
      expect(target._isKilled).toBe(false)
    } finally {
      cleanupPatches()
      cleanupDetails()
      unmountForm()
      uninstallBridge()
      fields.dispose()
      mountedForms.dispose()
      disconnectEventBus()
    }
  })

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

import { describe, expect, it } from 'vitest'
import { InternalFormApi, devtools } from '@tanstack/form-core/internals'
import { emitFormEvent, onFormEvent } from '../src/eventClient.lib'
import {
  createFormDevtoolsBridge,
  getDevtoolsFieldDetailSnapshot,
  getDevtoolsFormInstanceId,
  subscribeDevtoolsFieldDetail,
  unsubscribeDevtoolsFieldDetail,
} from '../src/devtoolsBridge.lib'
import type {
  BroadcastFieldDetailState,
  BroadcastFieldListState,
} from '../src/eventClientTypes'

describe('devtools field events', () => {
  it('streams focused field value and meta changes', () => {
    const form = new InternalFormApi({
      formId: 'profile',
      defaultValues: { name: '' },
    })
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unregisterField = field._register()
    const snapshots: Array<BroadcastFieldDetailState> = []
    const unsubscribeEvents = onFormEvent('field-detail-state', (event) => {
      snapshots.push(event.payload)
    })

    subscribeDevtoolsFieldDetail(form, {
      id: form.formId,
      instanceId: getDevtoolsFormInstanceId(form),
      path: 'name',
      includeRawValues: true,
      includeArrayFields: true,
    })

    expect(snapshots.at(-1)?.state.value).toBe('')
    expect(snapshots.at(-1)?.state.meta.isDefaultValue).toBe(true)
    expect(snapshots.at(-1)?.isChangedFromDefault).toBe(false)

    form.setFieldValue('name', 'Ada', { fieldApiOverride: field })

    expect(snapshots.at(-1)?.state.value).toBe('Ada')
    expect(snapshots.at(-1)?.state.meta.isDefaultValue).toBe(false)
    expect(snapshots.at(-1)?.isChangedFromDefault).toBe(true)
    expect(snapshots.at(-1)?.state.meta.isDirty).toBe(true)
    expect(snapshots.at(-1)?.state.meta.isTouched).toBe(true)

    unsubscribeDevtoolsFieldDetail(form, 'name')
    unsubscribeEvents()
    unregisterField()
  })

  it('includes field listener and validator dependencies in detail snapshots', () => {
    const form = new InternalFormApi({
      formId: 'profile-with-dependencies',
      defaultValues: { source: '', other: '', target: '' },
    })
    const targetField = form._getOrCreateFieldApi({
      name: 'target',
      listeners: [
        {
          triggers: ['change'],
          watchFields: ['source', 'other'],
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
    const sourceField = form._getOrCreateFieldApi({ name: 'source' })

    expect(getDevtoolsFieldDetailSnapshot(targetField).dependencies).toEqual({
      watches: [
        { path: 'other', kind: 'listener', itemIndex: 0 },
        { path: 'source', kind: 'listener', itemIndex: 0 },
        { path: 'source', kind: 'validator', itemIndex: 0 },
      ],
      watchedBy: [],
    })
    expect(getDevtoolsFieldDetailSnapshot(sourceField).dependencies).toEqual({
      watches: [],
      watchedBy: [
        { path: 'target', kind: 'listener', itemIndex: 0 },
        { path: 'target', kind: 'validator', itemIndex: 0 },
      ],
    })
  })

  it('streams dependency changes to subscribed field details', () => {
    const uninstallBridge = devtools.installBridge(createFormDevtoolsBridge())
    const form = new InternalFormApi({
      formId: 'profile-dependency-refresh',
      defaultValues: { source: '', target: '' },
    })
    const unmountForm = form.mount()
    const sourceField = form._getOrCreateFieldApi({ name: 'source' })
    const targetField = form._getOrCreateFieldApi({ name: 'target' })
    const unregisterSourceField = sourceField._register()
    const unregisterTargetField = targetField._register()
    const snapshots: Array<BroadcastFieldDetailState> = []
    const unsubscribeEvents = onFormEvent('field-detail-state', (event) => {
      snapshots.push(event.payload)
    })
    const basePayload = {
      id: form.formId,
      instanceId: getDevtoolsFormInstanceId(form),
      includeRawValues: true,
      includeArrayFields: true,
    }

    subscribeDevtoolsFieldDetail(form, {
      ...basePayload,
      path: 'source',
    })
    subscribeDevtoolsFieldDetail(form, {
      ...basePayload,
      path: 'target',
    })

    targetField._update({
      listeners: [
        {
          triggers: ['change'],
          watchFields: ['source'],
          run: () => {},
        },
      ],
    })

    expect(
      snapshots.filter((snapshot) => snapshot.path === 'target').at(-1)
        ?.dependencies.watches,
    ).toEqual([{ path: 'source', kind: 'listener', itemIndex: 0 }])
    expect(
      snapshots.filter((snapshot) => snapshot.path === 'source').at(-1)
        ?.dependencies.watchedBy,
    ).toEqual([{ path: 'target', kind: 'listener', itemIndex: 0 }])

    unsubscribeDevtoolsFieldDetail(form, 'source')
    unsubscribeDevtoolsFieldDetail(form, 'target')
    unsubscribeEvents()
    unregisterSourceField()
    unregisterTargetField()
    unmountForm()
    uninstallBridge()
  })

  it('routes field list subscriptions to the requested form instance', () => {
    const uninstallBridge = devtools.installBridge(createFormDevtoolsBridge())
    const firstForm = new InternalFormApi({
      formId: 'shared-profile',
      defaultValues: { firstName: '' },
    })
    const secondForm = new InternalFormApi({
      formId: 'shared-profile',
      defaultValues: { lastName: '' },
    })
    const unmountFirstForm = firstForm.mount()
    const unmountSecondForm = secondForm.mount()
    const firstField = firstForm._getOrCreateFieldApi({ name: 'firstName' })
    const secondField = secondForm._getOrCreateFieldApi({ name: 'lastName' })
    const unregisterFirstField = firstField._register()
    const unregisterSecondField = secondField._register()
    const snapshots: Array<BroadcastFieldListState> = []
    const unsubscribeEvents = onFormEvent('field-list-state', (event) => {
      snapshots.push(event.payload)
    })

    emitFormEvent('subscribe-field-list', {
      id: secondForm.formId,
      instanceId: getDevtoolsFormInstanceId(secondForm),
    })

    expect(snapshots.at(-1)?.instanceId).toBe(
      getDevtoolsFormInstanceId(secondForm),
    )
    expect(snapshots.at(-1)?.fields.map((field) => field.path)).toEqual([
      'lastName',
    ])

    emitFormEvent('unsubscribe-field-list', {
      id: secondForm.formId,
      instanceId: getDevtoolsFormInstanceId(secondForm),
    })
    unsubscribeEvents()
    unregisterFirstField()
    unregisterSecondField()
    unmountFirstForm()
    unmountSecondForm()
    uninstallBridge()
  })

  it('streams mounted field meta flags', async () => {
    const uninstallBridge = devtools.installBridge(createFormDevtoolsBridge())
    const form = new InternalFormApi({
      formId: 'profile-field-list-meta',
      defaultValues: { name: '' },
    })
    const unmountForm = form.mount()
    const field = form._getOrCreateFieldApi({ name: 'name' })
    const unregisterField = field._register()
    const snapshots: Array<BroadcastFieldListState> = []
    const unsubscribeEvents = onFormEvent('field-list-state', (event) => {
      snapshots.push(event.payload)
    })

    emitFormEvent('subscribe-field-list', {
      id: form.formId,
      instanceId: getDevtoolsFormInstanceId(form),
    })

    expect(snapshots.at(-1)?.fields[0]).toMatchObject({
      path: 'name',
      isTouched: false,
      isDirty: false,
      isDefaultValue: true,
      isBlurred: false,
    })

    form.setFieldValue('name', 'Ada', { fieldApiOverride: field })
    await Promise.resolve()

    expect(snapshots.at(-1)?.fields[0]).toMatchObject({
      path: 'name',
      isTouched: true,
      isDirty: true,
      isDefaultValue: false,
    })

    field._setMeta((prev) => ({
      ...prev,
      isBlurred: true,
    }))
    await Promise.resolve()

    expect(snapshots.at(-1)?.fields[0]).toMatchObject({
      path: 'name',
      isBlurred: true,
    })

    unsubscribeEvents()
    unregisterField()
    unmountForm()
    uninstallBridge()
  })
})

import { createRoot } from 'solid-js'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createFormDevtoolsStore } from '../src/stores/formDevtoolsStore'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { connectTestEventBus } from './testEventBus'
import type { FormDevtoolsStore } from '../src/stores/formDevtoolsStore'
import type {
  DevtoolsFieldDetail,
  DevtoolsMountedFieldScaffold,
  FieldDetailSubscriptionDescriptor,
} from '../src/eventClientTypes'
import type { FormId } from '../src/types/branded'

const formA = 'form-a' as FormId

function field(path: string, fieldId: string): DevtoolsMountedFieldScaffold {
  return { path, fieldId }
}

let fieldList!: FormDevtoolsStore['fieldList']
let fieldMeta!: FormDevtoolsStore['fieldMeta']
let fieldDetails!: FormDevtoolsStore['fieldDetails']
let disposeStore!: () => void

beforeEach(() => {
  createRoot((dispose) => {
    const store = createFormDevtoolsStore()
    fieldList = store.fieldList
    fieldMeta = store.fieldMeta
    fieldDetails = store.fieldDetails
    disposeStore = dispose
  })
})

afterEach(() => {
  fieldList.setSubscribedFormId(null)
  fieldList.clearRows()
  disposeStore()
})

describe('field details store', () => {
  it('stores independent detail settings and restores defaults on reset', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [
        field('user.name', 'field-name'),
        field('user.email', 'field-email'),
      ],
    })
    fieldList.setSelectedFieldPath('user.name')
    fieldList.setFieldPinned('field-email', true)

    expect(fieldDetails.getFieldDetailSettings('field-name')).toEqual({
      includeValues: true,
      errorPayloadMode: 'full',
      debounceMs: 0,
    })

    fieldDetails.updateFieldDetailSettings('field-name', {
      includeValues: false,
      errorPayloadMode: 'messages',
      debounceMs: 25,
    })
    fieldDetails.updateFieldDetailSettings('field-email', {
      errorPayloadMode: 'messages',
      debounceMs: -10,
    })

    expect(fieldDetails.getFieldDetailSettings('field-name')).toEqual({
      includeValues: false,
      errorPayloadMode: 'messages',
      debounceMs: 25,
    })
    expect(fieldDetails.getFieldDetailSettings('field-email')).toEqual({
      includeValues: true,
      errorPayloadMode: 'messages',
      debounceMs: 0,
    })

    fieldDetails.updateFieldDetailSettings('field-email', {
      debounceMs: Number.POSITIVE_INFINITY,
    })
    expect(fieldDetails.getFieldDetailSettings('field-email').debounceMs).toBe(
      0,
    )

    fieldDetails.resetFieldDetailSettings('field-name')

    expect(fieldDetails.getFieldDetailSettings('field-name')).toEqual({
      includeValues: true,
      errorPayloadMode: 'full',
      debounceMs: 0,
    })
    expect(fieldDetails.fieldDetailSettingsById().has('field-name')).toBe(false)
    expect(
      fieldDetails.getFieldDetailSettings('field-email').errorPayloadMode,
    ).toBe('messages')
  })

  it('keeps detail settings with a displayed field across path changes', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [field('items[0]', 'field-item')],
    })
    fieldList.setSelectedFieldPath('items[0]')
    fieldDetails.updateFieldDetailSettings('field-item', {
      includeValues: false,
      debounceMs: 50,
    })

    fieldList.applyPatch({
      formInstanceId: formA,
      upsert: [{ fieldId: 'field-item', path: 'items[1]' }],
    })

    expect(fieldList.selectedFieldPath()).toBe('items[1]')
    expect(fieldDetails.getFieldDetailSettings('field-item')).toEqual({
      includeValues: false,
      errorPayloadMode: 'full',
      debounceMs: 50,
    })
  })

  it('retains settings when unpinned fields remain selected', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [
        field('user.name', 'field-name'),
        field('user.email', 'field-email'),
      ],
    })
    fieldList.setSelectedFieldPath('user.name')
    fieldList.setFieldPinned('field-name', true)
    fieldDetails.updateFieldDetailSettings('field-name', {
      errorPayloadMode: 'messages',
    })

    fieldList.setFieldPinned('field-name', false)

    expect(
      fieldDetails.getFieldDetailSettings('field-name').errorPayloadMode,
    ).toBe('messages')

    fieldList.setSelectedFieldPath('user.email')

    expect(fieldDetails.getFieldDetailSettings('field-name')).toEqual({
      includeValues: true,
      errorPayloadMode: 'full',
      debounceMs: 0,
    })
    expect(fieldDetails.fieldDetailSettingsById().has('field-name')).toBe(false)
  })

  it('drops detail settings when displayed fields are removed or cleared', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [
        field('user.name', 'field-name'),
        field('user.email', 'field-email'),
        field('user.age', 'field-age'),
      ],
    })
    fieldList.setSelectedFieldPath('user.name')
    fieldList.setFieldPinned('field-email', true)
    fieldList.setFieldPinned('field-age', true)
    fieldDetails.updateFieldDetailSettings('field-name', { debounceMs: 10 })
    fieldDetails.updateFieldDetailSettings('field-email', { debounceMs: 20 })
    fieldDetails.updateFieldDetailSettings('field-age', { debounceMs: 30 })

    fieldList.applyPatch({
      formInstanceId: formA,
      remove: ['field-email'],
    })

    expect(fieldDetails.fieldDetailSettingsById().has('field-email')).toBe(
      false,
    )
    expect(fieldDetails.fieldDetailSettingsById().has('field-name')).toBe(true)

    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [field('user.name', 'field-name')],
    })

    expect(fieldDetails.fieldDetailSettingsById().has('field-age')).toBe(false)
    expect(fieldDetails.fieldDetailSettingsById().has('field-name')).toBe(true)

    fieldList.clearRows()

    expect(fieldDetails.fieldDetailSettingsById()).toEqual(new Map())
  })

  it('reconciles selected and pinned subscriptions and rejects stale details', () => {
    const disconnectEventBus = connectTestEventBus()
    const subscribed: Array<FieldDetailSubscriptionDescriptor> = []
    const unsubscribed: Array<FieldDetailSubscriptionDescriptor> = []
    const cleanupSubscribe = formDevtoolsEventClient.on(
      'field-detail-subscribe',
      (event) => subscribed.push(event.payload),
    )
    const cleanupUnsubscribe = formDevtoolsEventClient.on(
      'field-detail-unsubscribe',
      (event) => unsubscribed.push(event.payload),
    )
    let cleanupEvents: (() => void) | undefined

    try {
      fieldList.setSubscribedFormId(formA)
      fieldList.applySnapshot({
        formInstanceId: formA,
        fields: [
          field('user.name', 'field-name'),
          {
            ...field('user.email', 'field-email'),
            summary: { isDirty: true },
          },
        ],
      })
      fieldList.setSelectedFieldPath('user.name')
      fieldList.setFieldPinned('field-email', true)

      cleanupEvents = fieldDetails.mountEvents()

      expect(subscribed.map(({ fieldId }) => fieldId)).toEqual([
        'field-name',
        'field-email',
      ])

      const oldNameDescriptor = subscribed[0]!
      const oldDetail = {
        ...oldNameDescriptor,
        state: { value: 'Ada', meta: {} as never },
        relations: {
          directChildCount: 0,
          listensTo: [{ fieldId: 'field-email', causes: [] }],
          listenedToBy: [],
        },
        defaultValue: '',
      } satisfies DevtoolsFieldDetail
      formDevtoolsEventClient.emit('field-detail-changed', oldDetail)
      expect(fieldDetails.getFieldDetail('field-name')?.state.value).toBe('Ada')
      const relatedFieldId =
        fieldDetails.getFieldDetail('field-name')!.relations.listensTo[0]!
          .fieldId
      expect(fieldList.rowsByFieldId().get(relatedFieldId)?.path).toBe(
        'user.email',
      )
      expect(fieldMeta.getFieldSummary(relatedFieldId).isDirty).toBe(true)

      fieldDetails.updateFieldDetailSettings('field-name', {
        includeValues: false,
        debounceMs: 50,
      })

      const newNameDescriptor = subscribed.at(-1)!
      expect(newNameDescriptor).toMatchObject({
        formInstanceId: formA,
        fieldId: 'field-name',
        settings: {
          includeValues: false,
          errorPayloadMode: 'full',
          debounceMs: 50,
        },
      })
      expect(unsubscribed).toContainEqual(oldNameDescriptor)
      expect(fieldDetails.getFieldDetail('field-name')).toBeUndefined()

      formDevtoolsEventClient.emit('field-detail-changed', oldDetail)
      expect(fieldDetails.getFieldDetail('field-name')).toBeUndefined()

      const newDetail = {
        ...newNameDescriptor,
        state: { meta: {} as never },
        relations: {
          directChildCount: 0,
          listensTo: [],
          listenedToBy: [],
        },
      } satisfies DevtoolsFieldDetail
      formDevtoolsEventClient.emit('field-detail-changed', newDetail)
      expect(fieldDetails.getFieldDetail('field-name')).toBe(newDetail)
    } finally {
      cleanupEvents?.()
      cleanupUnsubscribe()
      cleanupSubscribe()
      disconnectEventBus()
    }
  })
})

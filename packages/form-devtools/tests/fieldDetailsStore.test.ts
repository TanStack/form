import { createRoot } from 'solid-js'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createFormDevtoolsStore } from '../src/stores/formDevtoolsStore'
import type { FormDevtoolsStore } from '../src/stores/formDevtoolsStore'
import type { DevtoolsMountedFieldScaffold } from '../src/eventClientTypes'
import type { FormId } from '../src/types/branded'

const formA = 'form-a' as FormId

function field(path: string, fieldId: string): DevtoolsMountedFieldScaffold {
  return { path, fieldId }
}

let fieldList!: FormDevtoolsStore['fieldList']
let fieldDetails!: FormDevtoolsStore['fieldDetails']
let disposeStore!: () => void

beforeEach(() => {
  createRoot((dispose) => {
    const store = createFormDevtoolsStore()
    fieldList = store.fieldList
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
      includeDefaultValue: true,
      errorPayloadMode: 'full',
      debounceMs: 0,
    })

    fieldDetails.updateFieldDetailSettings('field-name', {
      includeDefaultValue: false,
      errorPayloadMode: 'messages',
      debounceMs: 25,
    })
    fieldDetails.updateFieldDetailSettings('field-email', {
      errorPayloadMode: 'validity',
      debounceMs: -10,
    })

    expect(fieldDetails.getFieldDetailSettings('field-name')).toEqual({
      includeDefaultValue: false,
      errorPayloadMode: 'messages',
      debounceMs: 25,
    })
    expect(fieldDetails.getFieldDetailSettings('field-email')).toEqual({
      includeDefaultValue: true,
      errorPayloadMode: 'validity',
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
      includeDefaultValue: true,
      errorPayloadMode: 'full',
      debounceMs: 0,
    })
    expect(fieldDetails.fieldDetailSettingsById().has('field-name')).toBe(false)
    expect(
      fieldDetails.getFieldDetailSettings('field-email').errorPayloadMode,
    ).toBe('validity')
  })

  it('keeps detail settings with a displayed field across path changes', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [field('items[0]', 'field-item')],
    })
    fieldList.setSelectedFieldPath('items[0]')
    fieldDetails.updateFieldDetailSettings('field-item', {
      includeDefaultValue: false,
      debounceMs: 50,
    })

    fieldList.applyPatch({
      formInstanceId: formA,
      upsert: [{ fieldId: 'field-item', path: 'items[1]' }],
    })

    expect(fieldList.selectedFieldPath()).toBe('items[1]')
    expect(fieldDetails.getFieldDetailSettings('field-item')).toEqual({
      includeDefaultValue: false,
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
      includeDefaultValue: true,
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

    expect(fieldDetails.fieldDetailSettingsById().has('field-email')).toBe(false)
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
})

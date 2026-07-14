import { createRoot } from 'solid-js'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nameToFieldNodeSegments } from '@tanstack/form-core/internals'
import { createFormDevtoolsStore } from '../src/stores/formDevtoolsStore'
import type { FormDevtoolsStore } from '../src/stores/formDevtoolsStore'
import type { DevtoolsMountedFieldRow } from '../src/eventClientTypes'
import type { FormId } from '../src/types/branded'

const formA = 'form-a' as FormId
const formB = 'form-b' as FormId

function field(path: string, fieldId: string): DevtoolsMountedFieldRow {
  return {
    path,
    fieldId: fieldId,
    leaf: String(nameToFieldNodeSegments(path).at(-1) ?? path),
  }
}

let fieldList!: FormDevtoolsStore['fieldList']
let disposeStore!: () => void

beforeEach(() => {
  createRoot((dispose) => {
    fieldList = createFormDevtoolsStore().fieldList
    disposeStore = dispose
  })
})

afterEach(() => {
  fieldList.setSubscribedFormId(null)
  fieldList.setFieldSearchQuery('')
  fieldList.clearRows()
  disposeStore()
})

describe('field list store', () => {
  it('applies snapshots for the subscribed form and sorts rows by path', () => {
    fieldList.setSubscribedFormId(formA)

    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [
        field('items[10].name', 'field-10'),
        field('user.email', 'field-email'),
        field('items[2].name', 'field-2'),
      ],
    })

    expect(fieldList.fieldRows().map((row) => row.path)).toEqual([
      'items[2].name',
      'items[10].name',
      'user.email',
    ])
    expect(fieldList.rowsByPath().get('user.email')?.fieldId).toBe(
      'field-email',
    )
    expect(fieldList.rowsByFieldId().get('field-2')?.path).toBe('items[2].name')
  })

  it('ignores snapshots for other forms', () => {
    fieldList.setSubscribedFormId(formA)

    fieldList.applySnapshot({
      formInstanceId: formB,
      fields: [field('ignored', 'field-ignored')],
    })

    expect(fieldList.fieldRows()).toEqual([])
  })

  it('filters visible rows by field path without changing stored rows', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [
        field('user.name', 'field-name'),
        field('user.email', 'field-email'),
        field('settings.theme', 'field-theme'),
      ],
    })

    fieldList.setFieldSearchQuery('email')

    expect(fieldList.visibleFieldRows().map((row) => row.path)).toEqual([
      'user.email',
    ])
    expect(fieldList.fieldRows()).toHaveLength(3)
  })

  it('clears a stale selected path when a replacement snapshot omits it', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [field('user.name', 'field-name'), field('user.email', 'email')],
    })
    fieldList.setSelectedFieldPath('user.email')

    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [field('user.name', 'field-name')],
    })

    expect(fieldList.selectedFieldPath()).toBeNull()
    expect(fieldList.selectedFieldRow()?.path).toBe('user.name')
  })
})

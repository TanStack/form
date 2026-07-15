import { createRoot } from 'solid-js'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defaultDevtoolsMountedFieldSummary } from '../src/fieldSummaryMeta'
import { createFormDevtoolsStore } from '../src/stores/formDevtoolsStore'
import type { FormDevtoolsStore } from '../src/stores/formDevtoolsStore'
import type { DevtoolsMountedFieldScaffold } from '../src/eventClientTypes'
import type { FormId } from '../src/types/branded'

const formA = 'form-a' as FormId
const formB = 'form-b' as FormId

function field(path: string, fieldId: string): DevtoolsMountedFieldScaffold {
  return { path, fieldId }
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
  fieldList.setFieldFilterPipeline([])
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

  it('stores only non-default summaries and hydrates at consumption', () => {
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

    expect(fieldList.fieldSparseMetaById().size).toBe(1)
    expect(fieldList.getFieldSummary('field-name')).toBe(
      defaultDevtoolsMountedFieldSummary,
    )
    expect(fieldList.getFieldSummary('field-email')).toEqual({
      isDirty: true,
      isTouched: false,
      validity: 'valid',
    })
    expect(fieldList.getFieldSummary('another-pristine-field')).toBe(
      fieldList.getFieldSummary('field-name'),
    )
  })

  it('applies meta-only patches without replacing scaffold maps', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [field('user.name', 'field-name')],
    })
    const pathMap = fieldList.rowsByPath()
    const idMap = fieldList.rowsByFieldId()

    fieldList.applyPatch({
      formInstanceId: formA,
      upsert: [{ fieldId: 'field-name', setSummary: { isDirty: true } }],
    })

    expect(fieldList.rowsByPath()).toBe(pathMap)
    expect(fieldList.rowsByFieldId()).toBe(idMap)
    expect(fieldList.getFieldSummary('field-name')).toEqual({
      isDirty: true,
      isTouched: false,
      validity: 'valid',
    })

    fieldList.applyPatch({
      formInstanceId: formA,
      upsert: [{ fieldId: 'field-name', clearSummary: ['isDirty'] }],
    })

    expect(fieldList.fieldSparseMetaById().size).toBe(0)
    expect(fieldList.getFieldSummary('field-name')).toBe(
      defaultDevtoolsMountedFieldSummary,
    )
  })

  it('keeps selection and pins by field identity across path patches', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [field('items[0]', 'field-item')],
    })
    fieldList.setSelectedFieldPath('items[0]')
    fieldList.setFieldPinned('field-item', true)

    fieldList.applyPatch({
      formInstanceId: formA,
      upsert: [{ fieldId: 'field-item', path: 'items[1]' }],
    })

    expect(fieldList.selectedFieldPath()).toBe('items[1]')
    expect(fieldList.pinnedFieldIds()).toEqual(['field-item'])
    expect(fieldList.rowsByPath().has('items[0]')).toBe(false)

    fieldList.applyPatch({
      formInstanceId: formA,
      remove: ['field-item'],
    })

    expect(fieldList.selectedFieldPath()).toBeNull()
    expect(fieldList.pinnedFieldIds()).toEqual([])
    expect(fieldList.fieldRows()).toEqual([])
  })

  it('applies path swaps atomically without dropping sparse meta or pins', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [
        { ...field('items[0]', 'field-0'), summary: { isDirty: true } },
        field('items[1]', 'field-1'),
      ],
    })
    fieldList.setSelectedFieldPath('items[0]')
    fieldList.setFieldPinned('field-0', true)
    fieldList.setFieldPinned('field-1', true)

    fieldList.applyPatch({
      formInstanceId: formA,
      upsert: [
        { fieldId: 'field-0', path: 'items[1]' },
        { fieldId: 'field-1', path: 'items[0]' },
      ],
    })

    expect(fieldList.selectedFieldPath()).toBe('items[1]')
    expect(fieldList.pinnedFieldIds()).toEqual(['field-0', 'field-1'])
    expect(fieldList.getFieldSummary('field-0')).toEqual({
      isDirty: true,
      isTouched: false,
      validity: 'valid',
    })
    expect(fieldList.rowsByPath().get('items[0]')?.fieldId).toBe('field-1')
    expect(fieldList.rowsByPath().get('items[1]')?.fieldId).toBe('field-0')
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

  it('exposes a path leaf that stays aligned when a field moves', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [
        field('user.name', 'field-name'),
        field('items[0]', 'field-item'),
      ],
    })

    expect(
      fieldList.visibleFieldRows().map(({ path, pathLeaf }) => ({
        path,
        pathLeaf,
      })),
    ).toEqual([
      { path: 'items[0]', pathLeaf: '[0]' },
      { path: 'user.name', pathLeaf: 'name' },
    ])

    fieldList.applyPatch({
      formInstanceId: formA,
      upsert: [{ fieldId: 'field-name', path: 'user.email' }],
    })

    expect(
      fieldList.visibleFieldRows().find(
        ({ fieldId }) => fieldId === 'field-name',
      ),
    ).toMatchObject({ path: 'user.email', pathLeaf: 'email' })
    expect(fieldList.rowsByPath().get('user.email')?.pathLeaf).toBe('email')
    expect(fieldList.rowsByPath().has('user.name')).toBe(false)
  })

  it('filters visible rows through each predicate before fuzzy search', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [
        field('user.name', 'field-name'),
        field('user.email', 'field-email'),
        field('settings.theme', 'field-theme'),
      ],
    })
    fieldList.setFieldPinned('field-name', true)
    fieldList.setFieldPinned('field-theme', true)
    let predicateCalls = 0
    fieldList.setFieldFilterPipeline([
      (row) => {
        predicateCalls++
        return fieldList.isFieldPinned(row.fieldId)
      },
      (row) => row.path.startsWith('user.'),
    ])

    expect(fieldList.visibleFieldRows().map((row) => row.path)).toEqual([
      'user.name',
    ])
    const callsAfterFiltering = predicateCalls

    fieldList.setFieldSearchQuery('email')

    expect(fieldList.visibleFieldRows()).toEqual([])
    expect(predicateCalls).toBe(callsAfterFiltering)
    expect(fieldList.fieldRows()).toHaveLength(3)
  })

  it('does not subscribe filtering to sparse meta without a meta filter', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [field('user.name', 'field-name')],
    })
    let predicateCalls = 0
    fieldList.setFieldFilterPipeline([
      (row) => {
        predicateCalls++
        return row.path.startsWith('user.')
      },
    ])

    expect(fieldList.visibleFieldRows()).toHaveLength(1)
    const callsBeforeMetaPatch = predicateCalls

    fieldList.applyPatch({
      formInstanceId: formA,
      upsert: [{ fieldId: 'field-name', setSummary: { isDirty: true } }],
    })

    expect(fieldList.visibleFieldRows()).toHaveLength(1)
    expect(predicateCalls).toBe(callsBeforeMetaPatch)
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

  it('tracks pinned fields once and preserves the order they were pinned', () => {
    fieldList.setFieldPinned('field-name', true)
    fieldList.setFieldPinned('field-email', true)
    fieldList.setFieldPinned('field-name', true)

    expect(fieldList.pinnedFieldIds()).toEqual(['field-name', 'field-email'])

    fieldList.toggleFieldPinned('field-name')

    expect(fieldList.pinnedFieldIds()).toEqual(['field-email'])
  })

  it('puts the selected field before pinned fields without duplicate cards', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [
        field('user.name', 'field-name'),
        field('user.email', 'field-email'),
        field('settings.theme', 'field-theme'),
      ],
    })
    fieldList.setFieldPinned('field-email', true)
    fieldList.setFieldPinned('field-name', true)
    fieldList.setFieldPinned('field-theme', true)
    fieldList.setSelectedFieldPath('user.name')

    expect(fieldList.mainPanelFieldRows().map((row) => row.fieldId)).toEqual([
      'field-name',
      'field-email',
      'field-theme',
    ])
  })

  it('drops pins for fields omitted by a replacement snapshot', () => {
    fieldList.setSubscribedFormId(formA)
    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [
        field('user.name', 'field-name'),
        field('user.email', 'field-email'),
      ],
    })
    fieldList.setFieldPinned('field-name', true)
    fieldList.setFieldPinned('field-email', true)

    fieldList.applySnapshot({
      formInstanceId: formA,
      fields: [field('user.email', 'field-email')],
    })

    expect(fieldList.pinnedFieldIds()).toEqual(['field-email'])
  })
})

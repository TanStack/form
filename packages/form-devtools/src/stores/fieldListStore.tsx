import {
  batch,
  createEffect,
  createMemo,
  createRoot,
  createSignal,
} from 'solid-js'
import fuzzysort from 'fuzzysort'
import { createListCollection } from '@ark-ui/solid'
import { nameToFieldNodeSegments } from '@tanstack/form-core/internals'
import type { Accessor } from 'solid-js'
import type {
  DevtoolsMountedFieldPatch,
  DevtoolsMountedFieldScaffold,
  DevtoolsMountedFieldSummary,
  DevtoolsMountedFieldSummaryPatch,
  DevtoolsMountedForm,
} from '@/eventClientTypes'
import type { FieldId, FormId } from '@/types/branded'
import { compareFieldPaths } from '@/bridge/utils'
import { formDevtoolsEventClient } from '@/eventClient.lib'
import {
  defaultDevtoolsMountedFieldSummary,
  hydrateDevtoolsMountedFieldSummary,
} from '@/fieldSummaryMeta'

export type DevtoolsFieldListRow = Readonly<
  Omit<DevtoolsMountedFieldScaffold, 'summary'> & {
    pathLeaf: string
  }
>

export const [subscribedFormId, setSubscribedFormId] =
  createSignal<FormId | null>(null)

export const [rowsByPath, setRowsByPath] = createSignal<
  Map<string, DevtoolsFieldListRow>
>(new Map(), { equals: false })

export const [rowsByFieldId, setRowsByFieldId] = createSignal<
  Map<FieldId, DevtoolsFieldListRow>
>(new Map(), { equals: false })

export const [fieldSparseMetaById, setFieldSparseMetaById] = createSignal<
  Map<FieldId, DevtoolsMountedFieldSummaryPatch>
>(new Map(), { equals: false })

export const [selectedFieldPath, setSelectedFieldPath] = createSignal<
  string | null
>(null)

export const [pinnedFieldIds, setPinnedFieldIds] = createSignal<
  ReadonlyArray<FieldId>
>([])

export const [fieldSearchQuery, setFieldSearchQuery] = createSignal('')

export type FieldRowFilterPredicate = {
  (field: DevtoolsFieldListRow, summary: DevtoolsMountedFieldSummary): boolean
  bypassesDefaultInclusion?: boolean
  usesSummary?: boolean
}

export function createFieldSummaryFilterPredicate(
  predicate: FieldRowFilterPredicate,
): FieldRowFilterPredicate {
  predicate.usesSummary = true
  return predicate
}

export const [fieldFilterPipeline, setFieldFilterPipeline] = createSignal<
  Array<FieldRowFilterPredicate>
>([])

export function getFieldSummary(fieldId: FieldId): DevtoolsMountedFieldSummary {
  return hydrateDevtoolsMountedFieldSummary(fieldSparseMetaById().get(fieldId))
}

export function isFieldPinned(fieldId: FieldId): boolean {
  return pinnedFieldIds().includes(fieldId)
}

export function setFieldPinned(fieldId: FieldId, pinned: boolean): void {
  setPinnedFieldIds((current) => {
    const isPinned = current.includes(fieldId)

    if (isPinned === pinned) return current
    if (pinned) return [...current, fieldId]

    return current.filter((id) => id !== fieldId)
  })
}

export function toggleFieldPinned(fieldId: FieldId): void {
  setFieldPinned(fieldId, !isFieldPinned(fieldId))
}

function compareFieldRowsByPath(
  a: DevtoolsFieldListRow,
  b: DevtoolsFieldListRow,
): number {
  return compareFieldPaths(a.path, b.path)
}

function getFieldPathLeaf(path: string): string {
  const leaf = nameToFieldNodeSegments(path).at(-1)
  if (leaf === undefined) return path
  return typeof leaf === 'number' ? `[${leaf}]` : leaf
}

function createFieldListRow(
  field: Omit<DevtoolsMountedFieldScaffold, 'summary'>,
): DevtoolsFieldListRow {
  return {
    ...field,
    isMounted: field.isMounted ?? true,
    pathLeaf: getFieldPathLeaf(field.path),
  }
}

export function createFieldListComputations() {
  const fieldRows = createMemo(() =>
    Array.from(rowsByPath().values()).sort(compareFieldRowsByPath),
  )

  const filteredFieldRows = createMemo(() => {
    const predicates = fieldFilterPipeline()
    const rows = fieldRows()
    const bypassesDefaultInclusion = predicates.some(
      (predicate) => predicate.bypassesDefaultInclusion,
    )
    const usesSummary = predicates.some((predicate) => predicate.usesSummary)

    return rows.filter((field) => {
      const needsSummary =
        usesSummary ||
        (!bypassesDefaultInclusion && field.isMounted === false)
      const summary = needsSummary
        ? getFieldSummary(field.fieldId)
        : defaultDevtoolsMountedFieldSummary

      if (
        !bypassesDefaultInclusion &&
        field.isMounted === false &&
        !summary.hasSelfErrors
      ) {
        return false
      }

      return predicates.every((predicate) => predicate(field, summary))
    })
  })

  const visibleFieldRows = createMemo(() => {
    const results = fuzzysort.go(fieldSearchQuery(), filteredFieldRows(), {
      keys: ['path', 'pathLeaf'],
      all: true,
      scoreFn: (results) => {
        const pathScore = results[0]?.score ?? 0
        const leafScore = results[1]?.score ?? 0

        return Math.max(pathScore, leafScore * 2)
      },
    })
    return results.map((obj) => obj.obj)
  })

  const selectedFieldRow = createMemo<DevtoolsFieldListRow | null>(() => {
    const requestedPath = selectedFieldPath()
    const fallback = visibleFieldRows()[0] ?? null

    if (requestedPath) {
      return rowsByPath().get(requestedPath) ?? fallback
    }

    return fallback
  })

  const mainPanelFieldRows = createMemo(() => {
    const selected = selectedFieldRow()
    const seenFieldIds = new Set<FieldId>()
    const rows: Array<DevtoolsFieldListRow> = []

    if (selected) {
      seenFieldIds.add(selected.fieldId)
      rows.push(selected)
    }

    for (const fieldId of pinnedFieldIds()) {
      if (seenFieldIds.has(fieldId)) continue
      const row = rowsByFieldId().get(fieldId)
      if (!row) continue

      seenFieldIds.add(fieldId)
      rows.push(row)
    }

    return rows
  })

  const fieldsListCollection = createMemo(() =>
    createListCollection({
      items: visibleFieldRows(),
      itemToString: (item) => item.path,
      itemToValue: (item) => item.fieldId,
    }),
  )

  return {
    fieldRows,
    filteredFieldRows,
    visibleFieldRows,
    fieldsListCollection,
    selectedFieldRow,
    mainPanelFieldRows,
  }
}

export function clearFieldRows(): void {
  batch(() => {
    setRowsByPath(new Map())
    setRowsByFieldId(new Map())
    setFieldSparseMetaById(new Map())
    setSelectedFieldPath(null)
    setPinnedFieldIds([])
  })
}

function setSummaryValue<TKey extends keyof DevtoolsMountedFieldSummary>(
  summary: DevtoolsMountedFieldSummaryPatch,
  key: TKey,
  value: DevtoolsMountedFieldSummary[TKey] | undefined,
): void {
  summary[key] = value
}

function normalizeSummaryPatch(
  patch: DevtoolsMountedFieldSummaryPatch | undefined,
): DevtoolsMountedFieldSummaryPatch | undefined {
  if (!patch) return undefined

  let normalized: DevtoolsMountedFieldSummaryPatch | undefined
  for (const key of Object.keys(patch) as Array<
    keyof DevtoolsMountedFieldSummary
  >) {
    const value = patch[key]
    if (Object.is(value, defaultDevtoolsMountedFieldSummary[key])) {
      continue
    }
    normalized ??= {}
    setSummaryValue(normalized, key, value)
  }
  return normalized
}

export function applyFieldListSnapshot({
  formInstanceId,
  fields,
}: {
  formInstanceId: FormId
  fields: Array<DevtoolsMountedFieldScaffold>
}): void {
  if (formInstanceId !== subscribedFormId()) return

  const currentRowsByPath = rowsByPath()
  const selectedId = selectedFieldPath()
    ? currentRowsByPath.get(selectedFieldPath()!)?.fieldId
    : undefined
  const nextRowsByPath = new Map<string, DevtoolsFieldListRow>()
  const nextRowsByFieldId = new Map<FieldId, DevtoolsFieldListRow>()
  const nextSparseMetaById = new Map<
    FieldId,
    DevtoolsMountedFieldSummaryPatch
  >()

  for (const { summary, ...field } of fields) {
    const row = createFieldListRow(field)
    nextRowsByPath.set(row.path, row)
    nextRowsByFieldId.set(row.fieldId, row)

    const normalizedSummary = normalizeSummaryPatch(summary)
    if (normalizedSummary) {
      nextSparseMetaById.set(row.fieldId, normalizedSummary)
    }
  }

  batch(() => {
    setRowsByPath(nextRowsByPath)
    setRowsByFieldId(nextRowsByFieldId)
    setFieldSparseMetaById(nextSparseMetaById)

    if (selectedId) {
      setSelectedFieldPath(nextRowsByFieldId.get(selectedId)?.path ?? null)
    } else {
      const requestedPath = selectedFieldPath()
      if (requestedPath && !nextRowsByPath.has(requestedPath)) {
        setSelectedFieldPath(null)
      }
    }

    const nextPinnedFieldIds = pinnedFieldIds().filter((fieldId) =>
      nextRowsByFieldId.has(fieldId),
    )
    if (nextPinnedFieldIds.length !== pinnedFieldIds().length) {
      setPinnedFieldIds(nextPinnedFieldIds)
    }
  })
}

function applySummaryChanges(
  fieldId: FieldId,
  setSummary: DevtoolsMountedFieldSummaryPatch | undefined,
  clearSummary: Array<keyof DevtoolsMountedFieldSummary> | undefined,
): boolean {
  if (!setSummary && !clearSummary) return false

  const metaById = fieldSparseMetaById()
  const current = metaById.get(fieldId)
  let next = current
  let changed = false

  const mutate = () => (next === current ? { ...current } : next!)

  for (const key of clearSummary ?? []) {
    if (!Object.hasOwn(next ?? {}, key)) continue
    next = mutate()
    delete next[key]
    changed = true
  }

  for (const key of Object.keys(setSummary ?? {}) as Array<
    keyof DevtoolsMountedFieldSummary
  >) {
    const value = setSummary![key]
    const isBaseline = Object.is(value, defaultDevtoolsMountedFieldSummary[key])
    const hasKey = Object.hasOwn(next ?? {}, key)

    if (isBaseline) {
      if (!hasKey) continue
      next = mutate()
      delete next[key]
      changed = true
      continue
    }

    if (hasKey && Object.is(next?.[key], value)) continue
    next = mutate()
    setSummaryValue(next, key, value)
    changed = true
  }

  if (!changed) return false

  if (next && Object.keys(next).length > 0) metaById.set(fieldId, next)
  else metaById.delete(fieldId)
  return true
}

export function applyFieldListPatch({
  formInstanceId,
  upsert = [],
  remove = [],
}: {
  formInstanceId: FormId
  upsert?: Array<DevtoolsMountedFieldPatch>
  remove?: Array<FieldId>
}): void {
  if (formInstanceId !== subscribedFormId()) return

  const byPath = rowsByPath()
  const byFieldId = rowsByFieldId()
  const metaById = fieldSparseMetaById()
  let scaffoldChanged = false
  let summaryChanged = false
  let selectedPath = selectedFieldPath()
  const selectedFieldId = selectedPath
    ? byPath.get(selectedPath)?.fieldId
    : undefined
  let nextPinnedFieldIds: ReadonlyArray<FieldId> | undefined
  const removedIds = new Set<FieldId>()

  for (const fieldId of remove) {
    const row = byFieldId.get(fieldId)
    if (!row) {
      if (metaById.delete(fieldId)) summaryChanged = true
      continue
    }

    byFieldId.delete(fieldId)
    byPath.delete(row.path)
    scaffoldChanged = true
    if (metaById.delete(fieldId)) summaryChanged = true
    if (selectedPath === row.path) selectedPath = null
    removedIds.add(fieldId)
  }

  // Remove every moving field's old path before assigning any final path. This
  // keeps swaps and cycles from temporarily displacing another moving field.
  for (const patch of upsert) {
    if (patch.path === undefined) continue
    const row = byFieldId.get(patch.fieldId)
    if (!row || row.path === patch.path) continue
    byPath.delete(row.path)
  }

  for (const patch of upsert) {
    let row = byFieldId.get(patch.fieldId)

    if (patch.path !== undefined) {
      const displaced = byPath.get(patch.path)
      if (displaced && displaced.fieldId !== patch.fieldId) {
        byFieldId.delete(displaced.fieldId)
        if (metaById.delete(displaced.fieldId)) summaryChanged = true
        removedIds.add(displaced.fieldId)
        if (selectedPath === displaced.path) selectedPath = null
      }

      const isMounted = patch.isMounted ?? row?.isMounted ?? true
      if (
        !row ||
        row.path !== patch.path ||
        row.isMounted !== isMounted
      ) {
        row = createFieldListRow({
          fieldId: patch.fieldId,
          path: patch.path,
          isMounted,
        })
        byPath.set(row.path, row)
        byFieldId.set(row.fieldId, row)
        scaffoldChanged = true
      }
    } else if (
      row &&
      patch.isMounted !== undefined &&
      row.isMounted !== patch.isMounted
    ) {
      row = createFieldListRow({
        fieldId: row.fieldId,
        path: row.path,
        isMounted: patch.isMounted,
      })
      byPath.set(row.path, row)
      byFieldId.set(row.fieldId, row)
      scaffoldChanged = true
    }

    if (!row) continue
    if (
      applySummaryChanges(patch.fieldId, patch.setSummary, patch.clearSummary)
    ) {
      summaryChanged = true
    }
  }

  if (removedIds.size > 0) {
    const currentPins = pinnedFieldIds()
    const nextPins = currentPins.filter((id) => !removedIds.has(id))
    if (nextPins.length !== currentPins.length) {
      nextPinnedFieldIds = nextPins
    }
  }

  if (selectedFieldId) {
    selectedPath = byFieldId.get(selectedFieldId)?.path ?? null
  } else if (selectedPath && !byPath.has(selectedPath)) {
    selectedPath = null
  }

  batch(() => {
    if (scaffoldChanged) {
      setRowsByPath(byPath)
      setRowsByFieldId(byFieldId)
    }
    if (summaryChanged) setFieldSparseMetaById(metaById)
    if (selectedPath !== selectedFieldPath()) {
      setSelectedFieldPath(selectedPath)
    }
    if (nextPinnedFieldIds) setPinnedFieldIds(nextPinnedFieldIds)
  })
}

export const fieldListCache = {
  subscribedFormId,
  setSubscribedFormId,
  rowsByPath,
  setRowsByPath,
  rowsByFieldId,
  setRowsByFieldId,
  fieldSparseMetaById,
  setFieldSparseMetaById,
  getFieldSummary,
  selectedFieldPath,
  setSelectedFieldPath,
  pinnedFieldIds,
  setPinnedFieldIds,
  isFieldPinned,
  setFieldPinned,
  toggleFieldPinned,
  fieldSearchQuery,
  setFieldSearchQuery,
  fieldFilterPipeline,
  setFieldFilterPipeline,
  createFieldSummaryFilterPredicate,
  clearRows: clearFieldRows,
  applySnapshot: applyFieldListSnapshot,
  applyPatch: applyFieldListPatch,
}

let fieldListEventConsumers = 0
let cleanupFieldListEvents: (() => void) | undefined
// Devtools roots share the cache, so bridge subscriptions must stay active
// until the final root using a form releases them.
const subscriptionConsumers = new Map<FormId, number>()

function retainFieldListEvents(): () => void {
  if (fieldListEventConsumers === 0) {
    const cleanupSnapshotEvents = formDevtoolsEventClient.on(
      'field-list-snapshot',
      (event) => applyFieldListSnapshot(event.payload),
    )
    const cleanupPatchEvents = formDevtoolsEventClient.on(
      'field-list-patch',
      (event) => applyFieldListPatch(event.payload),
    )
    cleanupFieldListEvents = () => {
      cleanupSnapshotEvents()
      cleanupPatchEvents()
    }
  }

  fieldListEventConsumers++
  let isRetained = true

  return () => {
    if (!isRetained) return
    isRetained = false
    fieldListEventConsumers--

    if (fieldListEventConsumers === 0) {
      cleanupFieldListEvents?.()
      cleanupFieldListEvents = undefined
    }
  }
}

function retainFormSubscription(formInstanceId: FormId): () => void {
  const consumerCount = subscriptionConsumers.get(formInstanceId) ?? 0

  if (consumerCount === 0) {
    setSubscribedFormId(formInstanceId)
    clearFieldRows()
    formDevtoolsEventClient.emit('field-list-subscribe', { formInstanceId })
  }

  subscriptionConsumers.set(formInstanceId, consumerCount + 1)
  let isRetained = true

  return () => {
    if (!isRetained) return
    isRetained = false

    const nextConsumerCount =
      (subscriptionConsumers.get(formInstanceId) ?? 1) - 1

    if (nextConsumerCount > 0) {
      subscriptionConsumers.set(formInstanceId, nextConsumerCount)
      return
    }

    subscriptionConsumers.delete(formInstanceId)
    formDevtoolsEventClient.emit('field-list-unsubscribe', { formInstanceId })

    if (subscribedFormId() === formInstanceId) {
      setSubscribedFormId(null)
      clearFieldRows()
    }
  }
}

export function mountFieldListEvents(
  selectedForm: Accessor<DevtoolsMountedForm | null>,
): () => void {
  return createRoot((dispose) => {
    const releaseFieldListEvents = retainFieldListEvents()
    let activeFormId: FormId | null = null
    let releaseFormSubscription: (() => void) | undefined

    const updateSubscription = () => {
      const nextFormId = selectedForm()?.instanceId ?? null

      if (nextFormId === activeFormId) return

      releaseFormSubscription?.()
      activeFormId = nextFormId
      releaseFormSubscription = nextFormId
        ? retainFormSubscription(nextFormId)
        : undefined
    }

    updateSubscription()
    createEffect(updateSubscription)

    return () => {
      releaseFormSubscription?.()
      releaseFieldListEvents()
      dispose()
    }
  })
}

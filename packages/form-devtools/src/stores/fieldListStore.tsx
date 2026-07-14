import {
  batch,
  createEffect,
  createMemo,
  createRoot,
  createSignal,
} from 'solid-js'
import fuzzysort from 'fuzzysort'
import { createListCollection } from '@ark-ui/solid'
import type { Accessor } from 'solid-js'
import type {
  DevtoolsMountedFieldRow,
  DevtoolsMountedForm,
} from '@/eventClientTypes'
import type { FieldId, FormId } from '@/types/branded'
import { compareFieldPaths } from '@/bridge/utils'
import { formDevtoolsEventClient } from '@/eventClient.lib'

export const [subscribedFormId, setSubscribedFormId] =
  createSignal<FormId | null>(null)

export const [rowsByPath, setRowsByPath] = createSignal<
  Map<string, DevtoolsMountedFieldRow>
>(new Map())

export const [rowsByFieldId, setRowsByFieldId] = createSignal<
  Map<FieldId, DevtoolsMountedFieldRow>
>(new Map())

export const [selectedFieldPath, setSelectedFieldPath] = createSignal<
  string | null
>(null)

export const [pinnedFieldIds, setPinnedFieldIds] = createSignal<
  ReadonlyArray<FieldId>
>([])

export const [fieldSearchQuery, setFieldSearchQuery] = createSignal('')

export type FieldRowFilterPredicate = (
  field: DevtoolsMountedFieldRow,
) => boolean

export const [fieldFilterPipeline, setFieldFilterPipeline] = createSignal<
  Array<FieldRowFilterPredicate>
>([])

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
  a: DevtoolsMountedFieldRow,
  b: DevtoolsMountedFieldRow,
): number {
  return compareFieldPaths(a.path, b.path)
}

export function createFieldListComputations() {
  const fieldRows = createMemo(() =>
    Array.from(rowsByPath().values()).sort(compareFieldRowsByPath),
  )

  const filteredFieldRows = createMemo(() => {
    const predicates = fieldFilterPipeline()

    return fieldRows().filter((field) =>
      predicates.every((predicate) => predicate(field)),
    )
  })

  const visibleFieldRows = createMemo(() => {
    const results = fuzzysort.go(fieldSearchQuery(), filteredFieldRows(), {
      keys: ['path', 'leaf'],
      all: true,
      scoreFn: (results) => {
        const pathScore = results[0]?.score ?? 0
        const leafScore = results[1]?.score ?? 0

        return Math.max(pathScore, leafScore * 2)
      },
    })
    return results.map((obj) => obj.obj)
  })

  const selectedFieldRow = createMemo<DevtoolsMountedFieldRow | null>(() => {
    const requestedPath = selectedFieldPath()
    const rows = fieldRows()

    if (requestedPath) {
      return rowsByPath().get(requestedPath) ?? rows[0] ?? null
    }

    return rows[0] ?? null
  })

  const mainPanelFieldRows = createMemo(() => {
    const selected = selectedFieldRow()
    const seenFieldIds = new Set<FieldId>()
    const rows: Array<DevtoolsMountedFieldRow> = []

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
    setSelectedFieldPath(null)
    setPinnedFieldIds([])
  })
}

export function applyFieldListSnapshot({
  formInstanceId,
  fields,
}: {
  formInstanceId: FormId
  fields: Array<DevtoolsMountedFieldRow>
}): void {
  if (formInstanceId !== subscribedFormId()) return

  const nextRowsByPath = new Map<string, DevtoolsMountedFieldRow>()
  const nextRowsByFieldId = new Map<FieldId, DevtoolsMountedFieldRow>()

  for (const field of fields) {
    nextRowsByPath.set(field.path, field)
    nextRowsByFieldId.set(field.fieldId, field)
  }

  batch(() => {
    setRowsByPath(nextRowsByPath)
    setRowsByFieldId(nextRowsByFieldId)

    const requestedPath = selectedFieldPath()
    if (requestedPath && !nextRowsByPath.has(requestedPath)) {
      setSelectedFieldPath(null)
    }

    const nextPinnedFieldIds = pinnedFieldIds().filter((fieldId) =>
      nextRowsByFieldId.has(fieldId),
    )
    if (nextPinnedFieldIds.length !== pinnedFieldIds().length) {
      setPinnedFieldIds(nextPinnedFieldIds)
    }
  })
}

export const fieldListCache = {
  subscribedFormId,
  setSubscribedFormId,
  rowsByPath,
  setRowsByPath,
  rowsByFieldId,
  setRowsByFieldId,
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
  clearRows: clearFieldRows,
  applySnapshot: applyFieldListSnapshot,
}

let snapshotEventConsumers = 0
let cleanupSnapshotEvents: (() => void) | undefined
// Devtools roots share the cache, so bridge subscriptions must stay active
// until the final root using a form releases them.
const subscriptionConsumers = new Map<FormId, number>()

function retainSnapshotEvents(): () => void {
  if (snapshotEventConsumers === 0) {
    cleanupSnapshotEvents = formDevtoolsEventClient.on(
      'field-list-snapshot',
      (event) => applyFieldListSnapshot(event.payload),
    )
  }

  snapshotEventConsumers++
  let isRetained = true

  return () => {
    if (!isRetained) return
    isRetained = false
    snapshotEventConsumers--

    if (snapshotEventConsumers === 0) {
      cleanupSnapshotEvents?.()
      cleanupSnapshotEvents = undefined
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
    const releaseSnapshotEvents = retainSnapshotEvents()
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
      releaseSnapshotEvents()
      dispose()
    }
  })
}

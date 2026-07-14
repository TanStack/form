import {
  batch,
  createEffect,
  createMemo,
  createRoot,
  createSignal,
} from 'solid-js'
import fuzzysort from 'fuzzysort'
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

export const [fieldSearchQuery, setFieldSearchQuery] = createSignal('')

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

  const visibleFieldRows = createMemo(() => {
    const results = fuzzysort.go(fieldSearchQuery(), fieldRows(), {
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

  return { fieldRows, visibleFieldRows, selectedFieldRow }
}

export function clearFieldRows(): void {
  batch(() => {
    setRowsByPath(new Map())
    setRowsByFieldId(new Map())
    setSelectedFieldPath(null)
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
  fieldSearchQuery,
  setFieldSearchQuery,
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

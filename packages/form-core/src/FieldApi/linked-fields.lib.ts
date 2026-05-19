import type {
  AnyFieldValidator,
  AnyInternalFieldApi,
  FieldListenToFields,
} from './FieldApi.lib'
import type { AnyInternalFormApi } from '../FormApi/FormApi.lib'
import type { AnyFieldListener } from '../listeners.public'

type WatcherIndex = number

interface ListenToFieldsMeta {
  field: AnyInternalFieldApi
  name: string
}

interface WatchFieldOperation {
  sourceField: AnyInternalFieldApi
  watchingField: AnyInternalFieldApi
  watcherIndex: WatcherIndex
}

interface ReconciledWatchedFields<TItem> {
  items: Array<TItem> | null
  listenToFields: FieldListenToFields | null
  attach: Array<WatchFieldOperation>
  detach: Array<WatchFieldOperation>
}

type WatcherKey = `${number}:${string}`

function toWatcherKey(watcherIndex: number, name: string): WatcherKey {
  return `${watcherIndex}:${name}`
}
function ofWatcherKey(key: WatcherKey): [watcherIndex: number, name: string] {
  const [watcherIndex, name] = key.split(':') as [number, string]
  return [Number(watcherIndex), name]
}

function reconcileWatchedFields<TItem extends { watchFields?: Array<string> }>({
  nextItems,
  prevListenToFields,
  field,
  form,
}: {
  nextItems: Array<TItem> | null | undefined
  prevListenToFields: FieldListenToFields | null
  field: AnyInternalFieldApi
  form: AnyInternalFormApi
}): ReconciledWatchedFields<TItem> {
  const normalizedItems = nextItems && nextItems.length > 0 ? nextItems : null
  const prevByKey = new Map<WatcherKey, ListenToFieldsMeta>()

  prevListenToFields?.forEach((prevMetas, watcherIndex) => {
    for (const prevMeta of prevMetas) {
      prevByKey.set(toWatcherKey(watcherIndex, prevMeta.name), prevMeta)
    }
  })

  const nextListenToFields: FieldListenToFields = []
  const attach: Array<WatchFieldOperation> = []
  const detach: Array<WatchFieldOperation> = []

  if (normalizedItems) {
    normalizedItems.forEach(({ watchFields = [] }, watcherIndex) => {
      const names = [...new Set(watchFields)]
      if (names.length === 0) return

      nextListenToFields[watcherIndex] = names.map((name) => {
        const sourceField = form._getOrCreateFieldApi({ name })
        const key = toWatcherKey(watcherIndex, name)
        const prevMeta = prevByKey.get(key)

        // Changed or unchanged name, it resolved back to the same field
        if (prevMeta?.field === sourceField) {
          prevByKey.delete(key)
          return prevMeta
        }

        // Field reference and name are mismatched, so detach to reattach to actual
        if (prevMeta) {
          detach.push({
            sourceField: prevMeta.field,
            watchingField: field,
            watcherIndex,
          })
          prevByKey.delete(key)
        }

        attach.push({
          sourceField,
          watchingField: field,
          watcherIndex,
        })
        return { name, field: sourceField }
      })
    })
  }

  for (const [key, prevMeta] of prevByKey.entries()) {
    detach.push({
      sourceField: prevMeta.field,
      watchingField: field,
      watcherIndex: ofWatcherKey(key)[0],
    })
  }

  return {
    items: normalizedItems,
    listenToFields: nextListenToFields.length > 0 ? nextListenToFields : null,
    attach,
    detach,
  }
}

export function reconcileWatchedListenerFields({
  nextListeners,
  prevListenToFields,
  field,
  form,
}: {
  nextListeners: Array<AnyFieldListener> | null | undefined
  prevListenToFields: FieldListenToFields | null
  field: AnyInternalFieldApi
  form: AnyInternalFormApi
}): ReconciledWatchedFields<AnyFieldListener> {
  return reconcileWatchedFields({
    nextItems: nextListeners,
    prevListenToFields,
    field,
    form,
  })
}

export function reconcileWatchedValidatorFields({
  nextValidators,
  prevListenToFields,
  field,
  form,
}: {
  nextValidators: Array<AnyFieldValidator> | null | undefined
  prevListenToFields: FieldListenToFields | null
  field: AnyInternalFieldApi
  form: AnyInternalFormApi
}): ReconciledWatchedFields<AnyFieldValidator> {
  return reconcileWatchedFields({
    nextItems: nextValidators,
    prevListenToFields,
    field,
    form,
  })
}

function attachWatchingField(
  getWatchingFields: (
    sourceField: AnyInternalFieldApi,
  ) => Map<AnyInternalFieldApi, Set<number>> | null,
  setWatchingFields: (
    sourceField: AnyInternalFieldApi,
    watchingFields: Map<AnyInternalFieldApi, Set<number>>,
  ) => void,
  { sourceField, watchingField, watcherIndex }: WatchFieldOperation,
) {
  let watchingFields = getWatchingFields(sourceField)
  if (!watchingFields) {
    watchingFields = new Map()
    setWatchingFields(sourceField, watchingFields)
  }

  let indices = watchingFields.get(watchingField)

  if (!indices) {
    indices = new Set()
    watchingFields.set(watchingField, indices)
  }

  indices.add(watcherIndex)
}

function detachWatchingField(
  getWatchingFields: (
    sourceField: AnyInternalFieldApi,
  ) => Map<AnyInternalFieldApi, Set<number>> | null,
  clearWatchingFields: (sourceField: AnyInternalFieldApi) => void,
  { sourceField, watchingField, watcherIndex }: WatchFieldOperation,
) {
  const watchingFields = getWatchingFields(sourceField)
  if (!watchingFields) return

  const indices = watchingFields.get(watchingField)
  if (!indices) return

  indices.delete(watcherIndex)

  if (indices.size === 0) {
    watchingFields.delete(watchingField)
    if (watchingFields.size === 0) {
      clearWatchingFields(sourceField)
    }
  }

  sourceField._pruneIfUnused()
}

export function attachWatchingListenerField(operation: WatchFieldOperation) {
  attachWatchingField(
    (source) => source._watchingFields,
    (source, watchingFields) => {
      source._watchingFields = watchingFields
    },
    operation,
  )
}

export function detachWatchingListenerField(operation: WatchFieldOperation) {
  detachWatchingField(
    (source) => source._watchingFields,
    (source) => {
      source._watchingFields = null
    },
    operation,
  )
}

export function attachWatchingValidatorField(operation: WatchFieldOperation) {
  attachWatchingField(
    (source) => source._watchingValidatorFields,
    (source, watchingFields) => {
      source._watchingValidatorFields = watchingFields
    },
    operation,
  )
}

export function detachWatchingValidatorField(operation: WatchFieldOperation) {
  detachWatchingField(
    (source) => source._watchingValidatorFields,
    (source) => {
      source._watchingValidatorFields = null
    },
    operation,
  )
}

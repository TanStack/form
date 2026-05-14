import type { AnyInternalFieldApi, FieldListenToFields } from './FieldApi.lib'
import type { AnyInternalFormApi } from './FormApi.lib'
import type { FieldListener } from './listeners.public'

type AnyFieldListener = FieldListener<any, any, any>

type ListenerIndex = number

interface ListenToFieldsMeta {
  field: AnyInternalFieldApi
  name: string
}

interface WatchFieldOperation {
  sourceField: AnyInternalFieldApi
  listeningField: AnyInternalFieldApi
  listenerIndex: ListenerIndex
}

interface ReconciledWatchedFields {
  listeners: Array<AnyFieldListener> | null
  listenToFields: FieldListenToFields
  attach: Array<WatchFieldOperation>
  detach: Array<WatchFieldOperation>
}

type ListenerKey = `${number}:${string}`

function toListenerKey(listenerIndex: number, name: string): ListenerKey {
  return `${listenerIndex}:${name}`
}
function ofListenerKey(
  key: ListenerKey,
): [listenerIndex: number, name: string] {
  const [listenerIndex, name] = key.split(':') as [number, string]
  return [Number(listenerIndex), name]
}

export function reconcileWatchedFields({
  nextListeners,
  prevListenToFields,
  field,
  form,
}: {
  nextListeners: Array<FieldListener<any, any, any>> | null | undefined
  prevListenToFields: FieldListenToFields
  field: AnyInternalFieldApi
  form: AnyInternalFormApi
}): ReconciledWatchedFields {
  const normalizedListeners =
    nextListeners && nextListeners.length > 0 ? nextListeners : null
  const prevByKey = new Map<ListenerKey, ListenToFieldsMeta>()

  prevListenToFields.forEach((prevMetas, listenerIndex) => {
    for (const prevMeta of prevMetas) {
      prevByKey.set(toListenerKey(listenerIndex, prevMeta.name), prevMeta)
    }
  })

  const nextListenToFields: FieldListenToFields = []
  const attach: Array<WatchFieldOperation> = []
  const detach: Array<WatchFieldOperation> = []

  if (normalizedListeners) {
    normalizedListeners.forEach(({ watchFields = [] }, listenerIndex) => {
      const names = [...new Set(watchFields)]
      nextListenToFields[listenerIndex] = names.map((name) => {
        const sourceField = form._getOrCreateFieldApi({ name })
        const key = toListenerKey(listenerIndex, name)
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
            listeningField: field,
            listenerIndex: listenerIndex,
          })
          prevByKey.delete(key)
        }

        attach.push({
          sourceField,
          listeningField: field,
          listenerIndex: listenerIndex,
        })
        return { name, field: sourceField }
      })
    })
  }

  for (const [key, prevMeta] of prevByKey.entries()) {
    detach.push({
      sourceField: prevMeta.field,
      listeningField: field,
      listenerIndex: ofListenerKey(key)[0],
    })
  }

  return {
    listeners: normalizedListeners,
    listenToFields: normalizedListeners ? nextListenToFields : [],
    attach,
    detach,
  }
}

export function attachWatchingField({
  sourceField,
  listeningField,
  listenerIndex,
}: WatchFieldOperation) {
  let indices = sourceField._watchingFields.get(listeningField)

  if (!indices) {
    indices = new Set()
    sourceField._watchingFields.set(listeningField, indices)
  }

  indices.add(listenerIndex)
}

export function detachWatchingField({
  sourceField,
  listeningField,
  listenerIndex,
}: WatchFieldOperation) {
  const indices = sourceField._watchingFields.get(listeningField)
  if (!indices) return

  indices.delete(listenerIndex)

  if (indices.size === 0) {
    sourceField._watchingFields.delete(listeningField)
  }

  sourceField._pruneIfUnused()
}

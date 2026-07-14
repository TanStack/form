import { batch } from '@tanstack/store'
import { cancelPipelineCache } from '../utils.lib'
import { devtools } from '../devtoolsBridge.lib'
import {
  detachWatchingListenerField,
  detachWatchingValidatorField,
} from './linked-fields.lib'
import {
  childContributionKeys,
  defaultInternalBaseFieldMeta,
  getChildContributionStates,
  isPrunableMeta,
} from './fieldState.lib'
import type { FieldListenerTriggers } from '../listeners.public'
import type {
  AnyInternalFieldApi,
  FieldListenToFields,
  FieldWatchingFields,
  NameSegment,
} from './FieldApi.lib'
import type {
  InternalRootFieldApi,
  RootCounterContributionKey,
} from './RootFieldApi.lib'
import type { ChildContributionStates } from './fieldState.lib'

type DetachWatchingFieldFn = (
  operation: {
    sourceField: AnyInternalFieldApi
    watchingField: AnyInternalFieldApi
    watcherIndex: number
  },
  options?: { pruneSourceField?: boolean },
) => void

export type WatchedFieldDependencyOperation = {
  sourceField: AnyInternalFieldApi
  watchingField: AnyInternalFieldApi
  watcherIndex: number
}

const rootCounterContributionKeys: Array<RootCounterContributionKey> = [
  'touched',
  'validating',
]

function collectFieldSubtree(
  field: AnyInternalFieldApi,
): Array<AnyInternalFieldApi> {
  const stack: Array<AnyInternalFieldApi> = [field]
  const fields: Array<AnyInternalFieldApi> = []

  while (stack.length > 0) {
    const node = stack.pop()!
    fields.push(node)
    stack.push(...node._children)
  }

  return fields
}

function clearWatchedSourceReference(
  listenToFields: FieldListenToFields | null,
  sourceField: AnyInternalFieldApi,
  watcherIndex: number,
): FieldListenToFields | null {
  if (!listenToFields) return null

  const sourceMetas = listenToFields[watcherIndex]
  if (!sourceMetas) return listenToFields

  const nextSourceMetas = sourceMetas.filter(
    (sourceMeta) => sourceMeta.field !== sourceField,
  )
  if (nextSourceMetas.length === sourceMetas.length) {
    return listenToFields
  }

  if (nextSourceMetas.length > 0) {
    listenToFields[watcherIndex] = nextSourceMetas
  } else {
    delete listenToFields[watcherIndex]
  }

  return listenToFields.some(
    (sourceMetasForIndex) => sourceMetasForIndex.length > 0,
  )
    ? listenToFields
    : null
}

function detachOutgoingWatchedFields({
  field,
  listenToFields,
  detach,
  nodesToKill,
  fieldsToPruneAfterKill,
}: {
  field: AnyInternalFieldApi
  listenToFields: FieldListenToFields | null
  detach: DetachWatchingFieldFn
  nodesToKill: Set<AnyInternalFieldApi>
  fieldsToPruneAfterKill: Set<AnyInternalFieldApi>
}) {
  const changedSourceFields = new Set<AnyInternalFieldApi>()

  listenToFields?.forEach((sourceMetas, watcherIndex) => {
    for (const { field: sourceField } of sourceMetas) {
      detach(
        { sourceField, watchingField: field, watcherIndex },
        { pruneSourceField: false },
      )

      if (!nodesToKill.has(sourceField)) {
        fieldsToPruneAfterKill.add(sourceField)
        changedSourceFields.add(sourceField)
      }
    }
  })
}

function detachIncomingWatchedFields({
  sourceField,
  watchingFields,
  detach,
  nodesToKill,
  getListenToFields,
  setListenToFields,
}: {
  sourceField: AnyInternalFieldApi
  watchingFields: FieldWatchingFields | null
  detach: DetachWatchingFieldFn
  nodesToKill: Set<AnyInternalFieldApi>
  getListenToFields: (
    watchingField: AnyInternalFieldApi,
  ) => FieldListenToFields | null
  setListenToFields: (
    watchingField: AnyInternalFieldApi,
    listenToFields: FieldListenToFields | null,
  ) => void
}) {
  if (!watchingFields) return

  const changedWatchingFields = new Set<AnyInternalFieldApi>()

  for (const [watchingField, watcherIndexes] of Array.from(watchingFields)) {
    for (const watcherIndex of Array.from(watcherIndexes)) {
      detach(
        { sourceField, watchingField, watcherIndex },
        { pruneSourceField: false },
      )
      setListenToFields(
        watchingField,
        clearWatchedSourceReference(
          getListenToFields(watchingField),
          sourceField,
          watcherIndex,
        ),
      )
      if (!nodesToKill.has(watchingField)) {
        changedWatchingFields.add(watchingField)
      }
    }
  }
}

function detachLinkedFieldReferences({
  field,
  nodesToKill,
  fieldsToPruneAfterKill,
}: {
  field: AnyInternalFieldApi
  nodesToKill: Set<AnyInternalFieldApi>
  fieldsToPruneAfterKill: Set<AnyInternalFieldApi>
}) {
  detachOutgoingWatchedFields({
    field,
    listenToFields: field._listenToFields,
    detach: detachWatchingListenerField,
    nodesToKill,
    fieldsToPruneAfterKill,
  })
  field._listenToFields = null

  detachOutgoingWatchedFields({
    field,
    listenToFields: field._validateOnFields,
    detach: detachWatchingValidatorField,
    nodesToKill,
    fieldsToPruneAfterKill,
  })
  field._validateOnFields = null

  detachIncomingWatchedFields({
    sourceField: field,
    watchingFields: field._watchingFields,
    detach: detachWatchingListenerField,
    nodesToKill,
    getListenToFields: (watchingField) => watchingField._listenToFields,
    setListenToFields: (watchingField, listenToFields) => {
      watchingField._listenToFields = listenToFields
    },
  })
  field._watchingFields = null

  detachIncomingWatchedFields({
    sourceField: field,
    watchingFields: field._watchingValidatorFields,
    detach: detachWatchingValidatorField,
    nodesToKill,
    getListenToFields: (watchingField) => watchingField._validateOnFields,
    setListenToFields: (watchingField, listenToFields) => {
      watchingField._validateOnFields = listenToFields
    },
  })
  field._watchingValidatorFields = null
}

export function updateChildContributionCount(
  field: AnyInternalFieldApi,
  prevState: ChildContributionStates,
  newState: ChildContributionStates,
): void {
  if (field._isKilled) return

  batch(() => {
    for (const key of childContributionKeys) {
      const prevContributes = prevState[key]
      const newContributes = newState[key]

      if (prevContributes === newContributes) continue

      const delta = newContributes ? 1 : -1

      field._setMeta((prev) => ({
        ...prev,
        childContributionCounts: {
          ...prev.childContributionCounts,
          [key]: prev.childContributionCounts[key] + delta,
        },
      }))
    }
  })
}

export function moveFieldToSegment(
  field: AnyInternalFieldApi,
  newSegment: NameSegment,
): void {
  if (field._isKilled) return

  if (field._segmentValue === newSegment) {
    return
  }

  const oldSegment = field._segmentValue
  field._segmentValue = newSegment
  field._defaultValueCache = null
  if (field._parent._getChild(oldSegment) === field) {
    field._parent._removeChild(oldSegment)
  }
  field._parent._setChild(field)
}

function notifyFieldSubtreeListeners(
  field: AnyInternalFieldApi,
  trigger: FieldListenerTriggers,
): void {
  if (field._isKilled) return

  for (const node of collectFieldSubtree(field)) {
    if (node._isKilled) continue
    node._notifyListener(trigger, new WeakSet())
  }
}

export function killField(
  field: AnyInternalFieldApi,
  options: {
    listenerEvent?: FieldListenerTriggers
  } = {},
) {
  let removedFields: Array<{
    field: AnyInternalFieldApi
    previousPath: string
  }> = []

  batch(() => {
    const nodesToKill = collectFieldSubtree(field)
    removedFields = nodesToKill.map((node) => ({
      field: node,
      previousPath: node.name,
    }))
    const nodesToKillSet = new Set(nodesToKill)
    const fieldsToPruneAfterKill = new Set<AnyInternalFieldApi>()

    if (options.listenerEvent) {
      notifyFieldSubtreeListeners(field, options.listenerEvent)
    }

    field._parent._removeChild(field._segment)

    const killedRootCounterContributions: Record<
      RootCounterContributionKey,
      number
    > = {
      touched: 0,
      validating: 0,
    }

    for (const node of nodesToKill) {
      const nodeMeta = node._atoms.meta?.get()
      detachLinkedFieldReferences({
        field: node,
        nodesToKill: nodesToKillSet,
        fieldsToPruneAfterKill,
      })

      if (!node._parent._isRoot && nodeMeta) {
        node._parent._updateChildContributionCount(
          getChildContributionStates(nodeMeta),
          {
            dirty: false,
            error: false,
            touched: false,
            validating: false,
          },
        )
      } else if (nodeMeta) {
        const contributions = getChildContributionStates(nodeMeta)
        for (const key of rootCounterContributionKeys) {
          if (contributions[key]) {
            killedRootCounterContributions[key]++
          }
        }
      }

      node._isKilled = true
      node._refCount = 0
      node._defaultValueCache = null
      node._atoms.store = undefined
      if (node._pipelineCache) {
        cancelPipelineCache(node._pipelineCache)
        node._pipelineCache = null
      }
      node._childrenMap.clear()
      node._parent._removeChild(node._segment)
    }

    for (const fieldToPrune of fieldsToPruneAfterKill) {
      pruneFieldIfUnused(fieldToPrune)
    }

    field.form._atoms.meta.touchedFieldCount.set((prev) =>
      Math.max(0, prev - killedRootCounterContributions.touched),
    )
    field.form._atoms.meta.fieldValidationCount.set((prev) =>
      Math.max(0, prev - killedRootCounterContributions.validating),
    )

    field.form._atoms.meta.errorFields.set((prev) => {
      if (prev.size > 0) {
        const nextErrorFields = new Set(prev)

        for (const node of nodesToKill) {
          nextErrorFields.delete(node)
        }

        if (nextErrorFields.size !== prev.size) {
          return nextErrorFields
        }
      }

      return prev
    })

    field.form._atoms.meta.fieldErrors.set((prev) => {
      const fieldErrors = [...prev]
      let changed = false

      for (let i = 0; i < fieldErrors.length; i++) {
        const currFieldErrors = fieldErrors[i]
        if (!currFieldErrors || currFieldErrors.size === 0) continue

        let next: Set<AnyInternalFieldApi> | undefined

        for (const node of currFieldErrors) {
          if (nodesToKillSet.has(node)) {
            if (!next) {
              next = new Set(currFieldErrors)
            }

            next.delete(node)
          }
        }

        if (next) {
          fieldErrors[i] = next
          changed = true
        }
      }

      return changed ? fieldErrors : prev
    })
  })

  if (removedFields.length > 0) {
    devtools().removeFieldSubtree?.(field.form, removedFields)
  }
}

export function canPruneField(field: AnyInternalFieldApi): boolean {
  if (field._isKilled) return false

  if (field._refCount > 0) return false
  if (field._childrenMap.size > 0) return false
  if (field._watchingFields) return false
  if (field._watchingValidatorFields) return false
  const meta = field._atoms.meta?.get() ?? defaultInternalBaseFieldMeta
  if (!isPrunableMeta(meta)) return false

  return true
}

export function pruneFieldIfUnused(field: AnyInternalFieldApi): void {
  let node: AnyInternalFieldApi | InternalRootFieldApi = field

  while (!node._isRoot) {
    if (!canPruneField(node)) {
      break
    }

    node._parent._removeChild(node._segment)

    node = node._parent
  }
}

export function touchAllFieldsAndCollectSubmitValidators(
  root: InternalRootFieldApi,
): Array<AnyInternalFieldApi> {
  const fieldsWithValidators: Array<AnyInternalFieldApi> = []
  const stack = [...root._children]

  while (stack.length > 0) {
    const field = stack.pop()!

    field._notifyEvent(
      {
        causeValidation: false,
        markAsBlurred: false,
        markAsDirty: false,
        // Touch all fields
        markAsTouched: true,
        // We're doing DFS, so propagation is useless
        doPropagate: false,
      },
      'submit',
    )

    stack.push(...field._children)

    if (field._validators && field._validators.length > 0) {
      fieldsWithValidators.push(field)
    }
  }

  return fieldsWithValidators
}

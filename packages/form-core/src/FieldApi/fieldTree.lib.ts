import { batch } from '@tanstack/store'
import { devtools } from '../devtoolsBridge.lib'
import { removeFieldWatches } from './linked-fields.lib'
import {
  defaultInternalBaseFieldMeta,
  getSubfieldsMetaFlags,
  isPrunableMeta,
  subfieldsMetaKeys,
} from './fieldState.lib'
import {
  collectFieldSubtree,
  visitAllFormFields,
  visitFieldAndAncestors,
} from './fieldTraversal.lib'
import type { FormMetaCountKey, InternalRootFieldApi } from './RootFieldApi.lib'
import type { AnyInternalFieldApi } from './FieldApi.lib'
import type { FieldDependencyChange } from '../devtoolsBridge.lib'
import type { SubfieldsMetaFlags } from './fieldState.lib'
import type { NameSegment } from '../utils.lib'
import type { FieldListenerTriggers } from '../pipeline/listeners/listeners.public'

const formMetaCountKeys: Array<FormMetaCountKey> = ['touched', 'validating']

export function updateChildMetaCounts(
  field: AnyInternalFieldApi,
  previousFlags: SubfieldsMetaFlags,
  nextFlags: SubfieldsMetaFlags,
): void {
  if (field._isKilled) return

  batch(() => {
    for (const key of subfieldsMetaKeys) {
      const wasSet = previousFlags[key]
      const isSet = nextFlags[key]

      if (wasSet === isSet) continue

      const delta = isSet ? 1 : -1

      field._setMeta((prev) => ({
        ...prev,
        childMetaCounts: {
          ...prev.childMetaCounts,
          // In DFS that resets fields, the parent could potentially forget
          // about the child count. Unlikely to happen during normal runtime,
          // but this would be a nasty footgun and Math.max is probably cheap.
          [key]: Math.max(0, prev.childMetaCounts[key] + delta),
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
    node._notifyListener({ trigger, seenFields: new WeakSet() })
  }
}

function prepareFormGroupsForFieldReplacement(
  fields: ReadonlyArray<AnyInternalFieldApi>,
): () => void {
  const formGroups = fields.flatMap((field) =>
    field._formGroup ? [{ group: field._formGroup, name: field.name }] : [],
  )
  for (const { group } of formGroups) {
    group._groupField._cancelValidation()
  }

  return () => {
    if (formGroups.length === 0) return

    batch(() => {
      for (const { group, name } of formGroups) {
        group._attachToFieldTrie(name)
      }
    })
  }
}

export function killField(
  field: AnyInternalFieldApi,
  options: {
    listenerEvent?: FieldListenerTriggers
  } = {},
) {
  const bridge = devtools()
  const dependencyChanges = bridge.fieldDependenciesChanged
    ? new Array<FieldDependencyChange>()
    : undefined
  let removedFields: Array<{
    field: AnyInternalFieldApi
    previousPath: string
  }> = []
  let reattachFormGroups = () => {}

  batch(() => {
    const nodesToKill = collectFieldSubtree(field)
    field.form._cancelFieldValidation(field.name)
    removedFields = nodesToKill.map((node) => ({
      field: node,
      previousPath: node.name,
    }))

    reattachFormGroups = prepareFormGroupsForFieldReplacement(nodesToKill)

    if (options.listenerEvent) {
      notifyFieldSubtreeListeners(field, options.listenerEvent)
    }

    field._parent._removeChild(field._segment)

    const removedRootFieldCounts: Record<FormMetaCountKey, number> = {
      touched: 0,
      validating: 0,
    }

    for (const node of nodesToKill) {
      node._resetValidation()
      const nodeMeta = node._atoms.meta?.get()
      removeFieldWatches(node, dependencyChanges)

      if (!node._parent._isRoot && nodeMeta) {
        node._parent._updateChildMetaCounts(
          getSubfieldsMetaFlags(nodeMeta, node._errorStore.hasErrors),
          {
            dirty: false,
            error: false,
            touched: false,
            validating: false,
          },
        )
      } else if (nodeMeta) {
        const flags = getSubfieldsMetaFlags(
          nodeMeta,
          node._errorStore.hasErrors,
        )
        for (const key of formMetaCountKeys) {
          if (flags[key]) {
            removedRootFieldCounts[key]++
          }
        }
      }

      node._isKilled = true
      node._refCount = 0
      node._formGroup = null
      node._defaultValueCache = null
      node._atoms.store = undefined
      node._listenerInstances?.forEach((instance) => instance.dispose())
      node._listenerInstances = null
      node._validatorInstances?.forEach((instance) => instance.dispose())
      node._validatorInstances = null
      node._childrenMap.clear()
      node._parent._removeChild(node._segment)
    }

    field.form._atoms.meta.touchedFieldCount.set((prev) =>
      Math.max(0, prev - removedRootFieldCounts.touched),
    )
    field.form._atoms.meta.fieldValidationCount.set((prev) =>
      Math.max(0, prev - removedRootFieldCounts.validating),
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

    if (removedFields.length > 0) {
      bridge.removeFieldSubtree?.(field.form, removedFields)
    }
    if (dependencyChanges && dependencyChanges.length > 0) {
      bridge.fieldDependenciesChanged?.(dependencyChanges)
    }
    reattachFormGroups()
  })
}

function canPruneField(field: AnyInternalFieldApi): boolean {
  if (field._isKilled) return false

  if (field._refCount > 0) return false
  if (field._formGroup) return false
  if (field._childrenMap.size > 0) return false
  if (field._watchedListenerNames || field._watchedValidatorNames) return false
  if (field._errorStore.hasErrors) return false
  const meta = field._atoms.meta?.get() ?? defaultInternalBaseFieldMeta
  if (!isPrunableMeta(meta)) return false

  return true
}

export function pruneFieldIfUnused(field: AnyInternalFieldApi): void {
  const bridge = devtools()
  const removedFields = bridge.removeFieldSubtree
    ? new Array<{ field: AnyInternalFieldApi; previousPath: string }>()
    : null

  visitFieldAndAncestors(field, (node, stop) => {
    if (!canPruneField(node)) return stop

    removedFields?.push({ field: node, previousPath: node.name })
    node._parent._removeChild(node._segment)
    return undefined
  })

  if (removedFields && removedFields.length > 0) {
    bridge.removeFieldSubtree?.(field.form, removedFields)
  }
}

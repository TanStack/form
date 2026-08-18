import type {
  AnyInternalFieldApi,
  InternalFieldListenerInstance,
  InternalFieldValidatorInstance,
} from './FieldApi.lib'
import type { AnyInternalFormApi } from '../FormApi/FormApi.lib'

export interface ListenerWatchFieldOperation {
  kind: 'listener'
  sourceField: AnyInternalFieldApi
  watchingField: AnyInternalFieldApi
  listenerInstance: InternalFieldListenerInstance
}

export interface ValidatorWatchFieldOperation {
  kind: 'validator'
  sourceField: AnyInternalFieldApi
  watchingField: AnyInternalFieldApi
  validatorInstance: InternalFieldValidatorInstance
}

export interface DetachWatchingFieldOptions {
  pruneSourceField?: boolean
}

export function reconcileWatchedListenerFields({
  listenerInstances,
  field,
  form,
}: {
  listenerInstances: ReadonlyArray<InternalFieldListenerInstance> | null
  field: AnyInternalFieldApi
  form: AnyInternalFormApi
}): {
  attach: Array<ListenerWatchFieldOperation>
  detach: Array<ListenerWatchFieldOperation>
} {
  const attach: Array<ListenerWatchFieldOperation> = []
  const detach: Array<ListenerWatchFieldOperation> = []

  listenerInstances?.forEach((listenerInstance) => {
    const previous = listenerInstance.resolvedWatchFields
    const next = new Map<string, AnyInternalFieldApi>()
    const names = [...new Set(listenerInstance.definition.watchFields ?? [])]

    for (const name of names) {
      const sourceField = form._getOrCreateFieldApi({ name }, 'internal')
      next.set(name, sourceField)

      const previousField = previous?.get(name)
      if (previousField === sourceField) continue

      if (previousField) {
        detach.push({
          kind: 'listener',
          sourceField: previousField,
          watchingField: field,
          listenerInstance,
        })
      }

      attach.push({
        kind: 'listener',
        sourceField,
        watchingField: field,
        listenerInstance,
      })
    }

    previous?.forEach((sourceField, name) => {
      if (next.has(name)) return

      detach.push({
        kind: 'listener',
        sourceField,
        watchingField: field,
        listenerInstance,
      })
    })

    listenerInstance.resolvedWatchFields = next.size > 0 ? next : null
  })

  return { attach, detach }
}

export function reconcileWatchedValidatorFields({
  validatorInstances,
  field,
  form,
}: {
  validatorInstances: ReadonlyArray<InternalFieldValidatorInstance> | null
  field: AnyInternalFieldApi
  form: AnyInternalFormApi
}): {
  attach: Array<ValidatorWatchFieldOperation>
  detach: Array<ValidatorWatchFieldOperation>
} {
  const attach: Array<ValidatorWatchFieldOperation> = []
  const detach: Array<ValidatorWatchFieldOperation> = []

  validatorInstances?.forEach((validatorInstance) => {
    const previous = validatorInstance.resolvedWatchFields
    const next = new Map<string, AnyInternalFieldApi>()
    const names = [...new Set(validatorInstance.definition.watchFields ?? [])]

    for (const name of names) {
      const sourceField = form._getOrCreateFieldApi({ name }, 'internal')
      next.set(name, sourceField)

      const previousField = previous?.get(name)
      if (previousField === sourceField) continue

      if (previousField) {
        detach.push({
          kind: 'validator',
          sourceField: previousField,
          watchingField: field,
          validatorInstance,
        })
      }

      attach.push({
        kind: 'validator',
        sourceField,
        watchingField: field,
        validatorInstance,
      })
    }

    previous?.forEach((sourceField, name) => {
      if (next.has(name)) return

      detach.push({
        kind: 'validator',
        sourceField,
        watchingField: field,
        validatorInstance,
      })
    })

    validatorInstance.resolvedWatchFields = next.size > 0 ? next : null
  })

  return { attach, detach }
}

export function attachWatchingListenerField({
  sourceField,
  watchingField,
  listenerInstance,
}: ListenerWatchFieldOperation) {
  let watchingFields = sourceField._watchingListenerFields
  if (!watchingFields) {
    watchingFields = new Map()
    sourceField._watchingListenerFields = watchingFields
  }

  let instances = watchingFields.get(watchingField)
  if (!instances) {
    instances = new Set()
    watchingFields.set(watchingField, instances)
  }

  instances.add(listenerInstance)
}

export function detachWatchingListenerField(
  { sourceField, watchingField, listenerInstance }: ListenerWatchFieldOperation,
  options: DetachWatchingFieldOptions = {},
) {
  const watchingFields = sourceField._watchingListenerFields
  if (!watchingFields) return

  const instances = watchingFields.get(watchingField)
  if (!instances) return

  instances.delete(listenerInstance)

  if (instances.size === 0) {
    watchingFields.delete(watchingField)
    if (watchingFields.size === 0) {
      sourceField._watchingListenerFields = null
    }
  }

  if (options.pruneSourceField !== false) {
    sourceField._pruneIfUnused()
  }
}

export function attachWatchingValidatorField({
  sourceField,
  watchingField,
  validatorInstance,
}: ValidatorWatchFieldOperation) {
  let watchingFields = sourceField._watchingValidatorFields
  if (!watchingFields) {
    watchingFields = new Map()
    sourceField._watchingValidatorFields = watchingFields
  }

  let instances = watchingFields.get(watchingField)
  if (!instances) {
    instances = new Set()
    watchingFields.set(watchingField, instances)
  }

  instances.add(validatorInstance)
}

export function detachWatchingValidatorField(
  {
    sourceField,
    watchingField,
    validatorInstance,
  }: ValidatorWatchFieldOperation,
  options?: DetachWatchingFieldOptions,
) {
  const watchingFields = sourceField._watchingValidatorFields
  if (!watchingFields) return

  const instances = watchingFields.get(watchingField)
  if (!instances) return

  instances.delete(validatorInstance)
  if (instances.size === 0) {
    watchingFields.delete(watchingField)
    if (watchingFields.size === 0) {
      sourceField._watchingValidatorFields = null
    }
  }

  if (options?.pruneSourceField !== false) {
    sourceField._pruneIfUnused()
  }
}

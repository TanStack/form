import type { AnyInternalFieldApi } from './FieldApi.lib'
import type { FieldDependencyChange } from '../devtoolsBridge.lib'
import type { ListenerInstances } from '../pipeline/listeners/ListenerInstance.lib'
import type { ValidatorInstances } from '../pipeline/validation/ValidatorInstance.lib'

export type FieldWatchRegistry = Map<string, Set<AnyInternalFieldApi>>
type FieldWatchChanges = {
  added: Array<string>
  removed: Array<string>
}

export function watchesField(
  watchFields: ReadonlyArray<string> | undefined,
  name: string,
): boolean {
  return watchFields?.includes(name) ?? false
}

function getWatchChanges(
  previous: Set<string> | null,
  next: Set<string>,
): FieldWatchChanges {
  const added: Array<string> = []
  const removed: Array<string> = []

  for (const name of previous ?? []) {
    if (next.has(name)) continue

    removed.push(name)
  }

  for (const name of next) {
    if (previous?.has(name)) continue

    added.push(name)
  }

  return { added, removed }
}

function replaceRegistrations(
  field: AnyInternalFieldApi,
  registry: FieldWatchRegistry,
  previous: Set<string> | null,
  next: Set<string>,
  changes?: Array<FieldDependencyChange>,
): FieldWatchChanges {
  const { added, removed } = getWatchChanges(previous, next)

  for (const name of removed) {
    const watchingFields = registry.get(name)
    watchingFields?.delete(field)
    if (watchingFields?.size === 0) {
      registry.delete(name)
    }

    changes?.push({ sourceFieldName: name, watchingField: field })
  }

  for (const name of added) {
    let watchingFields = registry.get(name)
    if (!watchingFields) {
      watchingFields = new Set()
      registry.set(name, watchingFields)
    }
    watchingFields.add(field)
  }

  if (changes) {
    // Refresh devtools: a retained path can be watched by different listener or
    // validator entries after an options update.
    for (const name of next) {
      changes.push({ sourceFieldName: name, watchingField: field })
    }
  }

  return { added, removed }
}

function reconcileListeners(
  field: AnyInternalFieldApi,
  next: Set<string>,
  changes?: Array<FieldDependencyChange>,
) {
  const { added, removed } = replaceRegistrations(
    field,
    field.form._watchingListenerFields,
    field._watchedListenerNames,
    next,
    changes,
  )

  field._watchedListenerNames = next.size > 0 ? next : null

  for (const name of added) {
    field.form._getOrCreateFieldApi({ name }, 'internal')
  }
  for (const name of removed) {
    field.form._tryGetFieldApi(name)?._pruneIfUnused()
  }
}

function reconcileValidators(
  field: AnyInternalFieldApi,
  next: Set<string>,
  changes?: Array<FieldDependencyChange>,
) {
  replaceRegistrations(
    field,
    field.form._watchingValidatorFields,
    field._watchedValidatorNames,
    next,
    changes,
  )

  field._watchedValidatorNames = next.size > 0 ? next : null
}

function getWatchedNames(
  instances: ListenerInstances<'field'> | ValidatorInstances<'field'>,
): Set<string> {
  const names = new Set<string>()
  for (const instance of instances ?? []) {
    for (const name of instance.definition.watchFields ?? []) {
      names.add(name)
    }
  }
  return names
}

export function updateFieldListenerWatches(
  field: AnyInternalFieldApi,
  changes?: Array<FieldDependencyChange>,
): void {
  reconcileListeners(field, getWatchedNames(field._listenerInstances), changes)
}

export function updateFieldValidatorWatches(
  field: AnyInternalFieldApi,
  changes?: Array<FieldDependencyChange>,
): void {
  reconcileValidators(
    field,
    getWatchedNames(field._validatorInstances),
    changes,
  )
}

export function removeFieldWatches(
  field: AnyInternalFieldApi,
  changes?: Array<FieldDependencyChange>,
): void {
  reconcileListeners(field, new Set(), changes)
  reconcileValidators(field, new Set(), changes)
}

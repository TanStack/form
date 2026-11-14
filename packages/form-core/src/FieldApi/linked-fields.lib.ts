import type { AnyInternalFieldApi } from './FieldApi.lib'
import type { FieldDependencyChange } from '../devtoolsBridge.lib'

export type FieldWatchRegistry = Map<string, Set<AnyInternalFieldApi>>
type WatchKind = 'listener' | 'validator'

export function watchesField(
  watchFields: ReadonlyArray<string> | undefined,
  name: string,
): boolean {
  return watchFields?.includes(name) ?? false
}

function unregisterDroppedWatches(
  field: AnyInternalFieldApi,
  registry: FieldWatchRegistry,
  previous: Set<string> | null,
  next: Set<string>,
  changes?: Array<FieldDependencyChange>,
): void {
  for (const name of previous ?? []) {
    if (next.has(name)) continue

    const watchingFields = registry.get(name)
    watchingFields?.delete(field)
    if (watchingFields?.size === 0) {
      registry.delete(name)
    }

    changes?.push({ sourceFieldName: name, watchingField: field })
  }
}

function registerCurrentWatches(
  field: AnyInternalFieldApi,
  registry: FieldWatchRegistry,
  previous: Set<string> | null,
  next: Set<string>,
  changes?: Array<FieldDependencyChange>,
): void {
  for (const name of next) {
    // Refresh devtools: a retained path can be watched by different listener or
    // validator entries after an options update.
    changes?.push({ sourceFieldName: name, watchingField: field })
    if (previous?.has(name)) continue

    let watchingFields = registry.get(name)
    if (!watchingFields) {
      watchingFields = new Set()
      registry.set(name, watchingFields)
    }
    watchingFields.add(field)
  }
}

function replaceListenerRegistrations(
  field: AnyInternalFieldApi,
  next: Set<string>,
  changes?: Array<FieldDependencyChange>,
) {
  const registry = field.form._watchingListenerFields
  const previous = field._watchedListenerNames

  unregisterDroppedWatches(field, registry, previous, next, changes)
  registerCurrentWatches(field, registry, previous, next, changes)

  field._watchedListenerNames = next.size > 0 ? next : null
}

function replaceValidatorRegistrations(
  field: AnyInternalFieldApi,
  next: Set<string>,
  changes?: Array<FieldDependencyChange>,
) {
  const registry = field.form._watchingValidatorFields
  const previous = field._watchedValidatorNames

  unregisterDroppedWatches(field, registry, previous, next, changes)
  registerCurrentWatches(field, registry, previous, next, changes)

  field._watchedValidatorNames = next.size > 0 ? next : null
}

export function updateFieldWatches(
  field: AnyInternalFieldApi,
  kind: WatchKind,
  changes?: Array<FieldDependencyChange>,
): void {
  const instances =
    kind === 'listener' ? field._listenerInstances : field._validatorInstances
  const names = new Set<string>()
  for (const instance of instances ?? []) {
    for (const name of instance.definition.watchFields ?? []) {
      names.add(name)
    }
  }
  if (kind === 'listener') {
    replaceListenerRegistrations(field, names, changes)
  } else {
    replaceValidatorRegistrations(field, names, changes)
  }
}

export function removeFieldWatches(
  field: AnyInternalFieldApi,
  changes?: Array<FieldDependencyChange>,
): void {
  replaceListenerRegistrations(field, new Set(), changes)
  replaceValidatorRegistrations(field, new Set(), changes)
}

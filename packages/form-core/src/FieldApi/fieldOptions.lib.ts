import { batch } from '@tanstack/store'
import { devtools } from '../devtoolsBridge.lib'
import { resolveDefaultOptions } from '../defaultOptions.lib'
import { ListenerInstance } from '../pipeline/listeners/ListenerInstance.lib'
import { ValidatorInstance } from '../pipeline/validation/ValidatorInstance.lib'
import {
  updateFieldListenerWatches,
  updateFieldValidatorWatches,
} from './linked-fields.lib'
import type {
  AnyFieldApiOptions,
  AnyFieldValidator,
  AnyInternalFieldApi,
  FieldOptionsScope,
} from './FieldApi.lib'
import type { FieldDependencyChange } from '../devtoolsBridge.lib'

type FieldOptionItemWithWatchedFields = {
  watchFields?: ReadonlyArray<string>
}

type FieldOptionsWithFieldNameReferences = {
  name: string
  validators?: ReadonlyArray<FieldOptionItemWithWatchedFields | undefined>
  listeners?: ReadonlyArray<FieldOptionItemWithWatchedFields | undefined>
}

function transformFieldOptionItemsWithWatchedFields<
  TItem extends FieldOptionItemWithWatchedFields | undefined,
>(
  items: ReadonlyArray<TItem> | undefined,
  transformFieldName: (fieldName: string) => string,
): Array<TItem> | undefined {
  if (!items) return undefined

  return items.map((item) => {
    if (!item?.watchFields) return item

    return {
      ...item,
      watchFields: item.watchFields.map(transformFieldName),
    }
  })
}

/**
 * Transforms the field name and validator/listener `watchFields` using getter overrides.
 */
export function transformFieldOptionsFieldNames<
  TFieldOptions extends AnyFieldApiOptions,
>(
  fieldOptions: TFieldOptions,
  transformFieldName: (fieldName: string) => string,
  mergeOptions: (
    props: TFieldOptions,
    overrides: Partial<TFieldOptions>,
  ) => TFieldOptions,
): TFieldOptions {
  const options = fieldOptions as TFieldOptions &
    FieldOptionsWithFieldNameReferences

  // We need to delay the call of accessors like `options.name`. Some adapters like
  // Solid use signals for that, so if we call it early it'd lose the reactivity.
  const overrides = {
    get name() {
      return transformFieldName(options.name)
    },
  } as Partial<TFieldOptions>

  if (Object.hasOwn(options, 'validators')) {
    Object.defineProperty(overrides, 'validators', {
      enumerable: true,
      get() {
        return transformFieldOptionItemsWithWatchedFields(
          options.validators,
          transformFieldName,
        )
      },
    })
  }

  if (Object.hasOwn(options, 'listeners')) {
    Object.defineProperty(overrides, 'listeners', {
      enumerable: true,
      get() {
        return transformFieldOptionItemsWithWatchedFields(
          options.listeners,
          transformFieldName,
        )
      },
    })
  }

  return mergeOptions(fieldOptions, overrides)
}

/**
 * Creates listener and validator instances and registers the fields they watch.
 */
export function initializeFieldOptions(
  field: AnyInternalFieldApi,
  {
    validators,
    listeners,
  }: Pick<AnyFieldApiOptions, 'validators' | 'listeners'>,
): void {
  field._listenerInstances = ListenerInstance.update({
    definitions: listeners,
    instances: null,
    scope: 'field',
  })
  field._validatorInstances = ValidatorInstance.update({
    definitions: validators,
    instances: null,
    owner: field,
    scope: 'field',
  })

  updateFieldListenerWatches(field)
  updateFieldValidatorWatches(field)
}

/**
 * Applies options in a batch, updating error settings, listener and validator
 * instances, and watched field registrations.
 */
export function updateFieldOptions(
  field: AnyInternalFieldApi,
  options: Omit<AnyFieldApiOptions, 'name' | 'form'>,
  scope: FieldOptionsScope = 'field',
): void {
  // TODO this is migrated, but I'm having a hard time following what's going on here.
  // could use a cleanup similar to initializeFieldOptions.
  batch(() => {
    if (field._isKilled) return

    const isInitializing =
      scope !== 'internal' && !field._fieldOptionsInitialized
    const defaultOptions =
      scope === 'field' ? field.form._defaultOptions?.field : undefined
    const resolvedOptions = resolveDefaultOptions(options, defaultOptions)

    field._errorVisibility = resolvedOptions.errorVisibility
    field._errorBoundary = resolvedOptions.errorBoundary ?? false

    const notifyDependencyChanges = devtools().fieldDependenciesChanged
    const dependencyChanges: Array<FieldDependencyChange> | undefined =
      notifyDependencyChanges ? [] : undefined

    if (resolvedOptions.listeners) {
      const previousListeners = field._listenerInstances?.map(
        (instance) => instance.definition,
      )
      field._listenerInstances = ListenerInstance.update({
        definitions: resolvedOptions.listeners,
        previousDefinitions: isInitializing
          ? undefined
          : (previousListeners ?? null),
        instances: field._listenerInstances,
        scope: 'field',
      })
      updateFieldListenerWatches(field, dependencyChanges)
    }

    if (resolvedOptions.validators) {
      const previousValidators = field._validatorInstances?.map(
        (instance) => instance.definition,
      )
      const nextValidators =
        resolvedOptions.validators.length > 0
          ? (resolvedOptions.validators as Array<AnyFieldValidator>)
          : null
      if (
        (nextValidators?.length ?? 0) < (field._validatorInstances?.length ?? 0)
      ) {
        field._cancelValidation()
      }
      field._validatorInstances = ValidatorInstance.update({
        definitions: nextValidators,
        previousDefinitions: isInitializing
          ? undefined
          : (previousValidators ?? null),
        instances: field._validatorInstances,
        owner: field,
        scope: 'field',
        onBeforeDispose: (validatorInstance) =>
          field._removeValidatorInstance(validatorInstance),
      })
      updateFieldValidatorWatches(field, dependencyChanges)
    }

    if (dependencyChanges && dependencyChanges.length > 0) {
      notifyDependencyChanges?.(dependencyChanges)
    }

    if (scope !== 'internal') {
      field._fieldOptionsInitialized = true
    }
  })
}

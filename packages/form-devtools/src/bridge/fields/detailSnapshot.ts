import { getBy, isStandardSchema } from '@tanstack/form-core/internals'
import { compareFieldPaths } from '../utils'
import type {
  AnyInternalFieldApi,
  AnyInternalValidatorInstance,
  FieldWatchingListenerFields,
  FieldWatchingValidatorFields,
  InternalFieldState,
  ValidationSourceErrorMap,
} from '@tanstack/form-core/internals'
import type { ValidationIssue } from '@tanstack/form-core'
import type {
  DevtoolsFieldDetail,
  DevtoolsFieldError,
  DevtoolsFieldErrorSource,
  DevtoolsFieldRelation,
  DevtoolsFieldRelationCause,
  DevtoolsFieldRelationKind,
  DevtoolsFieldRelations,
  DevtoolsFieldValidatorType,
  FieldDetailSubscriptionDescriptor,
  FieldErrorPayloadMode,
} from '../../eventClientTypes'
import type { FieldId } from '../../types/branded'
import type { FieldIdentityController } from './identity'

function getValidatorType(
  validator: { run: unknown } | null | undefined,
): DevtoolsFieldValidatorType {
  return validator && isStandardSchema(validator.run as never)
    ? 'schema'
    : 'callback'
}

function projectError(
  error: ValidationIssue,
  mode: FieldErrorPayloadMode,
): { message: string } {
  if (mode === 'messages') {
    return { message: error.message }
  }

  return error
}

function appendValidatorErrors({
  destination,
  errorMap,
  validatorInstances,
  getSource,
  mode,
}: {
  destination: Array<DevtoolsFieldError>
  errorMap: ValidationSourceErrorMap | null
  validatorInstances: ReadonlyArray<AnyInternalValidatorInstance> | null
  getSource: (
    validatorIndex: number,
    sourceEvent: string,
  ) => DevtoolsFieldErrorSource
  mode: FieldErrorPayloadMode
}): void {
  validatorInstances?.forEach((validatorInstance, validatorIndex) => {
    const errorState = errorMap?.get(validatorInstance)
    if (!errorState) return

    const { errors, sourceEvent } = errorState
    const source = getSource(validatorIndex, sourceEvent)

    for (const error of errors) {
      destination.push({
        error: projectError(error, mode),
        source,
        sourceEvent,
      })
    }
  })
}

export function getDevtoolsFieldErrors(
  field: AnyInternalFieldApi,
  state: InternalFieldState,
  mode: FieldErrorPayloadMode,
): Array<DevtoolsFieldError> {
  // Keep this traversal aligned with getErrorsFromBaseMeta in form-core so
  // these entries have the same order as field.state.meta.original.errors.
  const errors: Array<DevtoolsFieldError> = []
  const meta = state.meta

  appendValidatorErrors({
    destination: errors,
    errorMap: meta._validationSourceErrors,
    validatorInstances: field._validatorInstances,
    mode,
    getSource: (validatorIndex) => ({
      scope: 'field',
      validatorIndex,
      validatorType: getValidatorType(
        field._validatorInstances?.[validatorIndex]?.definition,
      ),
    }),
  })

  if (meta._validationSourceErrors) {
    const containingGroup = field._getFormGroup()

    appendValidatorErrors({
      destination: errors,
      errorMap: meta._validationSourceErrors,
      validatorInstances: containingGroup?._validatorInstances ?? null,
      mode,
      getSource: (validatorIndex) => ({
        scope: 'formGroup',
        formGroupPath: containingGroup
          ? String(containingGroup.name)
          : '(unknown form group)',
        validatorIndex,
        validatorType: getValidatorType(
          containingGroup?._validatorInstances?.[validatorIndex]?.definition,
        ),
      }),
    })
  }

  appendValidatorErrors({
    destination: errors,
    errorMap: meta._validationSourceErrors,
    validatorInstances: field.form._validatorInstances,
    mode,
    getSource: (validatorIndex) => ({
      scope: 'form',
      validatorIndex,
      validatorType: getValidatorType(
        field.form._validatorInstances?.[validatorIndex]?.definition,
      ),
    }),
  })

  const onSubmitErrorState = meta._validationSourceErrors?.get(
    field.form._onSubmitSource,
  )
  if (onSubmitErrorState) {
    const { errors: submitErrors, sourceEvent } = onSubmitErrorState
    for (const error of submitErrors) {
      errors.push({
        error: projectError(error, mode),
        source: { scope: 'onSubmit', validatorType: 'callback' },
        sourceEvent,
      })
    }
  }

  return errors
}

function getDevtoolsFieldState(
  field: AnyInternalFieldApi,
  state: InternalFieldState,
  descriptor: FieldDetailSubscriptionDescriptor,
): DevtoolsFieldDetail['state'] {
  const meta = state.meta
  const originalErrors = getDevtoolsFieldErrors(
    field,
    state,
    descriptor.settings.errorPayloadMode,
  )

  return {
    ...(descriptor.settings.includeValues ? { value: state.value } : {}),
    meta: {
      isTouched: meta.isTouched,
      isDirty: meta.isDirty,
      isPristine: meta.isPristine,
      isDefaultValue: meta.isDefaultValue,
      isBlurred: meta.isBlurred,
      isValidating: meta.isValidating,
      isSelfTouched: meta.isSelfTouched,
      isSelfDirty: meta.isSelfDirty,
      isSelfValidating: meta.isSelfValidating,
      isSelfValid: meta.isSelfValid,
      isValid: meta.isValid,
      isInvalid: meta.isInvalid,
      subfields: { ...meta.subfields },
      errors: meta.errors.length > 0 ? originalErrors : [],
      original: {
        errors: originalErrors,
        isValid: meta.original.isValid,
        isInvalid: meta.original.isInvalid,
      },
    },
  }
}

interface FieldRelationAccumulator {
  fieldId: FieldId
  path: string
  causes: Array<DevtoolsFieldRelationCause>
}

function getRelationCause(
  kind: DevtoolsFieldRelationKind,
  itemIndex: number,
  configuredPath: string | undefined,
  currentPath: string,
): DevtoolsFieldRelationCause {
  return {
    kind,
    itemIndex,
    ...(configuredPath && configuredPath !== currentPath
      ? { configuredPath }
      : {}),
  }
}

function addRelation(
  relations: Map<FieldId, FieldRelationAccumulator>,
  field: AnyInternalFieldApi,
  cause: DevtoolsFieldRelationCause,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
): void {
  if (field._isKilled) return

  const fieldId = identity.getFieldId(field)
  const existing = relations.get(fieldId)
  if (existing) {
    existing.causes.push(cause)
    return
  }

  relations.set(fieldId, {
    fieldId,
    path: field.name,
    causes: [cause],
  })
}

function addListenerListensToRelations(
  relations: Map<FieldId, FieldRelationAccumulator>,
  field: AnyInternalFieldApi,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
): void {
  field._listenerInstances?.forEach((listenerInstance, itemIndex) => {
    listenerInstance.resolvedWatchFields?.forEach(
      (sourceField, configuredPath) => {
        addRelation(
          relations,
          sourceField,
          getRelationCause(
            'listener',
            itemIndex,
            configuredPath,
            sourceField.name,
          ),
          identity,
        )
      },
    )
  })
}

function addListenerListenedToByRelations(
  relations: Map<FieldId, FieldRelationAccumulator>,
  sourceField: AnyInternalFieldApi,
  watchingFields: FieldWatchingListenerFields | null,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
): void {
  watchingFields?.forEach((listenerInstances, watchingField) => {
    if (watchingField._isKilled) return

    for (const listenerInstance of listenerInstances) {
      const itemIndex =
        watchingField._listenerInstances?.indexOf(listenerInstance) ?? -1
      if (itemIndex < 0) continue

      let configuredPath: string | undefined
      listenerInstance.resolvedWatchFields?.forEach((field, path) => {
        if (field === sourceField) configuredPath = path
      })
      addRelation(
        relations,
        watchingField,
        getRelationCause(
          'listener',
          itemIndex,
          configuredPath,
          sourceField.name,
        ),
        identity,
      )
    }
  })
}

function addValidatorListensToRelations(
  relations: Map<FieldId, FieldRelationAccumulator>,
  field: AnyInternalFieldApi,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
): void {
  field._validatorInstances?.forEach((validatorInstance, itemIndex) => {
    validatorInstance.resolvedWatchFields?.forEach(
      (sourceField, configuredPath) => {
        addRelation(
          relations,
          sourceField,
          getRelationCause(
            'validator',
            itemIndex,
            configuredPath,
            sourceField.name,
          ),
          identity,
        )
      },
    )
  })
}

function addValidatorListenedToByRelations(
  relations: Map<FieldId, FieldRelationAccumulator>,
  sourceField: AnyInternalFieldApi,
  watchingFields: FieldWatchingValidatorFields | null,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
): void {
  watchingFields?.forEach((validatorInstances, watchingField) => {
    if (watchingField._isKilled) return

    for (const validatorInstance of validatorInstances) {
      const itemIndex =
        watchingField._validatorInstances?.indexOf(validatorInstance) ?? -1
      if (itemIndex < 0) continue

      let configuredPath: string | undefined
      validatorInstance.resolvedWatchFields?.forEach((field, path) => {
        if (field === sourceField) configuredPath = path
      })
      addRelation(
        relations,
        watchingField,
        getRelationCause(
          'validator',
          itemIndex,
          configuredPath,
          sourceField.name,
        ),
        identity,
      )
    }
  })
}

function compareRelationCauses(
  left: DevtoolsFieldRelationCause,
  right: DevtoolsFieldRelationCause,
): number {
  if (left.kind !== right.kind) return left.kind === 'listener' ? -1 : 1
  if (left.itemIndex !== right.itemIndex) {
    return left.itemIndex - right.itemIndex
  }
  return (left.configuredPath ?? '').localeCompare(right.configuredPath ?? '')
}

function finalizeRelations(
  relations: Map<FieldId, FieldRelationAccumulator>,
): Array<DevtoolsFieldRelation> {
  return Array.from(relations.values())
    .sort((left, right) => {
      const pathOrder = compareFieldPaths(left.path, right.path)
      return (
        pathOrder || String(left.fieldId).localeCompare(String(right.fieldId))
      )
    })
    .map(({ fieldId, causes }) => ({
      fieldId,
      causes: causes.sort(compareRelationCauses),
    }))
}

function getDevtoolsFieldRelations(
  field: AnyInternalFieldApi,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
): DevtoolsFieldRelations {
  const listensTo = new Map<FieldId, FieldRelationAccumulator>()
  const listenedToBy = new Map<FieldId, FieldRelationAccumulator>()

  addListenerListensToRelations(listensTo, field, identity)
  addValidatorListensToRelations(listensTo, field, identity)
  addListenerListenedToByRelations(
    listenedToBy,
    field,
    field._watchingListenerFields,
    identity,
  )
  addValidatorListenedToByRelations(
    listenedToBy,
    field,
    field._watchingValidatorFields,
    identity,
  )

  return {
    directChildCount: field._children.reduce(
      (count, child) => count + (child._isKilled ? 0 : 1),
      0,
    ),
    listensTo: finalizeRelations(listensTo),
    listenedToBy: finalizeRelations(listenedToBy),
  }
}

export function getDevtoolsFieldDetail(
  field: AnyInternalFieldApi,
  descriptor: FieldDetailSubscriptionDescriptor,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
): DevtoolsFieldDetail {
  const state = field.atom.get()

  return {
    ...descriptor,
    state: getDevtoolsFieldState(field, state, descriptor),
    relations: getDevtoolsFieldRelations(field, identity),
    ...(descriptor.settings.includeValues
      ? { defaultValue: getBy(field.form.defaultValues, field.name) }
      : {}),
  }
}

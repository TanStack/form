import { getBy, isStandardSchema } from '@tanstack/form-core/internals'
import { compareFieldPaths } from '../utils'
import type {
  AnyInternalFieldApi,
  FieldListenToFields,
  FieldWatchingFields,
  InternalFieldState,
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

function appendErrors({
  destination,
  errorBuckets,
  errorSourceEvents,
  getSource,
  mode,
}: {
  destination: Array<DevtoolsFieldError>
  errorBuckets: Array<Array<ValidationIssue>>
  errorSourceEvents: Array<string | null>
  getSource: (
    validatorIndex: number,
    sourceEvent: string,
  ) => DevtoolsFieldErrorSource
  mode: FieldErrorPayloadMode
}): void {
  errorBuckets.forEach((errors, validatorIndex) => {
    if (errors.length === 0) return

    const sourceEvent = errorSourceEvents[validatorIndex] ?? 'unknown'
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

  appendErrors({
    destination: errors,
    errorBuckets: meta._fieldValidatorErrors,
    errorSourceEvents: meta._fieldValidatorErrorSourceEvents,
    mode,
    getSource: (validatorIndex) => ({
      scope: 'field',
      validatorIndex,
      validatorType: getValidatorType(field._validators?.[validatorIndex]),
    }),
  })

  for (const [owner, groupErrors] of meta._formGroupValidatorErrors) {
    const group = Array.from(field.form._formGroups).find(
      (candidate) => candidate._errorOwner === owner,
    )

    appendErrors({
      destination: errors,
      errorBuckets: groupErrors.errors,
      errorSourceEvents: groupErrors.errorSourceEvents,
      mode,
      getSource: (validatorIndex) => ({
        scope: 'formGroup',
        formGroupPath: group ? String(group.name) : '(unknown form group)',
        validatorIndex,
        validatorType: getValidatorType(
          group?.options.validators?.[validatorIndex],
        ),
      }),
    })
  }

  const formValidators = field.form.options.validators ?? []
  appendErrors({
    destination: errors,
    errorBuckets: meta._formValidatorErrors,
    errorSourceEvents: meta._formValidatorErrorSourceEvents,
    mode,
    getSource: (validatorIndex, sourceEvent) => {
      if (
        validatorIndex === formValidators.length &&
        sourceEvent === 'submit'
      ) {
        return { scope: 'onSubmit', validatorType: 'callback' }
      }

      return {
        scope: 'form',
        validatorIndex,
        validatorType: getValidatorType(formValidators[validatorIndex]),
      }
    },
  })

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

function addListensToRelations(
  relations: Map<FieldId, FieldRelationAccumulator>,
  listenToFields: FieldListenToFields | null,
  kind: DevtoolsFieldRelationKind,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
): void {
  listenToFields?.forEach((sourceMetas, itemIndex) => {
    for (const sourceMeta of sourceMetas) {
      addRelation(
        relations,
        sourceMeta.field,
        getRelationCause(
          kind,
          itemIndex,
          sourceMeta.name,
          sourceMeta.field.name,
        ),
        identity,
      )
    }
  })
}

function getConfiguredPath(
  sourceField: AnyInternalFieldApi,
  listenToFields: FieldListenToFields | null,
  itemIndex: number,
): string | undefined {
  return listenToFields?.[itemIndex]?.find(
    (sourceMeta) => sourceMeta.field === sourceField,
  )?.name
}

function addListenedToByRelations(
  relations: Map<FieldId, FieldRelationAccumulator>,
  sourceField: AnyInternalFieldApi,
  watchingFields: FieldWatchingFields | null,
  getListenToFields: (
    watchingField: AnyInternalFieldApi,
  ) => FieldListenToFields | null,
  kind: DevtoolsFieldRelationKind,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
): void {
  watchingFields?.forEach((itemIndexes, watchingField) => {
    if (watchingField._isKilled) return

    const listenToFields = getListenToFields(watchingField)
    for (const itemIndex of itemIndexes) {
      addRelation(
        relations,
        watchingField,
        getRelationCause(
          kind,
          itemIndex,
          getConfiguredPath(sourceField, listenToFields, itemIndex),
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

export function getDevtoolsFieldRelations(
  field: AnyInternalFieldApi,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
): DevtoolsFieldRelations {
  const listensTo = new Map<FieldId, FieldRelationAccumulator>()
  const listenedToBy = new Map<FieldId, FieldRelationAccumulator>()

  addListensToRelations(listensTo, field._listenToFields, 'listener', identity)
  addListensToRelations(
    listensTo,
    field._validateOnFields,
    'validator',
    identity,
  )
  addListenedToByRelations(
    listenedToBy,
    field,
    field._watchingFields,
    (watchingField) => watchingField._listenToFields,
    'listener',
    identity,
  )
  addListenedToByRelations(
    listenedToBy,
    field,
    field._watchingValidatorFields,
    (watchingField) => watchingField._validateOnFields,
    'validator',
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
      ? { defaultValue: getBy(field.form.options.defaultValues, field.name) }
      : {}),
  }
}

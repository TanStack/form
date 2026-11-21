import { getBy, isStandardSchema } from '@tanstack/form-core/internals'
import { compareFieldPaths } from '../utils'
import type {
  AnyInternalFieldApi,
  AnyValidatorInstance,
  InternalFieldState,
  ValidationErrorStoreState,
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
  errorMap: ValidationErrorStoreState
  validatorInstances: ReadonlyArray<AnyValidatorInstance> | null
  getSource: (
    validatorIndex: number,
    sourceEvent: string,
  ) => DevtoolsFieldErrorSource
  mode: FieldErrorPayloadMode
}): void {
  validatorInstances?.forEach((validatorInstance, validatorIndex) => {
    const errors = errorMap?.get(validatorInstance)
    const sourceEvent = validatorInstance.lastAppliedEvent
    if (!errors || !sourceEvent) return
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
  mode: FieldErrorPayloadMode,
): Array<DevtoolsFieldError> {
  // Keep this traversal aligned with the core error store so
  // these entries have the same order as field.state.meta.original.errors.
  const errors: Array<DevtoolsFieldError> = []
  const errorMap = field._errorStore.atom.get()

  appendValidatorErrors({
    destination: errors,
    errorMap: errorMap,
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

  if (errorMap) {
    const containingGroup = field._getFormGroup()

    appendValidatorErrors({
      destination: errors,
      errorMap: errorMap,
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
    errorMap: errorMap,
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

  const onSubmitErrorState = errorMap?.get(field.form._onSubmitSource)
  if (onSubmitErrorState) {
    const submitErrors = onSubmitErrorState
    const sourceEvent = field.form._onSubmitSource.lastAppliedEvent!
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

function addForwardRelations(
  relations: Map<FieldId, FieldRelationAccumulator>,
  field: AnyInternalFieldApi,
  kind: DevtoolsFieldRelationKind,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
): void {
  const instances =
    kind === 'listener' ? field._listenerInstances : field._validatorInstances
  instances?.forEach((instance, itemIndex) => {
    for (const configuredPath of new Set(
      instance.definition.watchFields ?? [],
    )) {
      const sourceField = field.form._tryGetFieldApi(configuredPath)
      if (!sourceField) continue
      addRelation(
        relations,
        sourceField,
        getRelationCause(kind, itemIndex, configuredPath, sourceField.name),
        identity,
      )
    }
  })
}

function addReverseRelations(
  relations: Map<FieldId, FieldRelationAccumulator>,
  sourceField: AnyInternalFieldApi,
  kind: DevtoolsFieldRelationKind,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
): void {
  const registry =
    kind === 'listener'
      ? sourceField.form._watchingListenerFields
      : sourceField.form._watchingValidatorFields
  for (const watchingField of registry.get(sourceField.name) ?? []) {
    if (watchingField._isKilled) continue
    const instances =
      kind === 'listener'
        ? watchingField._listenerInstances
        : watchingField._validatorInstances
    instances?.forEach((instance, itemIndex) => {
      for (const configuredPath of new Set(
        instance.definition.watchFields ?? [],
      )) {
        if (configuredPath !== sourceField.name) continue
        addRelation(
          relations,
          watchingField,
          getRelationCause(kind, itemIndex, configuredPath, sourceField.name),
          identity,
        )
      }
    })
  }
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

  addForwardRelations(listensTo, field, 'listener', identity)
  addForwardRelations(listensTo, field, 'validator', identity)
  addReverseRelations(listenedToBy, field, 'listener', identity)
  addReverseRelations(listenedToBy, field, 'validator', identity)

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

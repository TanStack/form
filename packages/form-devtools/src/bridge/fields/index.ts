import { visitFieldSubtree } from '@tanstack/form-core/internals'
import { createFieldIdentityController } from './identity'
import { createFieldDetailsController } from './details'
import { createFieldErrorDebugReportsController } from './debugReports'
import { createFieldDebugReportsController } from './fieldDebugReports'
import { createFieldListController } from './list'
import { createFieldActionsController } from './actions'
import type {
  AnyInternalFieldApi,
  AnyInternalFormApi,
  FieldDependencyChange,
} from '@tanstack/form-core/internals'
import type { DevtoolsMountedFieldScaffold } from '../../eventClientTypes'
import type { FormId } from '../../types/branded'
import type { MountedFormsController } from '../forms/mountedForms'

interface FieldsController {
  dispose: () => void
  mountForm: (form: AnyInternalFormApi) => void
  unmountForm: (formInstanceId: FormId) => void
  mountField: (field: AnyInternalFieldApi) => void
  updateField: (field: AnyInternalFieldApi) => void
  fieldAdded: (field: AnyInternalFieldApi) => void
  fieldDependenciesChanged: (
    changes: ReadonlyArray<FieldDependencyChange>,
  ) => void
  unmountField: (field: AnyInternalFieldApi, previousPath: string) => void
  moveField: (field: AnyInternalFieldApi, previousPath: string) => void
  removeFieldSubtree: (
    form: AnyInternalFormApi,
    fields: Array<{ field: AnyInternalFieldApi; previousPath: string }>,
  ) => void
  getFieldRowsSnapshot: (
    form: AnyInternalFormApi,
  ) => Array<DevtoolsMountedFieldScaffold>
}

function addForwardRelations(
  fields: Set<AnyInternalFieldApi>,
  relationGroups: AnyInternalFieldApi['_listenToFields'],
): void {
  relationGroups?.forEach((relations) => {
    for (const relation of relations) fields.add(relation.field)
  })
}

function addValidatorForwardRelations(
  fields: Set<AnyInternalFieldApi>,
  field: AnyInternalFieldApi,
): void {
  field._validatorInstances?.forEach((validatorInstance) => {
    validatorInstance.resolvedWatchFields?.forEach((sourceField) =>
      fields.add(sourceField),
    )
  })
}

function addReverseRelations(
  fields: Set<AnyInternalFieldApi>,
  relationGroups:
    | AnyInternalFieldApi['_watchingFields']
    | AnyInternalFieldApi['_watchingValidatorFields'],
): void {
  relationGroups?.forEach((_indexes, watchingField) => {
    fields.add(watchingField)
  })
}

function addRelationNeighborhood(
  fields: Set<AnyInternalFieldApi>,
  field: AnyInternalFieldApi,
): void {
  fields.add(field)
  addForwardRelations(fields, field._listenToFields)
  addValidatorForwardRelations(fields, field)
  addReverseRelations(fields, field._watchingFields)
  addReverseRelations(fields, field._watchingValidatorFields)
}

export function createFieldsController(
  mountedForms: MountedFormsController,
): FieldsController {
  const identity = createFieldIdentityController()
  const fieldActions = createFieldActionsController({
    identity,
    mountedForms,
  })
  const fieldList = createFieldListController({ identity, mountedForms })
  const fieldDetails = createFieldDetailsController({ identity, mountedForms })
  const fieldErrorDebugReports = createFieldErrorDebugReportsController({
    identity,
    mountedForms,
  })
  const fieldDebugReports = createFieldDebugReportsController({
    identity,
    mountedForms,
  })

  return {
    dispose: () => {
      fieldDebugReports.dispose()
      fieldErrorDebugReports.dispose()
      fieldDetails.dispose()
      fieldList.dispose()
      fieldActions.dispose()
    },
    getFieldRowsSnapshot: fieldList.getFieldRowsSnapshot,
    mountForm: fieldList.formMounted,
    unmountForm: (formInstanceId) => {
      const form = mountedForms.getMountedForm(formInstanceId)
      fieldDetails.formUnmounted(formInstanceId)
      fieldList.formUnmounted(formInstanceId)
      if (form) identity.deleteForm(form)
    },
    mountField: fieldList.fieldMounted,
    updateField: fieldList.fieldUpdated,
    fieldAdded: (field) => {
      fieldList.fieldUpdated(field)

      const updatedFields = new Set<AnyInternalFieldApi>()
      addRelationNeighborhood(updatedFields, field)
      if (!field._parent._isRoot) updatedFields.add(field._parent)
      fieldDetails.fieldsUpdated(updatedFields)
    },
    fieldDependenciesChanged: (changes) => {
      const updatedFields = new Set<AnyInternalFieldApi>()
      for (const { sourceField, watchingField } of changes) {
        updatedFields.add(sourceField)
        updatedFields.add(watchingField)
      }
      fieldDetails.fieldsUpdated(updatedFields)
    },
    unmountField: fieldList.fieldUnmounted,
    moveField: (field, previousPath) => {
      const updatedFields = new Set<AnyInternalFieldApi>()
      visitFieldSubtree(field, (movedField) => {
        fieldList.fieldMoved(movedField, previousPath)
        addRelationNeighborhood(updatedFields, movedField)
      })
      fieldDetails.fieldsUpdated(updatedFields)
    },
    removeFieldSubtree: (form, fields) => {
      const removedFields = fields.map(({ field }) => field)
      const removedFieldSet = new Set(removedFields)
      const updatedParents = new Set<AnyInternalFieldApi>()
      for (const removedField of removedFields) {
        const parent = removedField._parent
        if (
          !parent._isRoot &&
          !parent._isKilled &&
          !removedFieldSet.has(parent)
        ) {
          updatedParents.add(parent)
        }
      }

      fieldDetails.fieldSubtreeRemoved(removedFields)
      fieldList.fieldSubtreeRemoved(form, removedFields)

      for (const { field } of fields) {
        identity.deleteField(field)
      }
      fieldDetails.fieldsUpdated(updatedParents)
    },
  }
}

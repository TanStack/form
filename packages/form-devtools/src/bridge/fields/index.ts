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

function addWatchersAtPath(
  fields: Set<AnyInternalFieldApi>,
  form: AnyInternalFormApi,
  path: string,
): void {
  for (const owner of form._watchingListenerFields.get(path) ?? [])
    fields.add(owner)
  for (const owner of form._watchingValidatorFields.get(path) ?? [])
    fields.add(owner)
}

function addRelationNeighborhood(
  fields: Set<AnyInternalFieldApi>,
  field: AnyInternalFieldApi,
): void {
  fields.add(field)
  for (const path of field._watchedListenerNames ?? []) {
    const source = field.form._tryGetFieldApi(path)
    if (source) fields.add(source)
  }
  for (const path of field._watchedValidatorNames ?? []) {
    const source = field.form._tryGetFieldApi(path)
    if (source) fields.add(source)
  }
  addWatchersAtPath(fields, field.form, field.name)
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
    updateField: (field) => {
      fieldList.fieldUpdated(field)
      fieldDetails.fieldsUpdated([field])
    },
    fieldAdded: (field) => {
      fieldList.fieldUpdated(field)

      const updatedFields = new Set<AnyInternalFieldApi>()
      addRelationNeighborhood(updatedFields, field)
      if (!field._parent._isRoot) updatedFields.add(field._parent)
      fieldDetails.fieldsUpdated(updatedFields)
    },
    fieldDependenciesChanged: (changes) => {
      const updatedFields = new Set<AnyInternalFieldApi>()
      for (const { sourceFieldName, watchingField } of changes) {
        const sourceField = watchingField.form._tryGetFieldApi(sourceFieldName)
        if (sourceField) updatedFields.add(sourceField)
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
        addWatchersAtPath(
          updatedFields,
          field.form,
          previousPath + movedField.name.slice(field.name.length),
        )
      })
      fieldDetails.fieldsUpdated(updatedFields)
    },
    removeFieldSubtree: (form, fields) => {
      const removedFields = fields.map(({ field }) => field)
      const removedFieldSet = new Set(removedFields)
      const updatedParents = new Set<AnyInternalFieldApi>()
      for (const { previousPath } of fields)
        addWatchersAtPath(updatedParents, form, previousPath)
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

import { uuid } from '@tanstack/form-core/internals'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { FieldId } from '../../types/branded'

export interface FieldIdentityController {
  deleteField: (field: AnyInternalFieldApi) => void
  deleteForm: (form: AnyInternalFieldApi['form']) => void
  getExistingFieldId: (field: AnyInternalFieldApi) => FieldId | undefined
  getField: (fieldId: FieldId) => AnyInternalFieldApi | undefined
  getFieldId: (field: AnyInternalFieldApi) => FieldId
}

export function createFieldIdentityController(): FieldIdentityController {
  const fieldInstanceIds = new WeakMap<AnyInternalFieldApi, FieldId>()
  const fieldsById = new Map<FieldId, WeakRef<AnyInternalFieldApi>>()
  const fieldIdsByForm = new WeakMap<
    AnyInternalFieldApi['form'],
    Set<FieldId>
  >()

  const deleteField = (field: AnyInternalFieldApi): void => {
    const fieldId = fieldInstanceIds.get(field)
    if (!fieldId) return

    fieldInstanceIds.delete(field)
    fieldsById.delete(fieldId)
    fieldIdsByForm.get(field.form)?.delete(fieldId)
  }

  return {
    deleteField,
    deleteForm: (form) => {
      const fieldIds = fieldIdsByForm.get(form)
      if (!fieldIds) return

      for (const fieldId of fieldIds) {
        const field = fieldsById.get(fieldId)?.deref()
        if (field) fieldInstanceIds.delete(field)
        fieldsById.delete(fieldId)
      }
      fieldIdsByForm.delete(form)
    },
    getExistingFieldId: (field) => fieldInstanceIds.get(field),
    getField: (fieldId) => {
      const field = fieldsById.get(fieldId)?.deref()
      if (!field) fieldsById.delete(fieldId)
      return field
    },
    getFieldId: (field) => {
      const existing = fieldInstanceIds.get(field)
      if (existing) return existing

      const fieldId = uuid() as FieldId
      fieldInstanceIds.set(field, fieldId)
      fieldsById.set(fieldId, new WeakRef(field))

      let formFieldIds = fieldIdsByForm.get(field.form)
      if (!formFieldIds) {
        formFieldIds = new Set()
        fieldIdsByForm.set(field.form, formFieldIds)
      }
      formFieldIds.add(fieldId)
      return fieldId
    },
  }
}

import { uuid } from '@tanstack/form-core/internals'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { FieldId } from '../../types/branded'

export interface FieldIdentityController {
  deleteField: (field: AnyInternalFieldApi) => void
  getExistingFieldId: (field: AnyInternalFieldApi) => FieldId | undefined
  getFieldId: (field: AnyInternalFieldApi) => FieldId
}

export function createFieldIdentityController(): FieldIdentityController {
  const fieldInstanceIds = new WeakMap<AnyInternalFieldApi, FieldId>()

  return {
    deleteField: (field) => fieldInstanceIds.delete(field),
    getExistingFieldId: (field) => fieldInstanceIds.get(field),
    getFieldId: (field) => {
      const existing = fieldInstanceIds.get(field)
      if (existing) return existing

      const fieldId = uuid() as FieldId
      fieldInstanceIds.set(field, fieldId)
      return fieldId
    },
  }
}

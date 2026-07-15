import { createFieldIdentityController } from './identity'
import { createFieldListController } from './list'
import type {
  AnyInternalFieldApi,
  AnyInternalFormApi,
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

export function createFieldsController(
  mountedForms: MountedFormsController,
): FieldsController {
  const identity = createFieldIdentityController()
  const fieldList = createFieldListController({ identity, mountedForms })

  return {
    dispose: fieldList.dispose,
    getFieldRowsSnapshot: fieldList.getFieldRowsSnapshot,
    mountForm: fieldList.formMounted,
    unmountForm: fieldList.formUnmounted,
    mountField: fieldList.fieldMounted,
    updateField: fieldList.fieldUpdated,
    unmountField: fieldList.fieldUnmounted,
    moveField: fieldList.fieldMoved,
    removeFieldSubtree: (form, fields) => {
      fieldList.fieldSubtreeRemoved(
        form,
        fields.map(({ field }) => field),
      )

      for (const { field } of fields) {
        identity.deleteField(field)
      }
    },
  }
}

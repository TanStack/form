import { createFieldIdentityController } from './identity'
import { createFieldListController } from './list'
import type {
  AnyInternalFieldApi,
  AnyInternalFormApi,
} from '@tanstack/form-core/internals'
import type { DevtoolsMountedFieldRow } from '../../eventClientTypes'
import type { FormId } from '../../types/branded'
import type { MountedFormsController } from '../forms/mountedForms'

interface FieldsController {
  dispose: () => void
  mountForm: (form: AnyInternalFormApi) => void
  unmountForm: (formInstanceId: FormId) => void
  mountField: (field: AnyInternalFieldApi) => void
  unmountField: (field: AnyInternalFieldApi, previousPath: string) => void
  moveField: (field: AnyInternalFieldApi, previousPath: string) => void
  removeFieldSubtree: (
    form: AnyInternalFormApi,
    fields: Array<{ field: AnyInternalFieldApi; previousPath: string }>,
  ) => void
  getMountedFieldRowsSnapshot: (
    form: AnyInternalFormApi,
  ) => Array<DevtoolsMountedFieldRow>
}

export function createFieldsController(
  mountedForms: MountedFormsController,
): FieldsController {
  const identity = createFieldIdentityController()
  const fieldList = createFieldListController({ identity, mountedForms })

  return {
    dispose: fieldList.dispose,
    getMountedFieldRowsSnapshot: fieldList.getMountedFieldRowsSnapshot,
    mountForm: fieldList.formMounted,
    unmountForm: fieldList.formUnmounted,
    mountField: fieldList.fieldMounted,
    unmountField: fieldList.fieldUnmounted,
    moveField: fieldList.fieldMoved,
    removeFieldSubtree: (form, fields) => {
      for (const { field } of fields) {
        identity.deleteField(field)
      }

      fieldList.fieldSubtreeRemoved(form)
    },
  }
}

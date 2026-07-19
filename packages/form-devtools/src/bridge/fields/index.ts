import { createFieldIdentityController } from './identity'
import { createFieldDetailsController } from './details'
import { createFieldDebugReportsController } from './debugReports'
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
  const fieldDetails = createFieldDetailsController({ identity, mountedForms })
  const fieldDebugReports = createFieldDebugReportsController({
    identity,
    mountedForms,
  })

  return {
    dispose: () => {
      fieldDebugReports.dispose()
      fieldDetails.dispose()
      fieldList.dispose()
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
    unmountField: fieldList.fieldUnmounted,
    moveField: (field, previousPath) => {
      fieldList.fieldMoved(field, previousPath)
      fieldDetails.fieldMoved(field)
    },
    removeFieldSubtree: (form, fields) => {
      fieldDetails.fieldSubtreeRemoved(fields.map(({ field }) => field))
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

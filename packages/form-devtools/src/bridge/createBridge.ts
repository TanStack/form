import type {
  AnyInternalFieldApi,
  AnyInternalFormApi,
  FormDevtoolsBridge,
} from '@tanstack/form-core/internals'
import type { FormId } from '../types/branded'

export interface MountedFormsBridgeController {
  mountForm: (form: AnyInternalFormApi) => boolean
  unmountForm: (
    form: AnyInternalFormApi,
    onFinalUnmount: (formInstanceId: FormId) => void,
  ) => boolean
  updateForm: (form: AnyInternalFormApi) => void
}

export interface FieldsBridgeController {
  mountForm: (form: AnyInternalFormApi) => void
  unmountForm: (formInstanceId: FormId) => void
  mountField: (field: AnyInternalFieldApi) => void
  unmountField: (field: AnyInternalFieldApi, previousPath: string) => void
  moveField: (field: AnyInternalFieldApi, previousPath: string) => void
  removeFieldSubtree: (
    form: AnyInternalFormApi,
    fields: Array<{ field: AnyInternalFieldApi; previousPath: string }>,
  ) => void
}

export function createFormDevtoolsBridge({
  fields,
  mountedForms,
}: {
  fields: FieldsBridgeController
  mountedForms: MountedFormsBridgeController
}): FormDevtoolsBridge {
  return {
    mountForm: (form) => {
      if (mountedForms.mountForm(form)) {
        fields.mountForm(form)
      }
    },
    unmountForm: (form) => {
      mountedForms.unmountForm(form, fields.unmountForm)
    },
    updateForm: mountedForms.updateForm,
    mountField: fields.mountField,
    unmountField: fields.unmountField,
    moveField: fields.moveField,
    removeFieldSubtree: fields.removeFieldSubtree,
  }
}

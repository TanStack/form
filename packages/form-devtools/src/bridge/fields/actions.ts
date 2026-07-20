import { formDevtoolsEventClient } from '../../eventClient.lib'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { FieldActionRequest } from '../../eventClientTypes'
import type { MountedFormsController } from '../forms/mountedForms'
import type { FieldIdentityController } from './identity'

interface FieldActionsController {
  dispose: () => void
}

export function createFieldActionsController({
  identity,
  mountedForms,
}: {
  identity: FieldIdentityController
  mountedForms: MountedFormsController
}): FieldActionsController {
  const getRequestedField = (
    request: FieldActionRequest,
  ): AnyInternalFieldApi | undefined => {
    const form = mountedForms.getMountedForm(request.formInstanceId)
    const field = identity.getField(request.fieldId)

    if (!form || !field || field.form !== form || field._isKilled) return
    return field
  }

  const cleanupChangeRequestListener = formDevtoolsEventClient.on(
    'field-handle-change-request',
    (event) => {
      getRequestedField(event.payload)?.handleChange(
        (previousValue: unknown) => previousValue,
      )
    },
  )
  const cleanupBlurRequestListener = formDevtoolsEventClient.on(
    'field-handle-blur-request',
    (event) => getRequestedField(event.payload)?.handleBlur(),
  )
  const cleanupResetRequestListener = formDevtoolsEventClient.on(
    'field-reset-request',
    (event) => getRequestedField(event.payload)?.reset(),
  )

  return {
    dispose: () => {
      cleanupChangeRequestListener()
      cleanupBlurRequestListener()
      cleanupResetRequestListener()
    },
  }
}

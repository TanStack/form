import { formDevtoolsEventClient } from '../../eventClient.lib'
import { getFieldErrorDebugSuspicions } from './debug'
import type { MountedFormsController } from '../forms/mountedForms'
import type { FieldIdentityController } from './identity'
import type { FieldErrorDebugReportRequest } from '../../eventClientTypes'

export interface FieldDebugReportsController {
  dispose: () => void
}

export function createFieldDebugReportsController({
  identity,
  mountedForms,
}: {
  identity: FieldIdentityController
  mountedForms: MountedFormsController
}): FieldDebugReportsController {
  const emitReport = (request: FieldErrorDebugReportRequest): void => {
    const form = mountedForms.getMountedForm(request.formInstanceId)
    const field = identity.getField(request.fieldId)
    const isValidTarget =
      form !== undefined &&
      field !== undefined &&
      field.form === form &&
      !field._isKilled

    formDevtoolsEventClient.emit('field-error-debug-report', {
      requestId: request.requestId,
      suspicions: isValidTarget
        ? getFieldErrorDebugSuspicions({ field, error: request.error })
        : [],
    })
  }

  const cleanupRequestListener = formDevtoolsEventClient.on(
    'field-error-debug-report-request',
    (event) => emitReport(event.payload),
  )

  return { dispose: cleanupRequestListener }
}

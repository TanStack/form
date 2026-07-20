import { formDevtoolsEventClient } from '../../eventClient.lib'
import { getFieldDebugSuspicions } from './fieldDebug'
import type { MountedFormsController } from '../forms/mountedForms'
import type { FieldIdentityController } from './identity'
import type { FieldDebugReportRequest } from '../../eventClientTypes'

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
  const emitReport = (request: FieldDebugReportRequest): void => {
    const form = mountedForms.getMountedForm(request.formInstanceId)
    const field = identity.getField(request.fieldId)
    const isValidTarget =
      form !== undefined &&
      field !== undefined &&
      field.form === form &&
      !field._isKilled

    formDevtoolsEventClient.emit('field-debug-report', {
      requestId: request.requestId,
      suspicions: isValidTarget ? getFieldDebugSuspicions({ field }) : [],
    })
  }

  const cleanupRequestListener = formDevtoolsEventClient.on(
    'field-debug-report-request',
    (event) => emitReport(event.payload),
  )

  return { dispose: cleanupRequestListener }
}

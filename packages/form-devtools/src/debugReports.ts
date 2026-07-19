import { uuid } from '@tanstack/form-core/internals'
import { formDevtoolsEventClient } from './eventClient.lib'
import type {
  FieldErrorDebugReport,
  FieldErrorDebugReportRequest,
} from './eventClientTypes'

export type FieldErrorDebugReportTarget = Omit<
  FieldErrorDebugReportRequest,
  'requestId'
>

export function requestFieldErrorDebugReport(
  target: FieldErrorDebugReportTarget,
  onReport: (report: FieldErrorDebugReport) => void,
): () => void {
  const requestId = uuid()
  let active = true

  const cleanupReportListener = formDevtoolsEventClient.on(
    'field-error-debug-report',
    (event) => {
      if (!active || event.payload.requestId !== requestId) return

      active = false
      cleanupReportListener()
      onReport(event.payload)
    },
  )

  formDevtoolsEventClient.emit('field-error-debug-report-request', {
    ...target,
    requestId,
  })

  return () => {
    if (!active) return
    active = false
    cleanupReportListener()
  }
}

import { uuid } from '@tanstack/form-core/internals'
import { formDevtoolsEventClient } from './eventClient.lib'
import type {
  FieldDebugReport,
  FieldDebugReportRequest,
  FieldErrorDebugReport,
  FieldErrorDebugReportRequest,
} from './eventClientTypes'

type FieldDebugReportTarget = Omit<FieldDebugReportRequest, 'requestId'>

export function requestFieldDebugReport(
  target: FieldDebugReportTarget,
  onReport: (report: FieldDebugReport) => void,
): () => void {
  const requestId = uuid()
  let active = true

  const cleanupReportListener = formDevtoolsEventClient.on(
    'field-debug-report',
    (event) => {
      if (!active || event.payload.requestId !== requestId) return

      active = false
      cleanupReportListener()
      onReport(event.payload)
    },
  )

  formDevtoolsEventClient.emit('field-debug-report-request', {
    ...target,
    requestId,
  })

  return () => {
    if (!active) return
    active = false
    cleanupReportListener()
  }
}

type FieldErrorDebugReportTarget = Omit<
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

import { describe, expect, it } from 'vitest'
import {
  requestFieldDebugReport,
  requestFieldErrorDebugReport,
} from '../src/debugReports'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { connectTestEventBus } from './testEventBus'
import type {
  DevtoolsFieldError,
  FieldDebugReportRequest,
  FieldErrorDebugReportRequest,
} from '../src/eventClientTypes'

const error = {
  error: { message: 'Schema error' },
  source: {
    scope: 'field',
    validatorIndex: 0,
    validatorType: 'schema',
  },
  sourceEvent: 'change',
} satisfies DevtoolsFieldError

describe('debug report requests', () => {
  it('correlates general field responses and ignores cancelled requests', () => {
    const disconnectEventBus = connectTestEventBus()
    const requests: Array<FieldDebugReportRequest> = []
    const cleanupRequests = formDevtoolsEventClient.on(
      'field-debug-report-request',
      (event) => requests.push(event.payload),
    )
    const received: Array<string> = []
    const target = {
      formInstanceId: 'form-a',
      fieldId: 'field-a',
    } as const

    const cancelFirst = requestFieldDebugReport(target, (report) =>
      received.push(`first:${report.requestId}`),
    )
    requestFieldDebugReport(target, (report) =>
      received.push(`second:${report.requestId}`),
    )
    const cancelThird = requestFieldDebugReport(target, (report) =>
      received.push(`third:${report.requestId}`),
    )
    cancelThird()

    formDevtoolsEventClient.emit('field-debug-report', {
      requestId: requests[1]!.requestId,
      suspicions: [],
    })
    formDevtoolsEventClient.emit('field-debug-report', {
      requestId: requests[0]!.requestId,
      suspicions: [],
    })
    formDevtoolsEventClient.emit('field-debug-report', {
      requestId: requests[2]!.requestId,
      suspicions: [],
    })

    expect(received).toEqual([
      `second:${requests[1]!.requestId}`,
      `first:${requests[0]!.requestId}`,
    ])

    cancelFirst()
    cleanupRequests()
    disconnectEventBus()
  })

  it('correlates concurrent responses and ignores cancelled requests', () => {
    const disconnectEventBus = connectTestEventBus()
    const requests: Array<FieldErrorDebugReportRequest> = []
    const cleanupRequests = formDevtoolsEventClient.on(
      'field-error-debug-report-request',
      (event) => requests.push(event.payload),
    )
    const received: Array<string> = []
    const target = {
      formInstanceId: 'form-a',
      fieldId: 'field-a',
      error,
    } as const

    const cancelFirst = requestFieldErrorDebugReport(target, (report) =>
      received.push(`first:${report.requestId}`),
    )
    requestFieldErrorDebugReport(target, (report) =>
      received.push(`second:${report.requestId}`),
    )
    const cancelThird = requestFieldErrorDebugReport(target, (report) =>
      received.push(`third:${report.requestId}`),
    )
    cancelThird()

    formDevtoolsEventClient.emit('field-error-debug-report', {
      requestId: requests[1]!.requestId,
      suspicions: [],
    })
    formDevtoolsEventClient.emit('field-error-debug-report', {
      requestId: requests[0]!.requestId,
      suspicions: [],
    })
    formDevtoolsEventClient.emit('field-error-debug-report', {
      requestId: requests[2]!.requestId,
      suspicions: [],
    })

    expect(received).toEqual([
      `second:${requests[1]!.requestId}`,
      `first:${requests[0]!.requestId}`,
    ])

    cancelFirst()
    cleanupRequests()
    disconnectEventBus()
  })
})

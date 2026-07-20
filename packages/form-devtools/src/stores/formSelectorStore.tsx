import { createMemo, createSignal } from 'solid-js'
import { uuid } from '@tanstack/form-core/internals'
import type { DevtoolsMountedForm } from '@/eventClientTypes'
import type { FormId } from '@/types/branded'
import { formDevtoolsEventClient } from '@/eventClient.lib'

export const BRIDGE_STATUS_RESPONSE_TIMEOUT_MS = 1_000
export const BRIDGE_STATUS_HEARTBEAT_INTERVAL_MS = 5_000

type FormBridgeStatus = 'checking' | 'connected' | 'unavailable'

export const [mountedForms, setMountedForms] = createSignal<
  Array<DevtoolsMountedForm>
>([])

export const [requestedFormId, setRequestedFormId] =
  createSignal<FormId | null>(null)

export const [bridgeStatus, setBridgeStatus] =
  createSignal<FormBridgeStatus>('checking')

export const [bridgeInstanceId, setBridgeInstanceId] = createSignal<
  string | null
>(null)

export const [bridgeMountedFormCount, setBridgeMountedFormCount] = createSignal<
  number | null
>(null)

export const formSelectorCache = {
  mountedForms,
  setMountedForms,
  requestedFormId,
  setRequestedFormId,
  bridgeStatus,
  setBridgeStatus,
  bridgeInstanceId,
  setBridgeInstanceId,
  bridgeMountedFormCount,
  setBridgeMountedFormCount,
  requestBridgeStatus,
}

function getSelectedForm(): DevtoolsMountedForm | null {
  const opts = mountedForms()
  const requestedId = requestedFormId()

  const fallbackChoice = opts[0]
  // No form is mounted, so there's no possible selection.
  // Also serves as array length check for `.some` below
  if (!fallbackChoice) return null

  if (requestedId === null) return fallbackChoice

  // The user selected form may be (temporarily) unmounted and nonexistent, so don't preserve it
  return opts.find((opt) => opt.instanceId === requestedId) ?? fallbackChoice
}

export function createFormSelectorComputations() {
  const selectedForm = createMemo(getSelectedForm)

  return { selectedForm }
}

let mountedEventConsumers = 0
let cleanupMountedFormEvents: (() => void) | undefined
let cleanupBridgeStatusEvents: (() => void) | undefined
let pendingBridgeStatusRequestId: string | undefined
let bridgeStatusResponseTimer: ReturnType<typeof setTimeout> | undefined
let bridgeStatusHeartbeatTimer: ReturnType<typeof setTimeout> | undefined

function clearBridgeStatusResponseTimer(): void {
  if (bridgeStatusResponseTimer === undefined) return
  clearTimeout(bridgeStatusResponseTimer)
  bridgeStatusResponseTimer = undefined
}

function clearBridgeStatusHeartbeatTimer(): void {
  if (bridgeStatusHeartbeatTimer === undefined) return
  clearTimeout(bridgeStatusHeartbeatTimer)
  bridgeStatusHeartbeatTimer = undefined
}

function scheduleBridgeStatusHeartbeat(): void {
  clearBridgeStatusHeartbeatTimer()
  if (mountedEventConsumers === 0) return

  bridgeStatusHeartbeatTimer = setTimeout(() => {
    requestBridgeStatus(false)
  }, BRIDGE_STATUS_HEARTBEAT_INTERVAL_MS)
}

function requestBridgeStatus(showChecking = true): void {
  if (mountedEventConsumers === 0) return

  clearBridgeStatusResponseTimer()
  clearBridgeStatusHeartbeatTimer()

  const requestId = uuid()
  pendingBridgeStatusRequestId = requestId
  if (showChecking) {
    setBridgeStatus('checking')
    setBridgeInstanceId(null)
    setBridgeMountedFormCount(null)
  }

  // Arm the timeout before emitting because the in-page event transport can
  // deliver the bridge response synchronously.
  bridgeStatusResponseTimer = setTimeout(() => {
    if (pendingBridgeStatusRequestId !== requestId) return

    pendingBridgeStatusRequestId = undefined
    bridgeStatusResponseTimer = undefined
    setBridgeStatus('unavailable')
    setBridgeInstanceId(null)
    setBridgeMountedFormCount(null)
    scheduleBridgeStatusHeartbeat()
  }, BRIDGE_STATUS_RESPONSE_TIMEOUT_MS)

  formDevtoolsEventClient.emit('bridge-status-request', { requestId })
}

export function mountFormSelectorEvents(): () => void {
  if (mountedEventConsumers === 0) {
    cleanupMountedFormEvents = formDevtoolsEventClient.on(
      'mounted-forms-changed',
      (event) => setMountedForms(event.payload.forms),
    )

    cleanupBridgeStatusEvents = formDevtoolsEventClient.on(
      'bridge-status-response',
      (event) => {
        if (event.payload.requestId !== pendingBridgeStatusRequestId) return

        pendingBridgeStatusRequestId = undefined
        clearBridgeStatusResponseTimer()
        setBridgeInstanceId(event.payload.bridgeInstanceId)
        setBridgeMountedFormCount(event.payload.mountedFormCount)
        setBridgeStatus('connected')
        scheduleBridgeStatusHeartbeat()
      },
    )

    mountedEventConsumers++

    requestBridgeStatus()
    formDevtoolsEventClient.emit('request-mounted-forms', {})
  } else {
    mountedEventConsumers++
  }

  let isMounted = true

  return () => {
    if (!isMounted) return
    isMounted = false
    mountedEventConsumers--

    if (mountedEventConsumers === 0) {
      cleanupMountedFormEvents?.()
      cleanupMountedFormEvents = undefined
      cleanupBridgeStatusEvents?.()
      cleanupBridgeStatusEvents = undefined
      pendingBridgeStatusRequestId = undefined
      clearBridgeStatusResponseTimer()
      clearBridgeStatusHeartbeatTimer()
    }
  }
}

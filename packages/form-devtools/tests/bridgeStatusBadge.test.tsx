import { render } from 'solid-js/web'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BridgeStatusBadge } from '../src/components/header/BridgeStatusBadge'
import {
  FormDevtoolsStoreProvider,
  useFormDevtoolsStore,
} from '../src/stores/formDevtoolsStore'
import {
  BRIDGE_STATUS_HEARTBEAT_INTERVAL_MS,
  BRIDGE_STATUS_RESPONSE_TIMEOUT_MS,
  formSelectorCache,
} from '../src/stores/formSelectorStore'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { connectTestEventBus } from './testEventBus'
import type { FormDevtoolsStore } from '../src/stores/formDevtoolsStore'

const disposers: Array<() => void> = []

beforeEach(() => {
  disposers.push(connectTestEventBus())
})

afterEach(() => {
  for (const dispose of disposers.splice(0)) dispose()
  vi.useRealTimers()
  formSelectorCache.setMountedForms([])
  formSelectorCache.setRequestedFormId(null)
  formSelectorCache.setBridgeStatus('checking')
  formSelectorCache.setBridgeInstanceId(null)
  formSelectorCache.setBridgeMountedFormCount(null)
})

function StoreCapture(props: { onStore: (store: FormDevtoolsStore) => void }) {
  props.onStore(useFormDevtoolsStore())
  return null
}

function renderStatus(
  onStore: (store: FormDevtoolsStore) => void = () => {},
): HTMLDivElement {
  const container = document.createElement('div')
  const dispose = render(
    () => (
      <FormDevtoolsStoreProvider>
        <StoreCapture onStore={onStore} />
        <BridgeStatusBadge />
      </FormDevtoolsStoreProvider>
    ),
    container,
  )
  disposers.push(dispose)
  return container
}

describe('bridge status badge', () => {
  it('distinguishes a connected bridge with no forms from no bridge', async () => {
    vi.useFakeTimers()
    let store!: FormDevtoolsStore
    const container = renderStatus((current) => (store = current))

    expect(container.textContent).toContain('Checking form bridge')

    await vi.advanceTimersByTimeAsync(BRIDGE_STATUS_RESPONSE_TIMEOUT_MS)
    expect(container.textContent).toContain('Form bridge not connected')

    let mountedFormCount = 0
    const cleanupRequest = formDevtoolsEventClient.on(
      'bridge-status-request',
      (event) => {
        formDevtoolsEventClient.emit('bridge-status-response', {
          requestId: event.payload.requestId,
          bridgeInstanceId: 'bridge-a',
          mountedFormCount,
        })
      },
    )
    disposers.push(cleanupRequest)

    formSelectorCache.requestBridgeStatus()
    expect(container.textContent).toContain(
      'Bridge connected · no mounted forms',
    )
    expect(store.formSelector.bridgeInstanceId()).toBe('bridge-a')
    expect(store.formSelector.bridgeMountedFormCount()).toBe(0)

    formSelectorCache.setMountedForms([
      { instanceId: 'form-a', label: 'Form A' },
    ])
    expect(container.textContent).toContain(
      'Bridge connected · no mounted forms',
    )

    mountedFormCount = 1
    formSelectorCache.requestBridgeStatus()
    expect(container.textContent).toBe('')
    expect(store.formSelector.bridgeMountedFormCount()).toBe(1)
  })

  it('detects when a previously connected bridge stops answering', async () => {
    vi.useFakeTimers()
    const cleanupRequest = formDevtoolsEventClient.on(
      'bridge-status-request',
      (event) => {
        formDevtoolsEventClient.emit('bridge-status-response', {
          requestId: event.payload.requestId,
          bridgeInstanceId: 'bridge-a',
          mountedFormCount: 0,
        })
      },
    )
    let store!: FormDevtoolsStore
    const container = renderStatus((current) => (store = current))

    expect(container.textContent).toContain(
      'Bridge connected · no mounted forms',
    )

    cleanupRequest()
    await vi.advanceTimersByTimeAsync(
      BRIDGE_STATUS_HEARTBEAT_INTERVAL_MS + BRIDGE_STATUS_RESPONSE_TIMEOUT_MS,
    )

    expect(container.textContent).toContain('Form bridge not connected')
    expect(store.formSelector.bridgeInstanceId()).toBeNull()
    expect(store.formSelector.bridgeMountedFormCount()).toBeNull()
  })
})

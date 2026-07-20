import { installDevtoolsBridge } from '@tanstack/form-core/internals'
import { describe, expect, it } from 'vitest'
import { createBridgeStatusController } from '../src/bridge/status'
import { formDevtoolsEventClient } from '../src/eventClient.lib'
import { connectTestEventBus } from './testEventBus'
import type { FormDevtoolsBridgeStatusResponse } from '../src/eventClientTypes'
import type { FormDevtoolsBridge } from '@tanstack/form-core/internals'

describe('bridge status controller', () => {
  it('only lets the currently installed bridge answer status requests', () => {
    const disconnectEventBus = connectTestEventBus()
    const firstBridge: FormDevtoolsBridge = {}
    const uninstallFirstBridge = installDevtoolsBridge(firstBridge)
    const firstStatus = createBridgeStatusController({
      bridge: firstBridge,
      getMountedFormsSnapshot: () => [],
    })
    const secondBridge: FormDevtoolsBridge = {}
    const uninstallSecondBridge = installDevtoolsBridge(secondBridge)
    const secondStatus = createBridgeStatusController({
      bridge: secondBridge,
      getMountedFormsSnapshot: () => [
        { instanceId: 'form-a', label: 'Form A' },
      ],
    })
    const responses: Array<FormDevtoolsBridgeStatusResponse> = []
    const cleanupResponses = formDevtoolsEventClient.on(
      'bridge-status-response',
      (event) => responses.push(event.payload),
    )

    try {
      formDevtoolsEventClient.emit('bridge-status-request', {
        requestId: 'request-a',
      })

      expect(responses).toHaveLength(1)
      expect(responses[0]).toMatchObject({
        requestId: 'request-a',
        mountedFormCount: 1,
      })
      expect(responses[0]?.bridgeInstanceId).toBeTruthy()
    } finally {
      cleanupResponses()
      secondStatus.dispose()
      firstStatus.dispose()
      uninstallSecondBridge()
      uninstallFirstBridge()
      disconnectEventBus()
    }
  })
})

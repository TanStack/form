import { devtools, uuid } from '@tanstack/form-core/internals'
import { formDevtoolsEventClient } from '../eventClient.lib'
import type { FormDevtoolsBridge } from '@tanstack/form-core/internals'
import type { DevtoolsMountedForm } from '../eventClientTypes'

export interface BridgeStatusController {
  dispose: () => void
}

export function createBridgeStatusController({
  bridge,
  getMountedFormsSnapshot,
}: {
  bridge: FormDevtoolsBridge
  getMountedFormsSnapshot: () => Array<DevtoolsMountedForm>
}): BridgeStatusController {
  const bridgeInstanceId = uuid()

  const cleanupRequestListener = formDevtoolsEventClient.on(
    'bridge-status-request',
    (event) => {
      // HMR may briefly leave an older controller subscribed. Only the bridge
      // currently installed in this form-core instance may answer.
      if (devtools() !== bridge) return

      formDevtoolsEventClient.emit('bridge-status-response', {
        requestId: event.payload.requestId,
        bridgeInstanceId,
        mountedFormCount: getMountedFormsSnapshot().length,
      })
    },
  )

  return { dispose: cleanupRequestListener }
}

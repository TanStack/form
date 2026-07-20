import { installDevtoolsBridge } from '@tanstack/form-core/internals'
import { createFormDevtoolsBridge } from './createBridge'
import { createFieldsController } from './fields'
import { createMountedFormsController } from './forms/mountedForms'
import { createBridgeStatusController } from './status'

interface FormDevtoolsBridgeRuntime {
  dispose: () => void
}

export const formDevtoolsBridgeRuntimeKey = Symbol.for(
  '@tanstack/form-devtools/bridge-runtime',
)

type FormDevtoolsBridgeRuntimeHost = {
  [key: symbol]: FormDevtoolsBridgeRuntime | undefined
}

function getRuntimeHost(host: object): FormDevtoolsBridgeRuntimeHost {
  return host as FormDevtoolsBridgeRuntimeHost
}

function createFormDevtoolsBridgeRuntime(
  host: object = globalThis,
): FormDevtoolsBridgeRuntime {
  const mountedForms = createMountedFormsController()
  const fields = createFieldsController(mountedForms)
  const bridge = createFormDevtoolsBridge({ fields, mountedForms })
  const uninstallBridge = installDevtoolsBridge(bridge)
  const bridgeStatus = createBridgeStatusController({
    bridge,
    getMountedFormsSnapshot: mountedForms.getMountedFormsSnapshot,
  })

  let didDispose = false
  const runtime: FormDevtoolsBridgeRuntime = {
    dispose: () => {
      if (didDispose) return
      didDispose = true

      bridgeStatus.dispose()
      uninstallBridge()
      fields.dispose()
      mountedForms.dispose()

      const runtimeHost = getRuntimeHost(host)
      if (runtimeHost[formDevtoolsBridgeRuntimeKey] === runtime) {
        delete runtimeHost[formDevtoolsBridgeRuntimeKey]
      }
    },
  }

  return runtime
}

export function getOrCreateFormDevtoolsBridgeRuntime({
  host = globalThis,
  createRuntime = () => createFormDevtoolsBridgeRuntime(host),
}: {
  host?: object
  createRuntime?: () => FormDevtoolsBridgeRuntime
} = {}): FormDevtoolsBridgeRuntime {
  const runtimeHost = getRuntimeHost(host)
  const existingRuntime = runtimeHost[formDevtoolsBridgeRuntimeKey]
  if (existingRuntime) return existingRuntime

  const runtime = createRuntime()
  runtimeHost[formDevtoolsBridgeRuntimeKey] = runtime
  return runtime
}

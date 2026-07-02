import type { AnyInternalFormApi } from './FormApi/FormApi.lib'

export interface FormDevtoolsBridge {
  mountForm?: (form: AnyInternalFormApi) => void
  unmountForm?: (form: AnyInternalFormApi) => void
  updateForm?: (form: AnyInternalFormApi) => void
}

let activeBridge: FormDevtoolsBridge | null = null

export function installDevtoolsBridge(
  bridge: FormDevtoolsBridge,
): () => void {
  activeBridge = bridge

  let didUninstall = false

  return () => {
    if (didUninstall) return
    didUninstall = true

    if (activeBridge !== bridge) return

    activeBridge = null
  }
}

export function getDevtoolsBridge(): FormDevtoolsBridge | null {
  return activeBridge
}

export const devtools = {
  getBridge: getDevtoolsBridge,
  installBridge: installDevtoolsBridge,
}

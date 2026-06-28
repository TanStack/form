import type { AnyInternalFieldApi } from './FieldApi/FieldApi.lib'
import type { AnyInternalFormApi } from './FormApi/FormApi.lib'

export type FormDevtoolsCleanupReason = 'form-unmounted' | 'bridge-uninstalled'

export type FormDevtoolsCleanup = (reason: FormDevtoolsCleanupReason) => void

export interface FieldLifecycleReference {
  previousPath: string
  field: AnyInternalFieldApi
}

export interface FieldStateChangeScope {
  summary?: boolean
  detail?: boolean
}

export interface FormDevtoolsBridge {
  mountForm: (form: AnyInternalFormApi) => FormDevtoolsCleanup | void
  fieldMounted?: (field: AnyInternalFieldApi) => void
  fieldUnmounted?: (field: AnyInternalFieldApi, path?: string) => void
  fieldSubtreeUnmounted?: (
    form: AnyInternalFormApi,
    fields: ReadonlyArray<FieldLifecycleReference>,
  ) => void
  fieldPathsChanged?: (
    form: AnyInternalFormApi,
    changes: ReadonlyArray<FieldLifecycleReference>,
  ) => void
  fieldStateChanged?: (
    field: AnyInternalFieldApi,
    scope: FieldStateChangeScope,
  ) => void
}

interface MountedFormState {
  mountCount: number
  cleanup: FormDevtoolsCleanup | null
}

let activeBridge: FormDevtoolsBridge | null = null
const mountedForms = new Map<AnyInternalFormApi, MountedFormState>()

function mountBridgeForm(form: AnyInternalFormApi): void {
  const state = mountedForms.get(form)
  if (!state || state.cleanup || !activeBridge) return

  state.cleanup = activeBridge.mountForm(form) ?? null
}

function cleanupBridgeForm(
  form: AnyInternalFormApi,
  reason: FormDevtoolsCleanupReason,
): void {
  const state = mountedForms.get(form)
  if (!state?.cleanup) return

  state.cleanup(reason)
  state.cleanup = null
}

function installBridge(bridge: FormDevtoolsBridge): () => void {
  if (activeBridge) {
    for (const form of mountedForms.keys()) {
      cleanupBridgeForm(form, 'bridge-uninstalled')
    }
  }

  activeBridge = bridge

  for (const form of mountedForms.keys()) {
    mountBridgeForm(form)
  }

  return () => {
    if (activeBridge !== bridge) return

    for (const form of mountedForms.keys()) {
      cleanupBridgeForm(form, 'bridge-uninstalled')
    }

    activeBridge = null
  }
}

function onFormMount(form: AnyInternalFormApi): void {
  const state = mountedForms.get(form)

  if (state) {
    state.mountCount++
    return
  }

  mountedForms.set(form, {
    mountCount: 1,
    cleanup: null,
  })
  mountBridgeForm(form)
}

function onFormUnmount(form: AnyInternalFormApi): void {
  const state = mountedForms.get(form)
  if (!state) return

  state.mountCount = Math.max(0, state.mountCount - 1)
  if (state.mountCount > 0) return

  cleanupBridgeForm(form, 'form-unmounted')
  mountedForms.delete(form)
}

function onFieldMount(field: AnyInternalFieldApi): void {
  activeBridge?.fieldMounted?.(field)
}

function onFieldUnmount(field: AnyInternalFieldApi, path?: string): void {
  activeBridge?.fieldUnmounted?.(field, path)
}

function onFieldSubtreeUnmount(
  form: AnyInternalFormApi,
  fields: ReadonlyArray<FieldLifecycleReference>,
): void {
  activeBridge?.fieldSubtreeUnmounted?.(form, fields)
}

function onFieldPathChange(
  form: AnyInternalFormApi,
  changes: ReadonlyArray<FieldLifecycleReference>,
): void {
  activeBridge?.fieldPathsChanged?.(form, changes)
}

function onFieldStateChange(
  field: AnyInternalFieldApi,
  scope: FieldStateChangeScope,
): void {
  activeBridge?.fieldStateChanged?.(field, scope)
}

export const devtools = {
  installBridge,
  onFormMount,
  onFormUnmount,
  onFieldMount,
  onFieldUnmount,
  onFieldSubtreeUnmount,
  onFieldPathChange,
  onFieldStateChange,
} as const

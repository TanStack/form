import { createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { devtools } from '@tanstack/form-core/internals'
import { createFormDevtoolsBridge } from '../devtoolsBridge.lib'
import { emitFormEvent, onFormEvent } from '../eventClient.lib'
import { getDevtoolsFormKey } from './eventClientTypes'
import type { DevtoolsFormState } from './eventClientTypes'

export function createFormEventClientStore() {
  const [store, setStore] = createSignal<Array<DevtoolsFormState>>([])
  const [activeFormKey, setActiveFormKey] = createSignal<string | null>(null)

  const selectForm = (formKey: string | null) => {
    if (
      formKey === null ||
      store().some((item) => getDevtoolsFormKey(item) === formKey)
    ) {
      setActiveFormKey(formKey)
    }
  }

  const activeForm = createMemo(() => {
    const formKey = activeFormKey()
    if (formKey === null) return undefined

    return store().find((item) => getDevtoolsFormKey(item) === formKey)
  })

  onMount(() => {
    const unsubRegistered = onFormEvent('form-registered', (e) => {
      const formKey = getDevtoolsFormKey(e.payload)
      const existing = store().some(
        (item) => getDevtoolsFormKey(item) === formKey,
      )

      if (!existing) {
        setStore((forms) => [
          ...forms,
          {
            id: e.payload.id,
            instanceId: e.payload.instanceId,
          },
        ])
      }

      if (activeFormKey() === null) {
        setActiveFormKey(formKey)
      }
    })

    const unsubUnregistered = onFormEvent('form-unregistered', (e) => {
      const formKey = getDevtoolsFormKey(e.payload)
      const remainingForms = store().filter(
        (item) => getDevtoolsFormKey(item) !== formKey,
      )

      setStore(remainingForms)

      if (activeFormKey() === formKey) {
        setActiveFormKey(
          remainingForms[0] ? getDevtoolsFormKey(remainingForms[0]) : null,
        )
      }
    })

    const uninstallBridge = devtools.installBridge(createFormDevtoolsBridge())

    emitFormEvent('subscribe-form-registry', {})

    onCleanup(() => {
      uninstallBridge()
      unsubRegistered()
      unsubUnregistered()
    })
  })

  return {
    activeForm,
    activeFormKey,
    selectForm,
    store,
  }
}

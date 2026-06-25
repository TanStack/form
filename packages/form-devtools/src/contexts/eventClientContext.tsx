import { createContext, onCleanup, onMount, useContext } from 'solid-js'
import { devtools } from '@tanstack/form-core/internals'
import { createFormDevtoolsBridge } from '../devtoolsBridge.lib'
import { formEventClient } from '../eventClient.lib'
import type { ParentComponent } from 'solid-js'

type FormEventClient = typeof formEventClient

const FormEventClientContext = createContext<FormEventClient | undefined>(
  undefined,
)

export const FormEventClientProvider: ParentComponent = (props) => {
  let uninstallBridge: (() => void) | undefined

  onMount(() => {
    uninstallBridge = devtools.installBridge(createFormDevtoolsBridge())
  })

  onCleanup(() => {
    uninstallBridge?.()
  })

  return (
    <FormEventClientContext.Provider value={formEventClient}>
      {props.children}
    </FormEventClientContext.Provider>
  )
}

export function useFormEventClient() {
  const context = useContext(FormEventClientContext)

  if (!context) {
    throw new Error(
      'useFormEventClient must be used within a FormEventClientProvider',
    )
  }

  return context
}

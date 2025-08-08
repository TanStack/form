import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
} from 'solid-js'
import { DevtoolsEventClient } from '@tanstack/form-core'

import type { ParentComponent } from 'solid-js'
import type { AnyFormApi } from '@tanstack/form-core'

function useProviderValue() {
  const [busListener, setBusListener] = createSignal<
    | {
        state: AnyFormApi
      }
    | undefined
  >()

  createEffect(() => {
    const cleanup = DevtoolsEventClient.on('form-state', (e) => {
      setBusListener(e.payload)
    })

    onCleanup(() => cleanup())
  })

  return { busListener }
}

export type ContextType = ReturnType<typeof useProviderValue>

const FormEventClientContext = createContext<ContextType | undefined>(undefined)

export const FormEventClientProvider: ParentComponent = (props) => {
  const value = useProviderValue()

  return (
    <FormEventClientContext.Provider value={value}>
      {props.children}
    </FormEventClientContext.Provider>
  )
}

function useFormEventClient() {
  const context = useContext(FormEventClientContext)

  if (context === undefined) {
    throw new Error(
      `useEventClient must be used within a FormEventClientContext`,
    )
  }

  return context
}

export function useBusListenerState() {
  return useFormEventClient().busListener
}

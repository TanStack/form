import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
} from 'solid-js'
import { DevtoolsEventClient } from '@tanstack/form-core'

import type { ParentComponent } from 'solid-js'
import type { AnyFormState } from '@tanstack/form-core'

const updateOrAddToArray = (
  oldArray: Array<{ id: string; state: AnyFormState }>,
  newItem: { id: string; state: AnyFormState },
): Array<{ id: string; state: AnyFormState }> => {
  const index = oldArray.findIndex((item) => item.id === newItem.id)
  if (index !== -1) {
    // Update existing item
    return oldArray.map((item, i) => (i === index ? newItem : item))
  }
  // Add new item
  return [...oldArray, newItem]
}

function useProviderValue() {
  const [formStateArray, setFormStateArray] = createSignal<
    Array<{ id: string; state: AnyFormState }>
  >([])

  createEffect(() => {
    const cleanup = DevtoolsEventClient.on('form-state', (_e) => {
      const e = _e as unknown as {
        type: string
        payload: { id: string; state: AnyFormState }
      }

      setFormStateArray(updateOrAddToArray(formStateArray(), e.payload))
    })

    onCleanup(() => cleanup())
  })

  return { formStateArray }
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

export function useFormStateArray() {
  return useFormEventClient().formStateArray
}

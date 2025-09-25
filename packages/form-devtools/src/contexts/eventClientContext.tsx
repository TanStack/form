import dayjs from 'dayjs'
import { createContext, createEffect, onCleanup, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import { FormEventClient } from '@tanstack/form-core'

import type { ParentComponent } from 'solid-js'
import type {
  AnyFormOptions,
  AnyFormState,
  BroadcastFormSubmissionState,
} from '@tanstack/form-core'
import type { Dayjs } from 'dayjs'

type BroadcastFormSubmissionStateWithoutId =
  BroadcastFormSubmissionState extends infer T
  ? T extends any
  ? Omit<T, 'id'>
  : never
  : never

export type DevtoolsFormState = {
  id: string
  state: AnyFormState
  date: Dayjs
  options: AnyFormOptions
  history: Array<BroadcastFormSubmissionStateWithoutId>
}

type DevtoolsState = {
  formState: Array<DevtoolsFormState>
}

const devtoolsStateInit: DevtoolsState = {
  formState: [],
}

function useProviderValue() {
  const [store, setStore] = createStore<DevtoolsState>(devtoolsStateInit)

  createEffect(() => {
    const formEventClient = new FormEventClient();
    const cleanup = formEventClient.on('form-state-change', (e) => {
      setStore('formState', (prev) => {
        const existing = prev.find((item) => item.id === e.payload.id)

        if (existing) {
          return prev.map((item) =>
            item.id === e.payload.id
              ? {
                ...item,
                state: e.payload.state,
                options: e.payload.options,
                date: dayjs(),
              }
              : item,
          )
        }

        return [
          ...prev,
          {
            id: e.payload.id,
            state: e.payload.state,
            options: e.payload.options,
            date: dayjs(),
            history: [],
          },
        ]
      })
    })

    onCleanup(() => cleanup())
  })

  createEffect(() => {
    const formEventClient = new FormEventClient();
    const cleanup = formEventClient.on('form-submission-state-change', (e) => {
      setStore('formState', (prev) =>
        prev.map((item) => {
          if (item.id !== e.payload.id) return item

          const { id, ...rest } = e.payload
          const newHistory = [rest, ...item.history].slice(0, 5)

          return {
            ...item,
            history: newHistory,
          }
        }),
      )
    })

    onCleanup(() => cleanup())
  })

  createEffect(() => {
    const formEventClient = new FormEventClient();
    const cleanup = formEventClient.on('form-unmounted', (e) => {
      setStore('formState', (prev) =>
        prev.filter((item) => item.id !== e.payload.id),
      )
    })

    onCleanup(() => cleanup())
  })

  return { store }
}

type ContextType = ReturnType<typeof useProviderValue>

const FormEventClientContext = createContext<ContextType | undefined>(undefined)

export const FormEventClientProvider: ParentComponent = (props) => {
  const value = useProviderValue()

  return (
    <FormEventClientContext.Provider value={value}>
      {props.children}
    </FormEventClientContext.Provider>
  )
}

export function useFormEventClient() {
  const context = useContext(FormEventClientContext)

  if (context === undefined) {
    throw new Error(
      `useFormEventClient must be used within a FormEventClientContext`,
    )
  }

  return context
}

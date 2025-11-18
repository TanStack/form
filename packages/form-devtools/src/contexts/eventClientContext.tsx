import dayjs from 'dayjs'
import {
  createContext,
  createEffect,
  createMemo,
  onCleanup,
  useContext,
} from 'solid-js'
import { createStore } from 'solid-js/store'
import { formEventClient } from '@tanstack/form-core'

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

function useProviderValue() {
  const [store, setStore] = createStore<Array<DevtoolsFormState>>([])

  createEffect(() => {
    const cleanup = formEventClient.on('form-api', (e) => {
      const id = e.payload.id
      const existingIndex = store.findIndex((item) => item.id === id)

      if (existingIndex > -1) {
        setStore(existingIndex, {
          state: e.payload.state,
          options: e.payload.options,
          date: dayjs(),
        })
      } else {
        setStore((prev) => [
          ...prev,
          {
            id,
            state: e.payload.state,
            options: e.payload.options,
            date: dayjs(),
            history: [],
          },
        ])
      }
    })

    onCleanup(cleanup)
  })

  createEffect(() => {
    const cleanup = formEventClient.on('form-state', (e) => {
      const id = e.payload.id
      const existingIndex = store.findIndex((item) => item.id === id)

      if (existingIndex > -1) {
        setStore(existingIndex, {
          state: e.payload.state,
          date: dayjs(),
        })
      } else {
        setStore((prev) => [
          ...prev,
          {
            id,
            state: e.payload.state,
            options: {},
            date: dayjs(),
            history: [],
          },
        ])
      }
    })

    onCleanup(cleanup)
  })

  createEffect(() => {
    const cleanup = formEventClient.on('form-submission', (e) => {
      const id = e.payload.id
      const existingIndex = store.findIndex((item) => item.id === id)

      if (existingIndex > -1 && store[existingIndex]) {
        const { id: _, ...rest } = e.payload
        const newHistory = [rest, ...store[existingIndex].history].slice(0, 5)
        setStore(existingIndex, 'history', newHistory)
      }
    })

    onCleanup(cleanup)
  })

  createEffect(() => {
    const cleanup = formEventClient.on('form-unmounted', (e) => {
      setStore((prev) => prev.filter((item) => item.id !== e.payload.id))
    })

    onCleanup(cleanup)
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

  const memoContext = createMemo(() => context.store)
  return { store: memoContext }
}

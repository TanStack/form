import { createContext, onCleanup, onMount, useContext } from 'solid-js'
import {
  createFieldListComputations,
  fieldListCache,
  getFieldSummary,
  mountFieldListEvents,
} from './fieldListStore'
import { createFieldDetailsStore } from './fieldDetailsStore'
import {
  createFormSelectorComputations,
  formSelectorCache,
  mountFormSelectorEvents,
} from './formSelectorStore'
import type { JSX } from 'solid-js'

export function createFormDevtoolsStore() {
  const formSelector = {
    ...formSelectorCache,
    ...createFormSelectorComputations(),
    mountEvents: mountFormSelectorEvents,
  }
  const fieldList = {
    ...fieldListCache,
    ...createFieldListComputations(),
    mountEvents: () => mountFieldListEvents(formSelector.selectedForm),
  }
  const fieldMeta = {
    getFieldSummary,
  }
  const fieldDetails = createFieldDetailsStore(fieldList.subscribedFormId, () =>
    fieldList.mainPanelFieldRows().map((field) => field.fieldId),
  )

  return { formSelector, fieldList, fieldMeta, fieldDetails }
}

export type FormDevtoolsStore = ReturnType<typeof createFormDevtoolsStore>

const FormDevtoolsStoreContext = createContext<FormDevtoolsStore>()

export function FormDevtoolsStoreProvider(props: { children?: JSX.Element }) {
  const store = createFormDevtoolsStore()

  onMount(() => {
    const cleanupFormSelectorEvents = store.formSelector.mountEvents()
    const cleanupFieldListEvents = store.fieldList.mountEvents()
    const cleanupFieldDetailEvents = store.fieldDetails.mountEvents()

    onCleanup(() => {
      cleanupFieldDetailEvents()
      cleanupFormSelectorEvents()
      cleanupFieldListEvents()
    })
  })

  return (
    <FormDevtoolsStoreContext.Provider value={store}>
      {props.children}
    </FormDevtoolsStoreContext.Provider>
  )
}

export function useFormDevtoolsStore(): FormDevtoolsStore {
  const store = useContext(FormDevtoolsStoreContext)

  if (!store) {
    throw new Error(
      'useFormDevtoolsStore must be used within a FormDevtoolsStoreProvider',
    )
  }

  return store
}

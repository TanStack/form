import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  useContext,
} from 'solid-js'
import {
  emitFormDevtoolsEvent,
  onFormDevtoolsEvent,
} from '../eventClient.lib'
import type { DevtoolsMountedForm } from '../eventClientTypes'
import type { Accessor, ParentComponent } from 'solid-js'

export interface FormSelectorContextValue {
  mountedForms: Accessor<Array<DevtoolsMountedForm>>
  selectedForm: Accessor<DevtoolsMountedForm | null>
  selectedFormInstanceId: Accessor<string | null>
  setSelectedForm: (instanceId: string | null) => void
}

const FormSelectorContext = createContext<
  FormSelectorContextValue | undefined
>(undefined)

function createFormSelectorStore(): FormSelectorContextValue {
  const [mountedForms, setMountedForms] = createSignal<
    Array<DevtoolsMountedForm>
  >([])
  const [selectedFormInstanceId, setSelectedFormInstanceId] = createSignal<
    string | null
  >(null)

  const selectedForm = createMemo(() => {
    const instanceId = selectedFormInstanceId()
    if (instanceId === null) return null

    return (
      mountedForms().find((form) => form.instanceId === instanceId) ?? null
    )
  })

  const setSelectedForm = (instanceId: string | null) => {
    if (instanceId === null) {
      setSelectedFormInstanceId(null)
      return
    }

    if (!mountedForms().some((form) => form.instanceId === instanceId)) {
      return
    }

    setSelectedFormInstanceId(instanceId)
  }

  onMount(() => {
    const unsubscribeMountedForms = onFormDevtoolsEvent(
      'mounted-forms-changed',
      (event) => {
        setMountedForms(event.payload.forms)
      },
    )

    emitFormDevtoolsEvent('request-mounted-forms', {})

    onCleanup(() => {
      unsubscribeMountedForms()
    })
  })

  createEffect(() => {
    const forms = mountedForms()
    const selectedInstanceId = selectedFormInstanceId()

    if (forms.length === 0) {
      if (selectedInstanceId !== null) {
        setSelectedFormInstanceId(null)
      }
      return
    }

    if (
      selectedInstanceId === null ||
      !forms.some((form) => form.instanceId === selectedInstanceId)
    ) {
      setSelectedFormInstanceId(forms[0]!.instanceId)
    }
  })

  return {
    mountedForms,
    selectedForm,
    selectedFormInstanceId,
    setSelectedForm,
  }
}

export const FormSelectorProvider: ParentComponent = (props) => {
  const value = createFormSelectorStore()

  return (
    <FormSelectorContext.Provider value={value}>
      {props.children}
    </FormSelectorContext.Provider>
  )
}

export function useFormSelector(): FormSelectorContextValue {
  const context = useContext(FormSelectorContext)

  if (!context) {
    throw new Error('useFormSelector must be used within FormSelectorProvider')
  }

  return context
}

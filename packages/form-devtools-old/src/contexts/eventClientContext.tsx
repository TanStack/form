import { createContext, useContext } from 'solid-js'
import { createFormEventClientStore } from '../stores/eventClientStore'
import type { ParentComponent } from 'solid-js'

type FormEventClient = ReturnType<typeof createFormEventClientStore>

const FormEventClientContext = createContext<FormEventClient | undefined>(
  undefined,
)

export const FormEventClientProvider: ParentComponent = (props) => {
  const value = createFormEventClientStore()

  return (
    <FormEventClientContext.Provider value={value}>
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

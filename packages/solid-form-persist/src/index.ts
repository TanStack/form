import { PersisterAPI, createFormPersister } from '@tanstack/form-persist-core'
import { createContext, useContext } from 'solid-js'
import type { CreateFormPersisterOptions } from '@tanstack/form-persist-core'

export { PersisterAPI }

const persisterApiContext = createContext<PersisterAPI | null>(null)

export const FormPersisterProvider = persisterApiContext.Provider

export function useFormPersister<TFormData>(
  opts: CreateFormPersisterOptions<TFormData> & { formKey: string },
) {
  const persisterApi = useContext(persisterApiContext)
  if (!persisterApi) throw new Error('No persisterAPI found')
  const persister = createFormPersister(persisterApi, opts.formKey, opts)
  return persister
}

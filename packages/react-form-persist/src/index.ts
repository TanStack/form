import { PersisterAPI, createFormPersister } from '@tanstack/form-persist-core'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { CreateFormPersisterOptions } from '@tanstack/form-persist-core'

export { PersisterAPI }

const persisterApiContext = createContext<PersisterAPI>(null!)

export const FormPersisterProvider = persisterApiContext.Provider

export function useFormPersister<TFormData>(
  opts: CreateFormPersisterOptions<TFormData> & { formKey: string },
) {
  const persisterApi = useContext(persisterApiContext)
  if (!persisterApi) throw new Error('No persisterAPI found')
  const [persister] = useState(() =>
    createFormPersister(persisterApi, opts.formKey, opts),
  )
  return persister
}

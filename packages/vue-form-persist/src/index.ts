import { PersisterAPI, createFormPersister } from '@tanstack/form-persist-core'
import { inject, provide } from 'vue'
import type { CreateFormPersisterOptions } from '@tanstack/form-persist-core'

export { PersisterAPI }

const persisterApiContext = Symbol('PersisterContext')
//createContext<PersisterAPI | null>(null)

export function provideFormPersisterContext(api: PersisterAPI) {
  provide(persisterApiContext, api)
}

export function useFormPersister<TFormData>(
  opts: CreateFormPersisterOptions<TFormData> & { formKey: string },
) {
  const persisterApi = inject<PersisterAPI>(persisterApiContext)
  if (!persisterApi) throw new Error('No persisterAPI found')
  const persister = createFormPersister(persisterApi, opts.formKey, opts)
  return persister
}

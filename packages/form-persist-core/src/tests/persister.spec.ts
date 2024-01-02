import { FormApi } from '@tanstack/form-core'
import { createPersister } from '..'
import type { StoragePersisterOptions } from '..'
import { sleep } from './utils'

const mapHolder: Record<string, Map<string, string>> = {}
const getPersister = <TFormData>(
  idKey: string,
  opts?: Omit<StoragePersisterOptions, 'storage'>,
) => {
  const persistMap = mapHolder[idKey] || new Map<string, string>()
  mapHolder[idKey] = persistMap
  return createPersister<TFormData>({
    storage: {
      getItem(key) {
        return persistMap.get(key)
      },
      setItem(key, val) {
        console.log('setting: ', key, val)
        return persistMap.set(key, val)
      },
      removeItem(key) {
        persistMap.delete(key)
      },
    },
    ...opts,
  })
}

const getFormApiPersister = <TFormData>(id: string, formKey: string) => {
  const persister = getPersister<TFormData>(id)
  return {
    persistForm: persister.persistForm.bind(null, formKey),
    deleteForm: persister.deleteForm.bind(null, formKey),
    restoreForm: persister.restoreForm.bind(null, formKey),
  }
}

let id_ = 0
const getId = () => `id-${id_++}`
const getKey = () => `key-${id_++}`

describe('persister', () => {
  it('should persist state manually', async () => {
    const id = getId()
    const persister = getPersister(id)
    const formApi = new FormApi({ defaultValues: { hi: 'there' } })
    await persister.persistForm(id, formApi.state)
    const persistedForm = await persister.restoreForm(id)
    expect(persistedForm).toEqual(formApi.state)
  })

  it('should persist with new persister', async () => {
    const id = getId()
    let persister = getPersister(id, { buster: 'hi' })
    const formApi = new FormApi({ defaultValues: { hi: 'there' } })
    await persister.persistForm(id, formApi.state)
    persister = getPersister(id, { buster: 'hi' })
    const persistedForm = await persister.restoreForm(id)
    expect(persistedForm).toEqual(formApi.state)
  })

  it('should delete when busted', async () => {
    const id = getId()
    let persister = getPersister(id, { buster: 'hi' })
    const formApi = new FormApi({ defaultValues: { hi: 'there' } })
    await persister.persistForm(id, formApi.state)
    persister = getPersister(id, { buster: 'bye' })
    const persistedForm = await persister.restoreForm(id)
    expect(persistedForm).toEqual(undefined)
  })

  it('should persist automatically', async () => {
    const formKey = getKey(),
      id = getId()
    const getFormApi = () =>
      new FormApi({
        defaultValues: { hi: 'there' },
        persister: getFormApiPersister<{ hi: string }>(id, formKey),
      })
    let formApi = getFormApi()
    const oldState = structuredClone(formApi.state)
    formApi.setFieldValue('hi', 'bye')
    await sleep(10)
    formApi = getFormApi()
    await sleep(10)
    console.log('old', oldState), console.log('new', formApi.state)
    expect(formApi.state).toEqual(oldState)
  })
})

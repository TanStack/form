import { FormApi } from '@tanstack/form-core'
import { PersisterAPI, createFormPersister } from '..'
import { sleep } from './utils'

import type { StoragePersisterOptions } from '..'

const mapHolder: Record<string, Map<string, string>> = {}
const getPersister = (
  idKey: string,
  opts?: Omit<StoragePersisterOptions, 'storage'>,
) => {
  const persistMap = mapHolder[idKey] || new Map<string, string>()
  mapHolder[idKey] = persistMap
  return new PersisterAPI({
    storage: {
      getItem(key) {
        return persistMap.get(key)
      },
      setItem(key, val) {
        // console.log('setting', key, JSON.parse(val).state.values)
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
  const persister = getPersister(id)
  return createFormPersister<TFormData>(persister, formKey)
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
    expect(persistedForm).toEqual({ ...formApi.state, isRestored: true })
  })

  it('should persist with new persister', async () => {
    const id = getId()
    let persister = getPersister(id, { buster: 'hi' })
    const formApi = new FormApi({ defaultValues: { hi: 'there' } })
    await persister.persistForm(id, formApi.state)
    persister = getPersister(id, { buster: 'hi' })
    const persistedForm = await persister.restoreForm(id)
    expect(persistedForm).toEqual({ ...formApi.state, isRestored: true })
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
    await formApi.restorePromise
    expect(formApi.state).toEqual({
      ...oldState,
      values: { hi: 'bye' },
      isRestored: true,
    })
  })
})

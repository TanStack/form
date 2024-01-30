import type { FormState, MaybePromise, Persister } from '@tanstack/form-core'

export type SyncFormStorage<TStorageValue = string> = {
  getItem: (key: string) => TStorageValue | undefined | null
  setItem: (key: string, value: TStorageValue) => unknown
  removeItem: (key: string) => void
}
export type AsyncFormStorage<TStorageValue = string> = {
  [Method in keyof SyncFormStorage<TStorageValue>]: (
    ...args: Parameters<SyncFormStorage<TStorageValue>[Method]>
  ) => Promise<ReturnType<SyncFormStorage<TStorageValue>[Method]>>
}

type PersistedFormState = {
  buster: string
  state: FormState<any>
}

export interface StoragePersisterOptions<TStorageValue = string> {
  /** The storage client used for setting and retrieving items from cache.
   * For SSR pass in `undefined`.
   */
  storage:
    | AsyncFormStorage<TStorageValue>
    | SyncFormStorage<TStorageValue>
    | undefined
    | null
  /**
   * A unique string that can be used to forcefully invalidate existing caches,
   * if they do not share the same buster string
   */
  buster?: string
  /**
   * The max-allowed age of the cache in milliseconds.
   * If a persisted cache is found that is older than this
   * time, it will be discarded
   * @default 24 hours
   */
  maxAge?: number
  /**
   * Prefix to be used for storage key.
   * Storage key is a combination of prefix and persistKey in a form of `prefix-persistKey`.
   * @default 'tanstack-form'
   */
  prefix?: string
  /**
   * How to serialize the data to storage.
   * @default `JSON.stringify`
   */
  serializer?: (
    persistedForm: PersistedFormState,
  ) => MaybePromise<TStorageValue>
  /**
   * How to deserialize the data from storage.
   * @default `JSON.parse`
   */
  deserializer?: (
    cachedValue: TStorageValue,
  ) => MaybePromise<PersistedFormState>
}

const makeKey = (prefix: string = 'tanstack-form', persistKey: string) =>
  `${prefix}-${persistKey}`

export class PersisterAPI<TFormData, TStorageValue = string> {
  options: StoragePersisterOptions<TStorageValue>
  constructor(opts: StoragePersisterOptions<TStorageValue>) {
    this.options = opts
  }

  persistForm = async (persistKey: string, formState: FormState<TFormData>) => {
    const serialized = await (this.options.serializer ?? JSON.stringify)({
      buster: this.options.buster ?? '',
      state: formState,
    })
    await this.options.storage?.setItem(
      makeKey(this.options.prefix, persistKey),
      serialized as TStorageValue,
    )
  }
  restoreForm = async (persistKey: string) => {
    const persistedValue =
      (await this.options.storage?.getItem(
        makeKey(this.options.prefix, persistKey),
      )) ?? 'null'
    const state = (
      this.options.deserializer ??
      (JSON.parse as Required<
        StoragePersisterOptions<TStorageValue>
      >['deserializer'])
    )(persistedValue as TStorageValue) as {
      buster: string
      state: FormState<TFormData>
    } | null
    if (!state || state.buster !== (this.options.buster ?? '')) {
      this.deleteForm(persistKey)
      return
    }
    state.state.isRestored = true
    state.state.isRestoring = false
    // ensures that this object is not empty (JSON.parse('{hi: undefined}') => {})
    state.state.validationMetaMap = {
      onChange: state.state.validationMetaMap.onChange,
      onBlur: state.state.validationMetaMap.onBlur,
      onSubmit: state.state.validationMetaMap.onSubmit,
      onMount: state.state.validationMetaMap.onMount,
      onServer: state.state.validationMetaMap.onServer,
    }
    return state.state
  }

  deleteForm = (persistKey: string) => {
    return this.options.storage?.removeItem(
      makeKey(this.options.prefix, persistKey),
    )
  }
}

type CreateFormPersisterOptions<TFormData> = {
  omitFields: (keyof TFormData)[] | ((fieldName: keyof TFormData) => boolean)
}

export function createFormPersister<TFormData, TStorageValue = string>(
  persisterAPI: PersisterAPI<TFormData, TStorageValue>,
  formKey: string,
  opts?: CreateFormPersisterOptions<TFormData>,
): Persister<TFormData> {
  return {
    deleteForm: () => persisterAPI.deleteForm(formKey),
    restoreForm: () => persisterAPI.restoreForm(formKey),
    persistForm: (state: FormState<TFormData>) => {
      // this makes ts happy when we modify the state
      const modifiedState: Omit<typeof state, 'fieldMeta' | 'values'> & {
        fieldMeta: any
        values: any
      } = structuredClone(state) // deep cloning to make sure we dont modify state that is referenced inside the form
      if (typeof opts?.omitFields === 'function') {
        for (const key of Object.keys(modifiedState.values))
          if (opts.omitFields(key as keyof TFormData)) {
            delete modifiedState.fieldMeta[key]
            delete modifiedState.values[key]
          }
      } else if (typeof opts?.omitFields === 'object') {
        for (const key of opts.omitFields) delete modifiedState.fieldMeta[key]
      }
      return persisterAPI.persistForm(formKey, modifiedState)
    },
  }
}

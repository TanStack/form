import type { FormState, Persister } from '@tanstack/form-core'

export type SyncFormStorage = {
  getItem: (key: string) => string | undefined | null
  setItem: (key: string, value: string) => unknown
  removeItem: (key: string) => void
}
export type AsyncFormStorage = {
  [Method in keyof SyncFormStorage]: (
    ...args: Parameters<SyncFormStorage[Method]>
  ) => Promise<ReturnType<SyncFormStorage[Method]>>
}

export interface StoragePersisterOptions {
  /** The storage client used for setting and retrieving items from cache.
   * For SSR pass in `undefined`.
   */
  storage: AsyncFormStorage | SyncFormStorage | undefined | null
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
}

type AddKeyStringArgument<T extends Record<string, (...args: any[]) => any>> = {
  [Key in keyof T]: (
    keyString: string,
    ...args: Parameters<T[Key]>
  ) => ReturnType<T[Key]>
}

const makeKey = (prefix: string = 'tanstack-form', persistKey: string) =>
  `${prefix}-${persistKey}`

export function createPersister<TFormData>(
  options: StoragePersisterOptions,
): AddKeyStringArgument<Persister<TFormData>> {
  const deleteForm = (persistKey: string) => {
    return options.storage?.removeItem(makeKey(options.prefix, persistKey))
  }
  return {
    async persistForm(persistKey, formState) {
      await options.storage?.setItem(
        makeKey(options.prefix, persistKey),
        JSON.stringify({
          buster: options.buster ?? '',
          state: formState,
        }),
      )
    },
    async restoreForm(persistKey) {
      const deserialized =
        (await options.storage?.getItem(makeKey(options.prefix, persistKey))) ??
        'null'
      const state = JSON.parse(deserialized) as {
        buster: string
        state: FormState<TFormData>
      } | null
      if (!state || state.buster !== (options.buster ?? '')) {
        deleteForm(persistKey)
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
    },
    deleteForm,
  }
}

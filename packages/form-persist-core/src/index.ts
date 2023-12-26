import type { Persister } from '@tanstack/form-core'

export type MaybePromise<T> = T | Promise<T>

export interface AsyncStorage {
  getItem: (key: string) => MaybePromise<string | undefined | null>
  setItem: (key: string, value: string) => MaybePromise<unknown>
  removeItem: (key: string) => MaybePromise<void>
}

export interface StoragePersisterOptions {
  /** The storage client used for setting and retrieving items from cache.
   * For SSR pass in `undefined`.
   */
  storage: AsyncStorage | undefined | null
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

export function createPersister(
  options: StoragePersisterOptions,
): AddKeyStringArgument<Persister<unknown>> {
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
      return JSON.parse(deserialized)
    },
    deleteForm(persistKey) {
      return options.storage?.removeItem(makeKey(options.prefix, persistKey))
    },
  }
}

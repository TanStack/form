import { trackStore } from './track-store.ts'

import type { ReadableStore } from './track-store.ts'

interface Api {
  store: ReadableStore<object>
}

const sources = new WeakMap<object, object>()

/**
 * Returns an object that inherits from `api` and has an autotracked `state`.
 *
 * `api` itself does not change.
 * form-core binds its methods to `api`,
 * so the reads that form-core does stay out of autotracking.
 * A render then depends only on the state that the template reads.
 */
export function withTrackedState<
  TApi extends Api,
  TExtensions extends object = object,
>(api: TApi, parent: object, extensions?: TExtensions): TApi & TExtensions {
  const tracked = Object.create(api, {
    state: { value: trackStore(api.store, parent), enumerable: true },
  }) as TApi

  sources.set(tracked, api)

  return Object.assign(tracked, extensions)
}

/**
 * Returns the form-core object behind the result of `withTrackedState`.
 * Any other object returns unchanged.
 */
export function sourceOf<TApi extends object>(api: TApi): TApi {
  return (sources.get(api) as TApi | undefined) ?? api
}

/**
 * True if `api.state` is autotracked.
 */
export function hasTrackedState(api: object): boolean {
  return sources.has(api)
}

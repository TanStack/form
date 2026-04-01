import { useStore as usePreactStore } from '@tanstack/preact-store'

export type NoInfer<T> = [T][T extends any ? 0 : never]

type EqualityFn<T> = (objA: T, objB: T) => boolean

interface UseStoreOptions<T> {
  equal?: EqualityFn<T>
}

type StoreLike<TState> = {
  subscribe: (
    listener: (...args: Array<unknown>) => void,
  ) => { unsubscribe: () => void } | (() => void)
  readonly state: TState
}

function bridgeStore<TState>(store: StoreLike<TState>) {
  return {
    get state() {
      return store.state
    },
    // @tanstack/preact-store currently calls subscribe unbound.
    subscribe: (listener: () => void) => {
      const subscription = store.subscribe(listener)

      return typeof subscription === 'function'
        ? subscription
        : () => subscription.unsubscribe()
    },
  }
}

export function useStore<TState, TSelected = NoInfer<TState>>(
  store: StoreLike<TState>,
  selector?: (state: NoInfer<TState>) => TSelected,
  options?: UseStoreOptions<TSelected>,
): TSelected {
  return usePreactStore(
    bridgeStore(store) as never,
    selector as never,
    options as never,
  ) as TSelected
}

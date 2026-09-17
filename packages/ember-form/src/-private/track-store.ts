import { trackedObject } from '@ember/reactive/collections'
import { isDestroying, registerDestructor } from '@ember/destroyable'

interface ReadableStore<TState extends object> {
  state: TState
  subscribe: (listener: () => void) => { unsubscribe: () => void }
}

type Keyed = Record<string | symbol, unknown>

/**
 * Returns a view of `store.state` that autotracking can observe per key.
 *
 * A read returns the live value, never a copy,
 * so the value cannot lag behind the store.
 *
 * `trackedObject` compares with `Object.is`,
 * so a key that keeps its value does not invalidate its readers.
 *
 * The subscription ends when `parent` is destroyed.
 */
export function trackStore<TState extends object>(
  store: ReadableStore<TState>,
  parent: object,
): TState {
  const tags = trackedObject({ ...store.state }) as Keyed

  let isScheduled = false

  function notify() {
    isScheduled = false

    if (isDestroying(parent)) return

    const state = store.state as Keyed

    for (const key of Reflect.ownKeys(state)) {
      tags[key] = state[key]
    }
  }

  /**
   * form-core writes to its stores during a render:
   * - when a field mounts
   * - when `update` applies a new default value
   *
   * Autotracking throws if a value changes after the same render read it,
   * so the notification waits for the render to finish.
   */
  const { unsubscribe } = store.subscribe(() => {
    if (isScheduled) return

    isScheduled = true
    queueMicrotask(notify)
  })

  registerDestructor(parent, unsubscribe)

  const view = {}

  // form-core never adds or removes a state key, so the first keys are all the keys.
  for (const key of Reflect.ownKeys(store.state)) {
    Object.defineProperty(view, key, {
      enumerable: true,
      get() {
        void tags[key]

        return (store.state as Keyed)[key]
      },
    })
  }

  return view as TState
}

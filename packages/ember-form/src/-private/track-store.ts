import { trackedObject } from '@ember/reactive/collections'
import { isDestroying, registerDestructor } from '@ember/destroyable'

export interface ReadableStore<TState extends object> {
  state: TState
  subscribe: (listener: () => void) => { unsubscribe: () => void }
}

type Keyed = Record<PropertyKey, unknown>

/**
 * Returns a view of `store.state` that autotracking can observe per key.
 *
 * A read returns the live value, never a copy,
 * so the value cannot lag behind the store.
 *
 * A key invalidates its readers only when a reader holds an old value.
 * A reader that ran after the write has the new value already,
 * so a write before the first read causes no second render.
 *
 * The subscription ends when `parent` is destroyed.
 */
export function trackStore<TState extends object>(
  store: ReadableStore<TState>,
  parent: object,
): TState {
  /**
   * Holds one tag per key, and no values.
   * An assignment must always invalidate, so no two values are equal.
   */
  const tags = trackedObject<Keyed>({}, { equals: () => false })

  /**
   * The value that the readers of each key received.
   */
  const seen = new Map<PropertyKey, unknown>()

  /**
   * The keys that gave different values to different readers.
   */
  const mixed = new Set<PropertyKey>()

  let isScheduled = false

  function notify() {
    isScheduled = false

    if (isDestroying(parent)) return

    const state = store.state as Keyed

    for (const [key, value] of seen) {
      if (mixed.has(key) || !Object.is(value, state[key])) {
        seen.delete(key)
        tags[key] = undefined
      }
    }

    mixed.clear()
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
        const value = (store.state as Keyed)[key]

        void tags[key]

        if (!seen.has(key)) {
          seen.set(key, value)
        } else if (!Object.is(seen.get(key), value)) {
          mixed.add(key)
        }

        return value
      },
    })
  }

  return view as TState
}

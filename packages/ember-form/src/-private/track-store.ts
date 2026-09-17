import { trackedObject } from '@ember/reactive/collections'
import { isDestroying, registerDestructor } from '@ember/destroyable'

interface ReadableStore<TState> {
  state: TState
  subscribe: (listener: () => void) => { unsubscribe: () => void }
}

/**
 * Returns a reader for `store.state` that autotracking can observe.
 *
 * The reader returns the live state, never a copy,
 * so the value cannot lag behind the store.
 *
 * The subscription ends when `parent` is destroyed.
 */
export function trackStore<TState>(
  store: ReadableStore<TState>,
  parent: object,
): () => TState {
  const tag = trackedObject({ version: 0 })

  // A plain counter keeps `notify` from reading the tag that it dirties.
  let version = 0
  let isScheduled = false

  function notify() {
    isScheduled = false

    if (isDestroying(parent)) return

    tag.version = ++version
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

  return () => {
    void tag.version

    return store.state
  }
}

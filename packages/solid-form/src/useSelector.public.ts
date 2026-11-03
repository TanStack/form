import { createSignal, onCleanup } from 'solid-js'
import type { Accessor } from 'solid-js'

interface SelectionSource<T> {
  get: () => T
  subscribe: (listener: (value: T) => void) => {
    unsubscribe: () => void
  }
}

export interface UseSelectorOptions<TSelected> {
  compare?: (a: TSelected, b: TSelected) => boolean
}

/**
 * Selects a slice of a TanStack Store and returns a Solid accessor that
 * updates when the selection changes (by `===` unless `compare` is given).
 * Omit the selector to read the whole state.
 *
 * A Solid 2 copy of `useSelector` from `@tanstack/solid-store`, so this
 * package doesn't depend on a Solid 2 release of that package.
 */
export function useSelector<TSource, TSelected = NoInfer<TSource>>(
  source: SelectionSource<TSource>,
  selector: (snapshot: TSource) => TSelected = (s) => s as unknown as TSelected,
  options?: UseSelectorOptions<TSelected>,
): Accessor<TSelected> {
  const initial = selector(source.get())
  // Solid 2 reads a function passed to `createSignal` as a compute function,
  // so a selected function value is wrapped to stay a plain value.
  const [selected, setSelected] = createSignal<TSelected>(
    (typeof initial === 'function' ? () => initial : initial) as never,
    {
      equals: options?.compare ?? ((a, b) => a === b),
      // Stores notify synchronously from wherever `setState` runs, which can
      // be inside an owned scope such as an effect.
      ownedWrite: true,
    },
  )
  const { unsubscribe } = source.subscribe((snapshot) => {
    setSelected(() => selector(snapshot))
  })
  onCleanup(unsubscribe)
  return selected
}

import { useStore as _useStore } from '@tanstack/react-store'
import type { AnyAtom } from '@tanstack/store'

type AtomSnapshot<TAtom> = TAtom extends { get: () => infer TSnapshot }
  ? TSnapshot
  : undefined

/**
 * Subscribe to a store atom and return its current state.
 *
 * When called without a `selector` the full atom snapshot is returned.
 *
 * @example
 * // Return the full form state (selector optional for back-compat)
 * const formState = useStore(form.store)
 *
 * @example
 * // Return a specific slice
 * const isValid = useStore(form.store, (s) => s.isValid)
 */
export function useStore<TAtom extends AnyAtom | undefined>(
  atom: TAtom,
): AtomSnapshot<TAtom>

export function useStore<TAtom extends AnyAtom | undefined, T>(
  atom: TAtom,
  selector: (snapshot: AtomSnapshot<TAtom>) => T,
  compare?: (a: T, b: T) => boolean,
): T

export function useStore<TAtom extends AnyAtom | undefined, T>(
  atom: TAtom,
  selector?: (snapshot: AtomSnapshot<TAtom>) => T,
  compare?: (a: T, b: T) => boolean,
): T | AtomSnapshot<TAtom> {
  // When no selector is provided fall back to the identity function so that
  // callers that were using `useStore(form.store)` without a selector
  // (as was valid in prior releases) continue to work.
  return _useStore(
    atom,
    (selector ?? ((s: any) => s)) as (snapshot: AtomSnapshot<TAtom>) => T,
    compare,
  )
}

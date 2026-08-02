import { shallow, useSelector } from '@tanstack/solid-store'
import type { JSX } from 'solid-js'
import type {
  Atom,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
} from '@tanstack/solid-store'
import type { FormErrorTypes, FormState } from '@tanstack/form-core'

export type SubscribeSource<TValue> =
  Atom<TValue> | ReadonlyAtom<TValue> | Store<TValue> | ReadonlyStore<TValue>

/**
 * Subscribe to `form.atom` (full form state). The selector receives the full
 * {@link FormState}.
 */
export interface SubscribeProps<TSourceData, TSelected> {
  source: SubscribeSource<TSourceData>
  /**
   * Select from full form state. Re-renders when the selected value changes
   * (shallow compare).
   */
  selector: (state: TSourceData) => TSelected
  children: ((state: TSelected) => JSX.Element) | JSX.Element
}

/**
 * A React component that allows you to subscribe to the form state.
 *
 * This is useful for opting into state re-renders for specific parts of the form state.
 */
export function Subscribe<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TSelected,
>(
  props: SubscribeProps<FormState<TFormData, TFormErrorTypes>, TSelected>,
): JSX.Element {
  const selected = useSelector(
    // Atom and store share the same selection protocol; union args need a widen for TS.
    props.source,
    props.selector as Parameters<typeof useSelector>[1],
    {
      compare: shallow,
    },
  ) as TSelected

  return typeof props.children === 'function'
    ? props.children(selected)
    : props.children
}

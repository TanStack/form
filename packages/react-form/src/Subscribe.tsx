import { shallow, useSelector } from '@tanstack/react-store'
import type { FormState } from '@tanstack/form-core-v2'
import type {
  Atom,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
} from '@tanstack/react-store'
import type { FunctionComponent } from 'react'
import type { CrossVersionReactNode } from './types.lib'

export type SubscribeSource<TValue> =
  | Atom<TValue>
  | ReadonlyAtom<TValue>
  | Store<TValue>
  | ReadonlyStore<TValue>

/**
 * Subscribe to `form.store` (full form state). The selector receives the full
 * {@link FormState}.
 */
export interface SubscribeProps<TSourceData, TSelected> {
  source: SubscribeSource<TSourceData>
  /**
   * Select from full form state. Re-renders when the selected value changes
   * (shallow compare).
   */
  selector: (state: TSourceData) => TSelected
  children:
    | ((state: TSelected) => CrossVersionReactNode)
    | CrossVersionReactNode
}

/**
 * A React component that allows you to subscribe to the form state.
 *
 * This is useful for opting into state re-renders for specific parts of the form state.
 */
export function Subscribe<TFormData, TSelected>(
  props: SubscribeProps<TFormData, TSelected>,
): ReturnType<FunctionComponent> {
  const selected = useSelector(
    // Atom and store share the same selection protocol; union args need a widen for TS.
    props.source,
    props.selector as Parameters<typeof useSelector>[1],
    {
      compare: shallow,
    },
  ) as TSelected

  return typeof props.children === 'function'
    ? (props.children as (state: TSelected) => CrossVersionReactNode)(selected)
    : props.children
}

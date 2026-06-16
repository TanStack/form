import { shallow, useSelector } from '@tanstack/react-store'
import type {
  Atom,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
} from '@tanstack/react-store'
import type { CrossVersionReactNode } from './reactTypes.public'

export type SubscribeSource<TValue> =
  | Atom<TValue>
  | ReadonlyAtom<TValue>
  | Store<TValue>
  | ReadonlyStore<TValue>

/**
 * Subscribe to `form.atom` (full form state). The selector receives the full
 * {@link FormState}.
 */
export interface SubscribeProps<in out TSourceData, in out TSelected> {
  source: SubscribeSource<TSourceData>
  /**
   * Select from full form state. Re-renders when the selected value changes
   * (shallow compare).
   */
  selector: (state: TSourceData) => TSelected
  /**
   * Optional. If provided, the component will only render when the `when` function returns `true`.
   */
  when?: (selected: NoInfer<TSelected>) => boolean
  children:
    | ((state: NoInfer<TSelected>) => CrossVersionReactNode)
    | CrossVersionReactNode
}

/**
 * A React component that allows you to subscribe to source state.
 *
 * This is useful for opting into state re-renders for specific parts of the state.
 */
export function Subscribe<
  TSourceData,
  const TSelected,
>(props: SubscribeProps<TSourceData, TSelected>): CrossVersionReactNode {
  const selected = useSelector(
    // Atom and store share the same selection protocol; union args need a widen for TS.
    props.source,
    props.selector as Parameters<typeof useSelector>[1],
    {
      compare: shallow,
    },
  ) as TSelected

  if (props.when?.(selected) === false) {
    return null
  }
  return typeof props.children === 'function'
    ? props.children(selected)
    : props.children
}

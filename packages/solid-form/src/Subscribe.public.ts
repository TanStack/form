import { shallow, useSelector } from '@tanstack/solid-store'
import { createMemo } from 'solid-js'
import type { Accessor, JSX } from 'solid-js'
import type {
  Atom,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
} from '@tanstack/solid-store'

export type SubscribeSource<TValue> =
  Atom<TValue> | ReadonlyAtom<TValue> | Store<TValue> | ReadonlyStore<TValue>

export interface SubscribeProps<TSourceData, TSelected> {
  source: SubscribeSource<TSourceData>
  selector: (state: TSourceData) => TSelected
  when?: (selected: NoInfer<TSelected>) => boolean
  children: ((state: Accessor<NoInfer<TSelected>>) => JSX.Element) | JSX.Element
}

/** Subscribe to a TanStack Store source and expose the selection as an accessor. */
export function Subscribe<TSourceData, const TSelected>(
  props: SubscribeProps<TSourceData, TSelected>,
): JSX.Element {
  const selected = useSelector(props.source, props.selector, {
    compare: shallow,
  })
  let child: JSX.Element
  let initialized = false

  return createMemo(() => {
    if (props.when?.(selected()) === false) return null
    if (!initialized) {
      const children = props.children
      child = typeof children === 'function' ? children(selected) : children
      initialized = true
    }
    return child
  }) as unknown as JSX.Element
}

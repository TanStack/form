import { shallow } from '@tanstack/store'
import { createMemo, getOwner, runWithOwner, untrack } from 'solid-js'
import { useSelector } from './useSelector.public'
import type { Accessor, Element } from 'solid-js'
import type { Atom, ReadonlyAtom, ReadonlyStore, Store } from '@tanstack/store'

export type SubscribeSource<TValue> =
  Atom<TValue> | ReadonlyAtom<TValue> | Store<TValue> | ReadonlyStore<TValue>

export interface SubscribeProps<TSourceData, TSelected> {
  source: SubscribeSource<TSourceData>
  selector: (state: TSourceData) => TSelected
  when?: (selected: NoInfer<TSelected>) => boolean
  children: ((state: Accessor<NoInfer<TSelected>>) => Element) | Element
}

/** Subscribe to a TanStack Store source and expose the selection as an accessor. */
export function Subscribe<TSourceData, const TSelected>(
  props: SubscribeProps<TSourceData, TSelected>,
): Element {
  // Re-subscribes when `source` or `selector` changes.
  const selection = createMemo(() =>
    useSelector(props.source, props.selector, { compare: shallow }),
  )
  const selected = () => selection()()
  // The children are built once, under the component rather than the memo,
  // so a later re-run of the memo doesn't dispose them.
  const owner = getOwner()
  let child: Element
  let initialized = false

  return createMemo(() => {
    if (props.when?.(selected()) === false) return null
    if (!initialized) {
      const children = props.children
      child =
        typeof children === 'function'
          ? // Rendered like a component body: reads in it warn, as in <Show>.
            runWithOwner(owner, () =>
              untrack(() => children(selected), '<Subscribe>'),
            )
          : children
      initialized = true
    }
    return child
  }) as unknown as Element
}

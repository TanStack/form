import { shallow, useSelector } from '@tanstack/solid-store'
import type { Accessor, JSX } from 'solid-js'
import type { Atom, ReadonlyAtom } from '@tanstack/solid-store'

export type SubscribeSource<TValue> = Atom<TValue> | ReadonlyAtom<TValue>

export interface SubscribeProps<TSourceData, TSelected> {
  source: SubscribeSource<TSourceData>
  selector: (state: TSourceData) => TSelected
  children: JSX.Element | ((state: Accessor<TSelected>) => JSX.Element)
}

export function Subscribe<TSourceData, TSelected>(
  props: SubscribeProps<TSourceData, TSelected>,
): JSX.Element {
  const selected = useSelector(props.source, props.selector, {
    compare: shallow,
  })

  return typeof props.children === 'function'
    ? props.children(selected)
    : props.children
}

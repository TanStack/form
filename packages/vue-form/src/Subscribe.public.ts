import { shallow, useSelector } from '@tanstack/vue-store'
import { defineComponent } from 'vue'
import type {
  Atom,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
} from '@tanstack/vue-store'
import type { VueComponentWithSlots } from './vueTypes.lib'

export type SubscribeSource<TValue> =
  Atom<TValue> | ReadonlyAtom<TValue> | Store<TValue> | ReadonlyStore<TValue>

export interface SubscribeProps<in out TSourceData, in out TSelected> {
  source: SubscribeSource<TSourceData>
  selector: (state: TSourceData) => TSelected
  when?: (selected: NoInfer<TSelected>) => boolean
}

export type SubscribeComponent = new <TSourceData, const TSelected>(
  props: SubscribeProps<TSourceData, TSelected>,
) => InstanceType<
  VueComponentWithSlots<
    SubscribeProps<TSourceData, TSelected>,
    { default: NoInfer<TSelected> }
  >
>

const SubscribeImpl = defineComponent<SubscribeProps<any, any>>(
  (props, { slots }) => {
    const selected = useSelector(props.source, props.selector, {
      compare: shallow,
    })

    return () => {
      if (props.when?.(selected.value) === false) return null
      return slots.default?.(selected.value)
    }
  },
  {
    name: 'TanStackForm.Subscribe',
    props: ['source', 'selector', 'when'],
  },
)

export const Subscribe = SubscribeImpl as never as SubscribeComponent

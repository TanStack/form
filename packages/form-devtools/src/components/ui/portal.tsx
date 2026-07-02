import {
  Show,
  createContext,
  createSignal,
  splitProps,
  useContext,
} from 'solid-js'
import { Portal as SolidPortal } from 'solid-js/web'
import type { Accessor, JSX } from 'solid-js'
import { cn } from '@/utils'

const PortalContext = createContext<Accessor<HTMLElement | undefined>>()

type PortalProviderProps = Omit<JSX.HTMLElementTags['div'], 'ref'>

function PortalProvider(props: PortalProviderProps) {
  const [local, others] = splitProps(props, ['children', 'class'])
  const [portalMount, setPortalMount] = createSignal<HTMLElement>()

  return (
    <PortalContext.Provider value={portalMount}>
      <div
        {...others}
        data-slot="portal-provider"
        class={cn(local.class ?? 'contents')}
        ref={(element) => setPortalMount(element)}
      >
        {local.children}
      </div>
    </PortalContext.Provider>
  )
}

type PortalProps = {
  children?: JSX.Element
  mount?: Node
}

function Portal(props: PortalProps) {
  const contextMount = useContext(PortalContext)
  const mount = () => props.mount ?? contextMount?.()

  return (
    <Show
      when={mount()}
      fallback={
        contextMount ? null : <SolidPortal>{props.children}</SolidPortal>
      }
    >
      {(resolvedMount) => (
        <SolidPortal mount={resolvedMount()}>{props.children}</SolidPortal>
      )}
    </Show>
  )
}

export { Portal, PortalProvider }

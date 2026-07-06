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

/**
 * Provides a local mount element for descendant Portal content.
 *
 * @example
 * ```tsx
 * <PortalProvider>
 *   <Portal>
 *     <div>Portalled content</div>
 *   </Portal>
 * </PortalProvider>
 * ```
 */
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

/**
 * Renders children into the nearest PortalProvider mount, a custom mount, or the
 * document body.
 *
 * @example
 * ```tsx
 * <PortalProvider>
 *   <Portal>
 *     <div>Portalled content</div>
 *   </Portal>
 * </PortalProvider>
 * ```
 */
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

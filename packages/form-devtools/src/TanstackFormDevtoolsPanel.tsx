import { render } from 'solid-js/web'
import { Devtools } from './components'

export interface TanstackFormDevtoolsPanelConfig {}

class TanstackFormDevtoolsPanel {
  #isMounted = false
  #dispose?: () => void

  // constructor(config: TanstackFormDevtoolsPanelConfig) {}
  constructor() {}

  mount<T extends HTMLElement>(el: T) {
    if (this.#isMounted) {
      throw new Error('Devtools is already mounted')
    }
    const dispose = render(() => {
      return <Devtools />
    }, el)
    this.#isMounted = true
    this.#dispose = dispose
  }

  unmount() {
    if (!this.#isMounted) {
      throw new Error('Devtools is not mounted')
    }
    this.#dispose?.()
    this.#isMounted = false
  }
}

export { TanstackFormDevtoolsPanel }

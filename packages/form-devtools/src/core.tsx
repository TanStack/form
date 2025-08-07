import { lazy } from 'solid-js'
import { render } from 'solid-js/web'
import { Devtools } from './components'

export interface FormDevtoolsInit {}

class FormDevtoolsCore {
  #isMounted = false
  #dispose?: () => void
  #ThemeProvider: any

  constructor(_init?: FormDevtoolsInit | undefined) {}

  mount<T extends HTMLElement>(el: T, theme: 'light' | 'dark') {
    if (this.#isMounted) {
      throw new Error('Devtools is already mounted')
    }

    this.#ThemeProvider = lazy(() =>
      import('@tanstack/devtools-ui').then((mod) => ({
        default: mod.ThemeContextProvider,
      })),
    )
    const ThemeProvider = this.#ThemeProvider

    const dispose = render(() => {
      return (
        <ThemeProvider theme={theme}>
          <Devtools />
        </ThemeProvider>
      )
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

export { FormDevtoolsCore }

import type { JSX } from 'solid-js'

export function constructCoreClass(Component: () => JSX.Element) {
  class DevtoolsCore {
    #isMounted = false
    #dispose?: () => void
    #Component: any
    #ThemeProvider: any

    async mount<T extends HTMLElement>(el: T, theme: 'light' | 'dark') {
      if (this.#isMounted) {
        throw new Error('Devtools is already mounted')
      }

      const { lazy } = await import('solid-js')
      const { render, Portal } = await import('solid-js/web')

      const dispose = render(() => {
        this.#Component = Component
        this.#ThemeProvider = lazy(() =>
          import('@tanstack/devtools-ui').then((mod) => ({
            default: mod.ThemeContextProvider,
          })),
        )

        const Devtools = this.#Component
        const ThemeProvider = this.#ThemeProvider

        return (
          <Portal mount={el}>
            <div style={{ height: '100%' }}>
              <ThemeProvider theme={theme}>
                <Devtools />
              </ThemeProvider>
            </div>
          </Portal>
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

  class NoOpDevtoolsCore extends DevtoolsCore {
    async mount<T extends HTMLElement>(_el: T, _theme: 'light' | 'dark') {}
    unmount() {}
  }

  return [DevtoolsCore, NoOpDevtoolsCore] as const
}

export type ClassType = ReturnType<typeof constructCoreClass>[0]


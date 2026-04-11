import { getQueriesForElement, prettyDOM } from '@testing-library/dom'
import { createComponent, flush } from 'solid-js'
import { render as solidRender } from '@solidjs/web'
import type { JSX } from 'solid-js'

export * from '@testing-library/dom'

type RenderRef = {
  container: HTMLElement
  dispose: () => void
}

const mountedContainers = new Set<RenderRef>()

export function render(
  ui: () => JSX.Element,
  options: {
    container?: HTMLElement
    baseElement?: HTMLElement
    queries?: Parameters<typeof getQueriesForElement>[1]
  } = {},
) {
  const baseElement = options.baseElement ?? document.body
  const container =
    options.container ?? baseElement.appendChild(document.createElement('div'))

  const dispose = solidRender(() => createComponent(ui, {}), container)
  flush()
  mountedContainers.add({ container, dispose })

  const queryHelpers = getQueriesForElement(container, options.queries)

  return {
    asFragment: () => container.innerHTML,
    baseElement,
    container,
    debug: (
      el: Element | Element[] = baseElement,
      maxLength?: number,
      debugOptions?: Parameters<typeof prettyDOM>[2],
    ) => {
      if (Array.isArray(el)) {
        el.forEach((entry) =>
          console.log(prettyDOM(entry, maxLength, debugOptions)),
        )
        return
      }

      console.log(prettyDOM(el, maxLength, debugOptions))
    },
    unmount: dispose,
    ...queryHelpers,
  }
}

export function cleanup() {
  for (const ref of Array.from(mountedContainers)) {
    ref.dispose()

    if (ref.container.parentNode === document.body) {
      document.body.removeChild(ref.container)
    }

    mountedContainers.delete(ref)
  }
}

import { createSignal, onCleanup, onMount } from 'solid-js'
import type { JSX } from 'solid-js'

export interface DevtoolsPanelProps {
  theme?: 'light' | 'dark'
}

export function createSolidPanel<
  TComponentProps extends DevtoolsPanelProps | undefined,
  TCoreDevtoolsClass extends {
    mount: (el: HTMLElement, theme: 'light' | 'dark') => void
    unmount: () => void
  },
>(CoreClass: new () => TCoreDevtoolsClass) {
  function Panel(props: TComponentProps) {
    let devToolRef: HTMLDivElement | undefined
    const [devtools] = createSignal(new CoreClass())

    onMount(() => {
      if (devToolRef) {
        devtools().mount(devToolRef, props?.theme ?? 'dark')
      }

      onCleanup(() => {
        devtools().unmount()
      })
    })

    return <div style={{ height: '100%' }} ref={devToolRef} />
  }

  function NoOpPanel(_props: TComponentProps) {
    return <></>
  }

  return [Panel, NoOpPanel] as const
}

export function createSolidPlugin(
  name: string,
  Component: (props: DevtoolsPanelProps) => JSX.Element,
) {
  function Plugin() {
    return {
      name,
      render: (_el: HTMLElement, theme: 'light' | 'dark') => (
        <Component theme={theme} />
      ),
    }
  }

  function NoOpPlugin() {
    return {
      name,
      render: (_el: HTMLElement, _theme: 'light' | 'dark') => <></>,
    }
  }

  return [Plugin, NoOpPlugin] as const
}


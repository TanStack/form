import { Tabs } from '@ark-ui/solid'
import { FieldTab } from './fields/FieldTab'
import { Header } from './header/Header'
import { PortalProvider } from './ui/portal'
import { DevtoolsTab } from './header/TabsNav'
import type { FormTabValue } from './header/TabsNav'
import type { FormDevtoolsInit } from '@/core'
import type { TanStackDevtoolsTheme } from '@tanstack/devtools-ui'

type DevtoolsProps = FormDevtoolsInit & {
  theme: TanStackDevtoolsTheme
}

export function Shell(props: DevtoolsProps) {
  return (
    <Tabs.Root
      defaultValue={'field' satisfies FormTabValue}
      lazyMount
      unmountOnExit
      asChild={(innerProps) => (
        <PortalProvider
          class="size-full bg-background grid grid-rows-[auto_1fr]"
          {...innerProps()}
        />
      )}
    >
      <Header adapterName={props.adapterName} />
      <FieldTab />
      {/* TODO replace */}
      <DevtoolsTab value="form">Coming soon!</DevtoolsTab>
      <DevtoolsTab value="validation">Coming soon!</DevtoolsTab>
    </Tabs.Root>
  )
}

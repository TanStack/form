'use client'

import { createReactPlugin } from '@tanstack/devtools-utils/react'
import { FormDevtoolsPanel } from './FormDevtools'

import type { TanStackDevtoolsPlugin } from '@tanstack/devtools'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react'

type ReactFormDevtoolsPlugin = () => TanStackDevtoolsPlugin

function ReactFormDevtoolsPanel(props: DevtoolsPanelProps) {
  return <FormDevtoolsPanel {...props} adapterName="React" />
}

const [formDevtoolsPlugin, formDevtoolsNoOpPlugin]: readonly [
  ReactFormDevtoolsPlugin,
  ReactFormDevtoolsPlugin,
] = createReactPlugin({
  name: 'TanStack Form',
  Component: ReactFormDevtoolsPanel,
})

export { formDevtoolsPlugin, formDevtoolsNoOpPlugin }

'use client'

import { createReactPlugin } from '@tanstack/devtools-utils/react'
import { FormDevtoolsPanel } from './FormDevtools'

import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react'

function ReactFormDevtoolsPanel(props: DevtoolsPanelProps) {
  return <FormDevtoolsPanel {...props} adapterName="React" />
}

const [formDevtoolsPlugin, formDevtoolsNoOpPlugin] = createReactPlugin({
  name: 'TanStack Form',
  Component: ReactFormDevtoolsPanel,
})

export { formDevtoolsPlugin, formDevtoolsNoOpPlugin }

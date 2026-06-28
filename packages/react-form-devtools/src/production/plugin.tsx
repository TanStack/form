'use client'

import { createReactPlugin } from '@tanstack/devtools-utils/react'
import { FormDevtoolsPanel } from './FormDevtools'
import type { ReactFormDevtoolsPlugin } from '../types'
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react'

function ReactFormDevtoolsPanel(props: DevtoolsPanelProps) {
  return <FormDevtoolsPanel {...props} adapterName="React" />
}

const [formDevtoolsPlugin]: readonly [
  ReactFormDevtoolsPlugin,
  ReactFormDevtoolsPlugin,
] = createReactPlugin({
  name: 'TanStack Form',
  Component: ReactFormDevtoolsPanel,
})

export { formDevtoolsPlugin }

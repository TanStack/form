import { createReactPlugin } from '@tanstack/devtools-utils/react'
import { FormDevtoolsPanel } from './FormDevtools'

const [formDevtoolsPlugin, formDevtoolsNoOpPlugin] = createReactPlugin({
  name: 'TanStack Form',
  Component: FormDevtoolsPanel,
})

export { formDevtoolsPlugin, formDevtoolsNoOpPlugin }

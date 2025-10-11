import { createReactPlugin } from '@tanstack/devtools-utils/react'
import { FormDevtoolsPanel } from './FormDevtools'

const [formDevtoolsPlugin, formDevtoolsNoOpPlugin] = createReactPlugin(
  'TanStack Form',
  FormDevtoolsPanel,
)

export { formDevtoolsPlugin, formDevtoolsNoOpPlugin }

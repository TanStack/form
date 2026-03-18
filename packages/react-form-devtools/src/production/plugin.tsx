import { createReactPlugin } from '@tanstack/devtools-utils/react'
import { FormDevtoolsPanel } from './FormDevtools'

const [formDevtoolsPlugin] = createReactPlugin({
  name: 'TanStack Form',
  Component: FormDevtoolsPanel,
})

export { formDevtoolsPlugin }

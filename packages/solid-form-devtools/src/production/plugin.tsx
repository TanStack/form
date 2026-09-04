import { createSolidPlugin } from '@tanstack/devtools-utils/solid'
import { FormDevtoolsPanel } from './FormDevtools'

const [formDevtoolsPlugin] = createSolidPlugin({
  name: 'TanStack Form',
  Component: FormDevtoolsPanel,
})

export { formDevtoolsPlugin }

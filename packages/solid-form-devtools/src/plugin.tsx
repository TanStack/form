import { createSolidPlugin } from '@tanstack/devtools-utils/solid'
import { FormDevtoolsPanel } from './FormDevtools'

const [formDevtoolsPlugin, formDevtoolsNoOpPlugin] = createSolidPlugin(
  'TanStack Form',
  FormDevtoolsPanel,
)

export { formDevtoolsPlugin, formDevtoolsNoOpPlugin }

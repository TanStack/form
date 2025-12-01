import { createReactPlugin } from './devtoolsUtils'
import { FormDevtoolsPanel } from './FormDevtools'

const [formDevtoolsPlugin, formDevtoolsNoOpPlugin] = createReactPlugin(
  'TanStack Form',
  FormDevtoolsPanel,
)

export { formDevtoolsPlugin, formDevtoolsNoOpPlugin }

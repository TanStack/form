import { createSolidPlugin } from './devtoolsUtils'
import { FormDevtoolsPanel } from './FormDevtools'

const [formDevtoolsPlugin, formDevtoolsNoOpPlugin] = createSolidPlugin(
  'TanStack Form',
  FormDevtoolsPanel,
)

export { formDevtoolsPlugin, formDevtoolsNoOpPlugin }

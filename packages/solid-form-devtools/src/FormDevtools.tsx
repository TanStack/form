import { createSolidPanel } from './devtoolsUtils'
import { FormDevtoolsCore } from '@tanstack/form-devtools'

import type { DevtoolsPanelProps } from './devtoolsUtils'

const [FormDevtoolsPanel, FormDevtoolsPanelNoOp] =
  createSolidPanel(FormDevtoolsCore)

export interface FormDevtoolsSolidInit extends DevtoolsPanelProps {}

export { FormDevtoolsPanel, FormDevtoolsPanelNoOp }

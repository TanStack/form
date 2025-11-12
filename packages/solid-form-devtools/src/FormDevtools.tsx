import { createSolidPanel } from '@tanstack/devtools-utils/solid'
import { FormDevtoolsCore } from '@tanstack/form-devtools'

import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/solid'

const [FormDevtoolsPanel, FormDevtoolsPanelNoOp] =
  createSolidPanel(FormDevtoolsCore)

export interface FormDevtoolsSolidInit extends DevtoolsPanelProps {}

export { FormDevtoolsPanel, FormDevtoolsPanelNoOp }

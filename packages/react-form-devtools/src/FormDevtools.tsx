import { createReactPanel } from './devtoolsUtils'
import { FormDevtoolsCore } from '@tanstack/form-devtools'

// type
import type { DevtoolsPanelProps } from './devtoolsUtils'

export interface FormDevtoolsReactInit extends DevtoolsPanelProps {}

const [FormDevtoolsPanel, FormDevtoolsPanelNoOp] =
  createReactPanel(FormDevtoolsCore)

export { FormDevtoolsPanel, FormDevtoolsPanelNoOp }

import { createReactPanel } from '@tanstack/devtools-utils/react'
import { FormDevtoolsCore } from '@tanstack/form-devtools'

// type
import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react'

export interface FormDevtoolsReactInit extends DevtoolsPanelProps {}

const [FormDevtoolsPanel, FormDevtoolsPanelNoOp] =
  createReactPanel(FormDevtoolsCore)

export { FormDevtoolsPanel, FormDevtoolsPanelNoOp }

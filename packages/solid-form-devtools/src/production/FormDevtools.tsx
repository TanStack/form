import { createSolidPanel } from '@tanstack/devtools-utils/solid'
import { FormDevtoolsCore } from '@tanstack/form-devtools/production'

import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/solid'

const [FormDevtoolsPanel] = createSolidPanel(FormDevtoolsCore)

export interface FormDevtoolsSolidInit extends DevtoolsPanelProps {}

export { FormDevtoolsPanel }

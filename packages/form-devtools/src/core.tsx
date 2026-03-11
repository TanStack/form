import { constructCoreClass } from '@tanstack/devtools-utils/solid'

export interface FormDevtoolsInit {}

const [FormDevtoolsCore, FormDevtoolsCoreNoOp] = constructCoreClass(
  () => import('./components'),
)

export { FormDevtoolsCore, FormDevtoolsCoreNoOp }

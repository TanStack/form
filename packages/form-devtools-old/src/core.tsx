import { constructCoreClass } from '@tanstack/devtools-utils/solid'

export interface FormDevtoolsInit {
  adapterName?: string
}

export const [FormDevtoolsCore, FormDevtoolsCoreNoOp] = constructCoreClass(
  () => import('./components'),
)

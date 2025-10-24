import { lazy } from 'solid-js'
import { constructCoreClass } from '@tanstack/devtools-utils/solid'

const Component = lazy(() => import('./components'))

export interface FormDevtoolsInit {}

const [FormDevtoolsCore, FormDevtoolsCoreNoOp] = constructCoreClass(Component)

export { FormDevtoolsCore, FormDevtoolsCoreNoOp }

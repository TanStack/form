import { installDevtoolsBridge } from '@tanstack/form-core/internals'
import { createFormDevtoolsBridge } from './createBridge'
import { createFieldsController } from './fields'
import { createMountedFormsController } from './forms/mountedForms'

const mountedForms = createMountedFormsController()
const fields = createFieldsController(mountedForms)

installDevtoolsBridge(createFormDevtoolsBridge({ fields, mountedForms }))

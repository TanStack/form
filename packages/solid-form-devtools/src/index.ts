import * as Devtools from './FormDevtools'
import * as plugin from './plugin'

export const FormDevtools =
  process.env.NODE_ENV !== 'development'
    ? Devtools.FormDevtoolsPanelNoOp
    : Devtools.FormDevtoolsPanel

export const formDevtoolsPlugin =
  process.env.NODE_ENV !== 'development'
    ? plugin.formDevtoolsNoOpPlugin
    : plugin.formDevtoolsPlugin

export type { FormDevtoolsSolidInit } from './FormDevtools'

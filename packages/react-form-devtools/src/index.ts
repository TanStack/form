'use client'

import * as Devtools from './FormDevtools'
import * as plugin from './plugin'

export const FormDevtoolsPanel =
  process.env.NODE_ENV !== 'development'
    ? Devtools.FormDevtoolsPanelNoOp
    : Devtools.FormDevtoolsPanel

export const formDevtoolsPlugin =
  process.env.NODE_ENV !== 'development'
    ? plugin.formDevtoolsNoOpPlugin
    : plugin.formDevtoolsPlugin

export type { FormDevtoolsReactInit } from './FormDevtools'

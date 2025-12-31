'use client'

import * as Devtools from './core'

export const FormDevtoolsCore =
  process.env.NODE_ENV !== 'development'
    ? Devtools.FormDevtoolsCoreNoOp
    : Devtools.FormDevtoolsCore

export type { FormDevtoolsInit } from './core'

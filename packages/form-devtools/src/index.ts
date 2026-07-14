'use client'

import './bridge'
import * as Devtools from './core'

import type { ClassType } from '@tanstack/devtools-utils/solid/class'

export const FormDevtoolsCore: ClassType =
  process.env.NODE_ENV !== 'development'
    ? Devtools.FormDevtoolsCoreNoOp
    : Devtools.FormDevtoolsCore

export type { FormDevtoolsInit } from './core'

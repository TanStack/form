'use client'

import * as Devtools from './core'

// Create a dummy class for production that does nothing
class DummyFormDevtoolsCore {
  constructor() {}
  mount() {}
  unmount() {}
}

export const FormDevtoolsCore: (typeof Devtools)['FormDevtoolsCore'] =
  process.env.NODE_ENV !== 'development'
    ? (DummyFormDevtoolsCore as any)
    : Devtools.FormDevtoolsCore

export type { FormDevtoolsInit } from './core'

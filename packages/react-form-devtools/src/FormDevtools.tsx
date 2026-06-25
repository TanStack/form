'use client'

import { createReactPanel } from '@tanstack/devtools-utils/react'
import { FormDevtoolsCore } from '@tanstack/form-devtools'

import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react'
import type { FormDevtoolsInit } from '@tanstack/form-devtools'

export interface FormDevtoolsReactInit
  extends DevtoolsPanelProps, FormDevtoolsInit {}

const [FormDevtoolsPanel, FormDevtoolsPanelNoOp] = createReactPanel<
  FormDevtoolsReactInit,
  InstanceType<typeof FormDevtoolsCore>
>(FormDevtoolsCore)

export { FormDevtoolsPanel, FormDevtoolsPanelNoOp }

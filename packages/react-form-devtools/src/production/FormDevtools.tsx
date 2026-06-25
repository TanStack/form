'use client'

import { createReactPanel } from '@tanstack/devtools-utils/react'
import { FormDevtoolsCore } from '@tanstack/form-devtools/production'

import type { DevtoolsPanelProps } from '@tanstack/devtools-utils/react'
import type { FormDevtoolsInit } from '@tanstack/form-devtools/production'

export interface FormDevtoolsReactInit
  extends DevtoolsPanelProps, FormDevtoolsInit {}

const [FormDevtoolsPanel] = createReactPanel<
  FormDevtoolsReactInit,
  InstanceType<typeof FormDevtoolsCore>
>(FormDevtoolsCore)

export { FormDevtoolsPanel }

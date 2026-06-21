import type { ReactElement } from 'react'

export type ImplementationId = 'react-hook-form' | 'tanstack'

export type ScenarioId =
  | 'array-insert-remove'
  | 'array-move'
  | 'array-swap'
  | 'change-one-field'
  | 'dependent-field-update'
  | 'form-group-scoped-validation'
  | 'render-many-fields'
  | 'validation-on-change'

export type ScenarioSizeKind = 'fieldCount' | 'itemCount'

export interface SpeedConfig {
  iterations: number
  warmups: number
}

export interface MemoryConfig {
  interactions: number
  samples: number
}

export interface ScenarioDefinition {
  id: ScenarioId
  sizeKind: ScenarioSizeKind
  sizes: Array<number>
  speed: SpeedConfig
  memory: MemoryConfig
}

export interface ScenarioVariant {
  id: ScenarioId
  size: number
  sizeKind: ScenarioSizeKind
  speed: SpeedConfig
  memory: MemoryConfig
}

export interface BrowserBenchMetrics {
  counters: Record<string, number>
  implementation: ImplementationId
  scenario: ScenarioId
  size: number
  sizeKind: ScenarioSizeKind
}

export interface BrowserBenchController {
  prepare: () => Promise<void>
  reset: () => Promise<void>
  run: () => Promise<void>
  assert: () => Promise<void>
  dispose: () => Promise<void>
  getMetrics: () => BrowserBenchMetrics
}

export interface BrowserBenchScenario {
  assert: () => void | Promise<void>
  getMetrics: () => Record<string, number>
  prepare: () => void | Promise<void>
  reset: () => void | Promise<void>
  run: () => void | Promise<void>
}

export interface BrowserBenchScenarioContext {
  implementation: ImplementationId
  root: HTMLElement
  variant: ScenarioVariant
}

export interface BrowserBenchScenarioFactory {
  create: (context: BrowserBenchScenarioContext) => BrowserBenchScenario
}

export interface RenderedScenario {
  element: ReactElement
  getMetrics: () => Record<string, number>
}

declare global {
  interface Window {
    __bench?: BrowserBenchController
  }
}

import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import {
  getRequiredElement,
  setNativeInputValue,
  waitForBrowserWork,
} from '../dom-utils'
import { fieldName, fieldValue, itemValue } from '../scenario-contracts'
import type { Root } from 'react-dom/client'
import type {
  BrowserBenchController,
  BrowserBenchMetrics,
  BrowserBenchScenarioContext,
  ScenarioId,
} from '../browser-bench.types'
import type { ReactElement } from 'react'

export type ArrayOperation = 'insert-remove' | 'move' | 'swap'

export interface ScenarioCounters extends Record<string, number> {
  arrayRenders: number
  fieldRenders: number
  formGroupValidatorRuns: number
  groupSubscribeRenders: number
  lastRunFieldRenders: number
  lastRunFormGroupValidatorRuns: number
  lastRunListenerRuns: number
  lastRunValidatorRuns: number
  listenerRuns: number
  validatorRuns: number
}

export interface ReactScenarioOptions {
  assert: (root: HTMLElement, counters: ScenarioCounters) => void
  assertReady?: (root: HTMLElement, counters: ScenarioCounters) => void
  createElement: (counters: ScenarioCounters) => ReactElement
  reset?: (
    root: HTMLElement,
    counters: ScenarioCounters,
  ) => Promise<void> | void
  resetByRemount?: boolean
  run: (root: HTMLElement, counters: ScenarioCounters) => Promise<void> | void
}

export type GetScenarioOptions = (
  scenario: ScenarioId,
  size: number,
) => ReactScenarioOptions

export const INSERTED_ITEM = {
  id: 'inserted-item',
  name: 'Inserted item',
}

export function createReactScenarioController(
  context: BrowserBenchScenarioContext,
  getScenarioOptions: GetScenarioOptions,
): BrowserBenchController {
  const scenario = createReactScenario(context, getScenarioOptions)

  return {
    prepare: async () => {
      await scenario.prepare()
    },
    reset: async () => {
      await scenario.reset()
    },
    run: async () => {
      await scenario.run()
    },
    assert: async () => {
      await scenario.assert()
    },
    dispose: async () => {
      await scenario.dispose()
    },
    getMetrics: () => scenario.getMetrics(),
  }
}

export function createCounters(): ScenarioCounters {
  return {
    arrayRenders: 0,
    fieldRenders: 0,
    formGroupValidatorRuns: 0,
    groupSubscribeRenders: 0,
    lastRunFieldRenders: 0,
    lastRunFormGroupValidatorRuns: 0,
    lastRunListenerRuns: 0,
    lastRunValidatorRuns: 0,
    listenerRuns: 0,
    validatorRuns: 0,
  }
}

export function createFieldValues(count: number): Record<string, string> {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => [
      fieldName(index),
      fieldValue(index),
    ]),
  )
}

export function createItems(
  count: number,
): Array<{ id: string; name: string }> {
  return Array.from({ length: count }, (_, index) => ({
    id: `item-${index}`,
    name: itemValue(index),
  }))
}

export function setInputValue(input: HTMLInputElement, value: string) {
  setNativeInputValue(input, value)
}

export function clickButton(root: HTMLElement, testId: string) {
  getRequiredElement<HTMLButtonElement>(
    root,
    `button[data-testid="${testId}"]`,
  ).click()
}

export function getFieldInput(
  root: HTMLElement,
  index: number,
): HTMLInputElement {
  return getRequiredElement<HTMLInputElement>(
    root,
    `input[data-bench-field="text"][data-index="${index}"]`,
  )
}

export function getGroupInput(
  root: HTMLElement,
  index: number,
): HTMLInputElement {
  return getRequiredElement<HTMLInputElement>(
    root,
    `input[data-bench-field="group-text"][data-index="${index}"]`,
  )
}

interface ReactBenchmarkScenario {
  assert: () => Promise<void>
  dispose: () => Promise<void>
  getMetrics: () => BrowserBenchMetrics
  prepare: () => Promise<void>
  reset: () => Promise<void>
  run: () => Promise<void>
}

function createReactScenario(
  context: BrowserBenchScenarioContext,
  getScenarioOptions: GetScenarioOptions,
): ReactBenchmarkScenario {
  const counters = createCounters()
  const options = getScenarioOptions(context.variant.id, context.variant.size)
  let root: Root | null = null

  function mount() {
    if (root) return
    root = createRoot(context.root)
    flushSync(() => {
      root!.render(options.createElement(counters))
    })
  }

  function unmount() {
    if (!root) return
    flushSync(() => {
      root!.unmount()
    })
    root = null
    context.root.textContent = ''
  }

  async function prepare() {
    mount()
    await waitForBrowserWork()
    ;(options.assertReady ?? options.assert)(context.root, counters)
  }

  async function reset() {
    if (options.resetByRemount) {
      unmount()
      mount()
      await waitForBrowserWork()
      ;(options.assertReady ?? options.assert)(context.root, counters)
      return
    }

    if (!root) {
      mount()
      await waitForBrowserWork()
    }

    await options.reset?.(context.root, counters)
    await waitForBrowserWork()
    ;(options.assertReady ?? options.assert)(context.root, counters)
  }

  async function run() {
    if (!root) {
      mount()
      await waitForBrowserWork()
    }

    await options.run(context.root, counters)
    await waitForBrowserWork()
  }

  async function assert() {
    options.assert(context.root, counters)
  }

  async function dispose() {
    unmount()
    await waitForBrowserWork()
  }

  return {
    prepare,
    reset,
    run,
    assert,
    dispose,
    getMetrics: () => ({
      counters: { ...counters },
      implementation: context.implementation,
      scenario: context.variant.id,
      size: context.variant.size,
      sizeKind: context.variant.sizeKind,
    }),
  }
}

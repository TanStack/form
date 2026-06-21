import { getRequiredElement, getRequiredElements } from './dom-utils'
import type { ScenarioId } from './browser-bench.types'

export type BenchFieldKind = 'array-item' | 'group-text' | 'text'

export interface BenchInputCountExpectation {
  count: number
  kind: BenchFieldKind
}

export interface BenchInputValueExpectation {
  index: number
  kind: BenchFieldKind
  value: string
}

export interface BenchOutputExpectation {
  testId: string
  text: string
}

export interface BenchCounterExpectation {
  equals?: number
  greaterThan?: number
  lessThan?: number
  name: string
}

export interface ScenarioExpectedState {
  counters?: Array<BenchCounterExpectation>
  inputCounts?: Array<BenchInputCountExpectation>
  inputValues?: Array<BenchInputValueExpectation>
  outputs?: Array<BenchOutputExpectation>
}

export interface ScenarioContract {
  afterRun: ScenarioExpectedState
  ready: ScenarioExpectedState
}

export const UPDATED_VALUE = 'updated-value'
export const INVALID_VALUE = 'x'
export const VALID_VALUE = 'valid-value'

export function createScenarioContract(
  scenario: ScenarioId,
  size: number,
): ScenarioContract {
  const target = targetIndex(size)

  switch (scenario) {
    case 'render-many-fields':
      return {
        ready: manyTextFields(size),
        afterRun: manyTextFields(size),
      }
    case 'change-one-field':
      return {
        ready: {
          ...manyTextFields(size),
          inputValues: [textInputValue(target, fieldValue(target))],
        },
        afterRun: {
          ...manyTextFields(size),
          inputValues: [
            textInputValue(0, fieldValue(0)),
            textInputValue(target, UPDATED_VALUE),
          ],
        },
      }
    case 'validation-on-change':
      return {
        ready: {
          ...manyTextFields(size),
          inputValues: [textInputValue(target, VALID_VALUE)],
          outputs: [{ testId: 'target-error-count', text: '0' }],
        },
        afterRun: {
          ...manyTextFields(size),
          inputValues: [textInputValue(target, INVALID_VALUE)],
          outputs: [{ testId: 'target-error-count', text: '2' }],
          counters: [{ name: 'lastRunValidatorRuns', equals: 2 }],
        },
      }
    case 'dependent-field-update':
      return {
        ready: {
          ...manyTextFields(size),
          inputValues: [textInputValue(0, fieldValue(0))],
        },
        afterRun: {
          ...manyTextFields(size),
          inputValues: [textInputValue(0, UPDATED_VALUE)],
          counters: [{ name: 'lastRunListenerRuns', equals: 1 }],
        },
      }
    case 'array-swap':
      return {
        ready: arrayReadyState(size),
        afterRun: {
          ...arrayCountState(size),
          inputValues: [
            arrayInputValue(0, itemValue(size - 1)),
            arrayInputValue(size - 1, itemValue(0)),
          ],
        },
      }
    case 'array-move':
      return {
        ready: arrayReadyState(size),
        afterRun: {
          ...arrayCountState(size),
          inputValues: [
            arrayInputValue(0, itemValue(1)),
            arrayInputValue(size - 1, itemValue(0)),
          ],
        },
      }
    case 'array-insert-remove':
      return {
        ready: arrayReadyState(size),
        afterRun: arrayReadyState(size),
      }
    case 'form-group-scoped-validation':
      return {
        ready: {
          ...groupFields(size),
          inputValues: [groupInputValue(0, VALID_VALUE)],
          outputs: [
            { testId: 'group-is-valid', text: 'true' },
            { testId: 'group-error-count', text: '0' },
            { testId: 'group-field-name', text: 'group.field0' },
          ],
        },
        afterRun: {
          ...groupFields(size),
          inputValues: [groupInputValue(0, INVALID_VALUE)],
          outputs: [
            { testId: 'group-is-valid', text: 'false' },
            { testId: 'group-error-count', text: '1' },
            { testId: 'group-field-name', text: 'group.field0' },
          ],
          counters: [
            { name: 'lastRunFormGroupValidatorRuns', equals: 1 },
            { name: 'groupSubscribeRenders', greaterThan: 0 },
          ],
        },
      }
  }
}

export function assertScenarioContract(
  root: HTMLElement,
  expected: ScenarioExpectedState,
  counters: Record<string, number>,
) {
  for (const inputCount of expected.inputCounts ?? []) {
    assertInputCount(root, inputCount)
  }

  for (const inputValue of expected.inputValues ?? []) {
    assertInputValue(root, inputValue)
  }

  for (const output of expected.outputs ?? []) {
    assertOutputText(root, output)
  }

  for (const counter of expected.counters ?? []) {
    assertCounter(counters, counter)
  }
}

export function fieldName(index: number): `field${number}` {
  return `field${index}`
}

export function fieldValue(index: number): string {
  return `Field ${index}`
}

export function itemValue(index: number): string {
  return `Item ${index}`
}

export function targetIndex(count: number): number {
  return Math.floor(count / 2)
}

function manyTextFields(count: number): ScenarioExpectedState {
  return {
    inputCounts: [{ kind: 'text', count }],
  }
}

function arrayReadyState(count: number): ScenarioExpectedState {
  return {
    ...arrayCountState(count),
    inputValues: [
      arrayInputValue(0, itemValue(0)),
      arrayInputValue(count - 1, itemValue(count - 1)),
    ],
  }
}

function arrayCountState(count: number): ScenarioExpectedState {
  return {
    inputCounts: [{ kind: 'array-item', count }],
    outputs: [{ testId: 'array-length', text: String(count) }],
  }
}

function groupFields(count: number): ScenarioExpectedState {
  return {
    inputCounts: [{ kind: 'group-text', count }],
  }
}

function textInputValue(
  index: number,
  value: string,
): BenchInputValueExpectation {
  return {
    kind: 'text',
    index,
    value,
  }
}

function arrayInputValue(
  index: number,
  value: string,
): BenchInputValueExpectation {
  return {
    kind: 'array-item',
    index,
    value,
  }
}

function groupInputValue(
  index: number,
  value: string,
): BenchInputValueExpectation {
  return {
    kind: 'group-text',
    index,
    value,
  }
}

function assertInputCount(
  root: HTMLElement,
  expected: BenchInputCountExpectation,
) {
  const inputs = getRequiredElements<HTMLInputElement>(
    root,
    `input[data-bench-field="${expected.kind}"]`,
  )
  if (inputs.length !== expected.count) {
    throw new Error(
      `Expected ${expected.count} ${expected.kind} inputs, received ${inputs.length}`,
    )
  }
}

function assertInputValue(
  root: HTMLElement,
  expected: BenchInputValueExpectation,
) {
  const input = getRequiredElement<HTMLInputElement>(
    root,
    `input[data-bench-field="${expected.kind}"][data-index="${expected.index}"]`,
  )
  if (input.value !== expected.value) {
    throw new Error(
      `Expected ${expected.kind} input ${expected.index} value "${expected.value}", received "${input.value}"`,
    )
  }
}

function assertOutputText(root: HTMLElement, expected: BenchOutputExpectation) {
  const output = getRequiredElement<HTMLOutputElement>(
    root,
    `[data-testid="${expected.testId}"]`,
  )
  if (output.textContent !== expected.text) {
    throw new Error(
      `Expected ${expected.testId} text "${expected.text}", received "${output.textContent}"`,
    )
  }
}

function assertCounter(
  counters: Record<string, number>,
  expected: BenchCounterExpectation,
) {
  const actual = counters[expected.name]
  if (actual === undefined) {
    throw new Error(`Missing benchmark counter "${expected.name}"`)
  }

  if (expected.equals !== undefined && actual !== expected.equals) {
    throw new Error(
      `Expected counter "${expected.name}" to equal ${expected.equals}, received ${actual}`,
    )
  }

  if (expected.lessThan !== undefined && actual >= expected.lessThan) {
    throw new Error(
      `Expected counter "${expected.name}" to be less than ${expected.lessThan}, received ${actual}`,
    )
  }

  if (expected.greaterThan !== undefined && actual <= expected.greaterThan) {
    throw new Error(
      `Expected counter "${expected.name}" to be greater than ${expected.greaterThan}, received ${actual}`,
    )
  }
}

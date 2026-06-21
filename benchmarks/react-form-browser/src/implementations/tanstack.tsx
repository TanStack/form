import { waitForBrowserWork } from '../dom-utils'
import {
  INVALID_VALUE,
  UPDATED_VALUE,
  VALID_VALUE,
  assertScenarioContract,
  createScenarioContract,
  fieldValue,
  targetIndex,
} from '../scenario-contracts'
import {
  ArrayScenario,
  DependentFieldsForm,
  FormGroupScenario,
  ManyFieldsForm,
  ValidationForm,
} from './tanstack-ui'
import {
  clickButton,
  createReactScenarioController,
  getFieldInput,
  getGroupInput,
  setInputValue,
} from './react-scenario-runner'
import type {
  ArrayOperation,
  ReactScenarioOptions,
} from './react-scenario-runner'
import type {
  BrowserBenchController,
  BrowserBenchScenarioContext,
  ScenarioId,
} from '../browser-bench.types'

export function createTanStackController(
  context: BrowserBenchScenarioContext,
): BrowserBenchController {
  return createReactScenarioController(context, getScenarioOptions)
}

function getScenarioOptions(
  scenario: ScenarioId,
  size: number,
): ReactScenarioOptions {
  const contract = createScenarioContract(scenario, size)

  switch (scenario) {
    case 'render-many-fields':
      return {
        resetByRemount: true,
        createElement: (counters) => (
          <ManyFieldsForm counters={counters} count={size} />
        ),
        run: () => {},
        assert: (root, counters) =>
          assertScenarioContract(root, contract.afterRun, counters),
      }
    case 'change-one-field':
      return {
        createElement: (counters) => (
          <ManyFieldsForm counters={counters} count={size} />
        ),
        reset: async (root) => {
          setInputValue(
            getFieldInput(root, targetIndex(size)),
            fieldValue(targetIndex(size)),
          )
        },
        run: async (root, counters) => {
          const before = counters.fieldRenders
          setInputValue(getFieldInput(root, targetIndex(size)), UPDATED_VALUE)
          counters.lastRunFieldRenders = counters.fieldRenders - before
        },
        assertReady: (root, counters) => {
          assertScenarioContract(root, contract.ready, counters)
        },
        assert: (root, counters) => {
          assertScenarioContract(root, contract.afterRun, counters)
        },
      }
    case 'validation-on-change':
      return {
        createElement: (counters) => (
          <ValidationForm counters={counters} count={size} />
        ),
        reset: async (root) => {
          setInputValue(getFieldInput(root, targetIndex(size)), VALID_VALUE)
        },
        run: async (root, counters) => {
          const before = counters.validatorRuns
          setInputValue(getFieldInput(root, targetIndex(size)), INVALID_VALUE)
          counters.lastRunValidatorRuns = counters.validatorRuns - before
        },
        assertReady: (root, counters) => {
          assertScenarioContract(root, contract.ready, counters)
        },
        assert: (root, counters) => {
          assertScenarioContract(root, contract.afterRun, counters)
        },
      }
    case 'dependent-field-update':
      return {
        createElement: (counters) => (
          <DependentFieldsForm counters={counters} count={size} />
        ),
        reset: async (root) => {
          setInputValue(getFieldInput(root, 0), fieldValue(0))
        },
        run: async (root, counters) => {
          const before = counters.listenerRuns
          setInputValue(getFieldInput(root, 0), UPDATED_VALUE)
          counters.lastRunListenerRuns = counters.listenerRuns - before
        },
        assertReady: (root, counters) => {
          assertScenarioContract(root, contract.ready, counters)
        },
        assert: (root, counters) => {
          assertScenarioContract(root, contract.afterRun, counters)
        },
      }
    case 'array-swap':
      return createArrayScenarioOptions(size, 'swap')
    case 'array-move':
      return createArrayScenarioOptions(size, 'move')
    case 'array-insert-remove':
      return createArrayScenarioOptions(size, 'insert-remove')
    case 'form-group-scoped-validation':
      return {
        createElement: (counters) => (
          <FormGroupScenario counters={counters} count={size} />
        ),
        reset: async (root) => {
          setInputValue(getGroupInput(root, 0), VALID_VALUE)
        },
        run: async (root, counters) => {
          const before = counters.formGroupValidatorRuns
          setInputValue(getGroupInput(root, 0), INVALID_VALUE)
          counters.lastRunFormGroupValidatorRuns =
            counters.formGroupValidatorRuns - before
        },
        assertReady: (root, counters) => {
          assertScenarioContract(root, contract.ready, counters)
        },
        assert: (root, counters) => {
          assertScenarioContract(root, contract.afterRun, counters)
        },
      }
  }
}

function createArrayScenarioOptions(
  size: number,
  operation: ArrayOperation,
): ReactScenarioOptions {
  const scenario = `array-${operation}` as ScenarioId
  const contract = createScenarioContract(scenario, size)

  return {
    resetByRemount: true,
    createElement: (counters) => (
      <ArrayScenario counters={counters} count={size} operation={operation} />
    ),
    run: async (root) => {
      if (operation === 'insert-remove') {
        clickButton(root, 'array-insert')
        await waitForBrowserWork()
        clickButton(root, 'array-remove-inserted')
        return
      }

      clickButton(root, `array-${operation}`)
    },
    assertReady: (root, counters) => {
      assertScenarioContract(root, contract.ready, counters)
    },
    assert: (root, counters) => {
      assertScenarioContract(root, contract.afterRun, counters)
    },
  }
}

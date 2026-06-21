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
} from './react-hook-form-ui'
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

export function createReactHookFormController(
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
    case 'change-one-field': {
      let fieldRenderStart = 0

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
          fieldRenderStart = counters.fieldRenders
          setInputValue(getFieldInput(root, targetIndex(size)), UPDATED_VALUE)
        },
        assertReady: (root, counters) => {
          assertScenarioContract(root, contract.ready, counters)
        },
        assert: (root, counters) => {
          counters.lastRunFieldRenders =
            counters.fieldRenders - fieldRenderStart
          assertScenarioContract(root, contract.afterRun, counters)
        },
      }
    }
    case 'validation-on-change': {
      let validatorRunStart = 0

      return {
        createElement: (counters) => (
          <ValidationForm counters={counters} count={size} />
        ),
        reset: async (root) => {
          setInputValue(getFieldInput(root, targetIndex(size)), VALID_VALUE)
          await waitForBrowserWork()
        },
        run: async (root, counters) => {
          validatorRunStart = counters.validatorRuns
          setInputValue(getFieldInput(root, targetIndex(size)), INVALID_VALUE)
        },
        assertReady: (root, counters) => {
          assertScenarioContract(root, contract.ready, counters)
        },
        assert: (root, counters) => {
          counters.lastRunValidatorRuns =
            counters.validatorRuns - validatorRunStart
          assertScenarioContract(root, contract.afterRun, counters)
        },
      }
    }
    case 'dependent-field-update': {
      let listenerRunStart = 0

      return {
        createElement: (counters) => (
          <DependentFieldsForm counters={counters} count={size} />
        ),
        reset: async (root) => {
          setInputValue(getFieldInput(root, 0), fieldValue(0))
        },
        run: async (root, counters) => {
          listenerRunStart = counters.listenerRuns
          setInputValue(getFieldInput(root, 0), UPDATED_VALUE)
        },
        assertReady: (root, counters) => {
          assertScenarioContract(root, contract.ready, counters)
        },
        assert: (root, counters) => {
          counters.lastRunListenerRuns =
            counters.listenerRuns - listenerRunStart
          assertScenarioContract(root, contract.afterRun, counters)
        },
      }
    }
    case 'array-swap':
      return createArrayScenarioOptions(size, 'swap')
    case 'array-move':
      return createArrayScenarioOptions(size, 'move')
    case 'array-insert-remove':
      return createArrayScenarioOptions(size, 'insert-remove')
    case 'form-group-scoped-validation': {
      let formGroupValidatorRunStart = 0

      return {
        createElement: (counters) => (
          <FormGroupScenario counters={counters} count={size} />
        ),
        reset: async (root) => {
          setInputValue(getGroupInput(root, 0), VALID_VALUE)
          await waitForBrowserWork()
        },
        run: async (root, counters) => {
          formGroupValidatorRunStart = counters.formGroupValidatorRuns
          setInputValue(getGroupInput(root, 0), INVALID_VALUE)
        },
        assertReady: (root, counters) => {
          assertScenarioContract(root, contract.ready, counters)
        },
        assert: (root, counters) => {
          counters.lastRunFormGroupValidatorRuns =
            counters.formGroupValidatorRuns - formGroupValidatorRunStart
          assertScenarioContract(root, contract.afterRun, counters)
        },
      }
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

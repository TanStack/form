import { isConditionMet, selectTriggers } from '../selection.lib'
import type {
  PipelineCondition,
  PipelineSelection,
  PipelineTrigger,
} from '../selection.lib'
import type { ValidatorEvents, ValidatorTriggers } from '../events.public'

type ValidatorCondition = PipelineCondition<any>

export type ValidatorTrigger = PipelineTrigger<ValidatorTriggers, any>

interface ValidatorSelectionContext {
  event: ValidatorEvents
  createPredicateContext?: () => any
}

export interface SelectableValidator {
  triggers?: ReadonlyArray<ValidatorTrigger>
  skipOnSubmit?: ValidatorCondition
}

export function shouldRunValidator(
  validator: SelectableValidator,
  context: ValidatorSelectionContext,
): boolean {
  return selectValidator(validator, context) === 'run'
}

export function selectValidator(
  validator: SelectableValidator,
  context: ValidatorSelectionContext,
): PipelineSelection {
  const createPredicateContext =
    context.event === 'server' ? undefined : context.createPredicateContext
  if (context.event === 'submit') {
    const { skipOnSubmit = false } = validator
    return isConditionMet(skipOnSubmit, createPredicateContext) ? 'skip' : 'run'
  }

  return selectTriggers(
    validator.triggers,
    context.event,
    createPredicateContext,
  )
}

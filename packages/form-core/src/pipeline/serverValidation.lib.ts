import { isErrorResult } from '../validation/errors.lib'
import { runPipeline } from './runPipeline.lib'
import { shouldRunValidator } from './utils.lib'
import { createFormServerValidatorContext } from './validationContext.lib'
import { ValidatorExecutor } from './validatorExecutor.lib'
import type { ValidatorTrigger } from './utils.lib'
import type { ValidatorDefinition } from './validatorExecutor.lib'
import type { PipelineEntry, PipelineResult, PipelineRun } from './state.lib'

interface ServerValidator extends ValidatorDefinition {
  triggers?: ReadonlyArray<ValidatorTrigger>
  bailIfInvalid?: boolean
}

interface ServerValidationInput {
  validators?: ReadonlyArray<ServerValidator> | null
  value: any
  onDeferredResults?: (
    results: Array<PipelineResult<ValidatorExecutor>>,
  ) => void
}

export function runServerValidators({
  validators,
  value,
  onDeferredResults,
}: ServerValidationInput): PipelineRun<ValidatorExecutor> {
  const entries: Array<PipelineEntry<ValidatorExecutor>> = []

  const list = validators ?? []

  for (let i = 0; i < list.length; i++) {
    const validator = list[i]!

    if (!shouldRunValidator(validator, { event: 'server' })) continue

    entries.push({
      instance: new ValidatorExecutor({
        definition: validator,
        validatorScope: 'form',
        index: i,
      }),
      bailIfInvalid: validator.bailIfInvalid,
    })
  }

  return runPipeline({
    entries,
    input: {
      createContext: (definition) =>
        createFormServerValidatorContext(definition, { value }),
    },
    isInvalid: ({ result }) => isErrorResult(result),
    onDeferredResults,
  })
}

import { runPipeline } from '../runPipeline.lib'
import {
  formatValidationResult,
  isErrorResult,
} from '../../validation/results/errors.lib'
import { ValidatorExecutor } from './ValidatorInstance.lib'
import { shouldRunValidator } from './selection.lib'
import { createFormServerValidatorContext } from './validationContext.lib'
import { ValidationResultCollector } from './resultCollection.lib'
import type { ValidatorDefinition } from './ValidatorInstance.lib'
import type { ValidatorTrigger } from './selection.lib'
import type { PipelineEntry, PipelineResult, PipelineRun } from '../state.lib'
import type { FormOptions } from '../../FormApi/formOptions.public'
import type { ServerValidateResult } from '../../FormApi/formServerState.public'

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

// Yes, this is used, but in SSR adapters. Your IDE might not pick up on that.
export async function validateServerValues<
  TFormData,
  const TValidatorConfig extends unknown[],
  TValidators,
  TSubmitReturn,
>(
  options: FormOptions<
    TFormData,
    TValidatorConfig,
    TValidators,
    TSubmitReturn,
    unknown
  >,
  values: TFormData,
): Promise<ServerValidateResult<TFormData, TValidators>> {
  const validators = options.validators
  const validatorCount = validators?.length ?? 0
  const collector = new ValidationResultCollector()
  const run = runServerValidators({
    validators,
    value: values,
    onDeferredResults: collector.collect,
  })
  collector.collect(run.syncResults)
  await run.pending

  if (collector.hasErrors()) {
    return {
      success: false,
      serverState: {
        values,
        validationResults: collector
          .getResults()
          .map(({ instance, value }) => ({
            validatorIndex: instance.index,
            ...value,
            result: formatValidationResult<TFormData>(value.result),
          })),
        submissionAttempts: 1,
      },
    }
  }

  return {
    success: true,
    values,
    validatorOutputs: collector.getOutputs(validatorCount) as any,
  }
}

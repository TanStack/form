import { VALIDATION_OUTPUT, isValidationOutput } from '../validationOutput.lib'
import { BaseInstance } from './baseInstance.lib'
import { isStandardSchema, parseStandardSchema } from './standardSchema.lib'
import { mapResult } from './utils.lib'
import type { Awaitable } from '../types.public'
import type { ValidatorScope } from '../validation.public'
import type { StandardSchemaV1 } from '../standardSchema.public'
import type {
  FieldErrorTarget,
  FormValidationResult,
} from '../validation/state.public'
import type { PipelineInstance, PipelineRun } from './state.lib'

export interface ValidatorDefinition {
  run:
    StandardSchemaV1 | ((context: any) => Awaitable<FormValidationResult<any>>)
  fieldErrorTarget?: FieldErrorTarget
}

export interface ValidatorExecutionResult {
  result: FormValidationResult<any>
  output: unknown
  hasOutput: boolean
}

function executeDefinition(
  definition: ValidatorDefinition,
  context: { value: any },
  { scope }: { scope: ValidatorScope },
): Awaitable<ValidatorExecutionResult> {
  let result
  if (isStandardSchema(definition.run)) {
    result = parseStandardSchema(definition.run, context.value, {
      scope,
      fieldErrorTarget: definition.fieldErrorTarget,
    })
  } else {
    result = definition.run(context)
  }

  return mapResult(result, normalizeValidatorResult)
}

function normalizeValidatorResult(
  result: FormValidationResult<any>,
): ValidatorExecutionResult {
  if (isValidationOutput(result)) {
    return {
      result: null,
      output: result[VALIDATION_OUTPUT],
      hasOutput: true,
    }
  }

  return { result, output: null, hasOutput: false }
}

interface ValidatorRunInput {
  createContext: (
    definition: ValidatorDefinition,
    signal: AbortSignal,
  ) => { value: any }
}

export class ValidatorExecutor<
  TDefinition extends ValidatorDefinition = ValidatorDefinition,
> extends BaseInstance<ValidatorRunInput, ValidatorExecutionResult> {
  definition: TDefinition
  readonly validatorScope: ValidatorScope
  readonly index: number

  constructor({
    definition,
    validatorScope,
    index,
  }: {
    definition: TDefinition
    validatorScope: ValidatorScope
    index: number
  }) {
    super()
    this.definition = definition
    this.validatorScope = validatorScope
    this.index = index
  }

  execute(
    input: ValidatorRunInput,
    signal: AbortSignal,
  ): Awaitable<ValidatorExecutionResult> {
    const definition = this.definition
    const context = input.createContext(definition, signal)
    return executeDefinition(definition, context, {
      scope: this.validatorScope,
    })
  }
}

type ValidationRun = Pick<PipelineRun<PipelineInstance>, 'pending' | 'cancel'>

/**
 * Track validation runs until they seettle or are cancelled.
 *
 * Standalone server validation awaits a single run and does not need this tracker.
 */
export class ValidationRunTracker {
  private readonly runs = new Set<ValidationRun>()

  get hasPending(): boolean {
    return this.runs.size > 0
  }

  track = (run: ValidationRun): void => {
    if (!run.pending || this.runs.has(run)) return

    this.runs.add(run)
    const release = () => {
      this.runs.delete(run)
    }
    void run.pending.then(release, release)
  }

  cancelAll = (): void => {
    const runs = Array.from(this.runs)
    this.runs.clear()

    for (const run of runs) {
      run.cancel()
    }
  }
}

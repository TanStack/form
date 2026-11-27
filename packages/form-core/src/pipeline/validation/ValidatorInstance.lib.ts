import { mapResult } from '../utils.lib'
import {
  VALIDATION_OUTPUT,
  isValidationOutput,
} from '../../validation/results/validationOutput.lib'
import { PipelineInstance } from '../pipelineInstance.lib'
import {
  removeSourceErrors,
  validationSourceScopes,
} from '../../validation/errorStorage.lib'
import { isStandardSchema, parseStandardSchema } from './standardSchema.lib'
import type { StandardSchemaV1 } from '../../validation/results/standardSchema.public'
import type { Awaitable } from '../../types.public'
import type {
  FieldErrorTarget,
  FormValidationResult,
} from '../../validation/results/results.public'
import type {
  FieldValidator,
  FormGroupValidator,
  ValidatorScope,
} from './validation.public'
import type { FormValidator } from './formValidators.public'
import type {
  ValidationErrorSourceState,
  ValidationErrorTarget,
} from '../../validation/errorStorage.lib'
import type { ValidatorEvents } from '../events.public'

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
> extends PipelineInstance<ValidatorRunInput, ValidatorExecutionResult> {
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

type GetDefinition<TScope extends ValidatorScope> = {
  form: FormValidator<any, any>
  group: FormGroupValidator<any>
  field: FieldValidator<any, any, any>
}[TScope]

export type AnyValidatorInstance = ValidatorInstance<any>

export interface ValidatorInstanceOptions<out TScope extends ValidatorScope> {
  owner: unknown
  scope: TScope
  definition: GetDefinition<TScope>
  index?: number
}

/** Stable runtime instances correlated with validator definitions by slot. */
export type ValidatorInstances<TScope extends ValidatorScope> = Array<
  ValidatorInstance<TScope>
> | null

export interface UpdateValidatorInstancesOptions<
  TScope extends ValidatorScope,
> {
  /** The latest validator definitions installed on the owner. */
  definitions: ReadonlyArray<GetDefinition<TScope>> | null | undefined
  /**
   * The definitions installed before an update.
   *
   * Omit during initialization. Pass `null` when updating an owner that
   * previously had no validators.
   */
  previousDefinitions?: ReadonlyArray<GetDefinition<TScope>> | null
  /** The owner's currently installed instances, if it has any. */
  instances: ValidatorInstances<TScope>
  /** The validation boundary that owns every updated instance. */
  owner: unknown
  /** The form, group, or field scope shared by the updated instances. */
  scope: TScope
  /** Cleans owner-specific state before an instance is permanently disposed. */
  onBeforeDispose?: (instance: ValidatorInstance<TScope>) => void
}

/**
 * Runtime state owned by one installed validator occurrence.
 */
export class ValidatorInstance<TScope extends ValidatorScope>
  extends ValidatorExecutor<GetDefinition<TScope>>
  implements ValidationErrorSourceState
{
  /**
   * Updates installed validator instances by slot.
   *
   * Retained slots preserve their instance and receive the latest definition.
   * The definition count must remain constant after initialization.
   * Missing and empty definition collections are normalized to `null`.
   * Updates with a different definition count emit the shared invariant warning.
   */
  static update<TScope extends ValidatorScope>({
    definitions,
    previousDefinitions,
    instances,
    owner,
    scope,
    onBeforeDispose,
  }: UpdateValidatorInstancesOptions<TScope>): ValidatorInstances<TScope> {
    if (
      previousDefinitions !== undefined &&
      (previousDefinitions?.length ?? 0) !== (definitions?.length ?? 0)
    ) {
      console.warn(
        'TanStack Form: The length of the validator array should not change after initialization',
      )
    }

    if (!definitions || definitions.length === 0) {
      instances?.forEach((instance) => {
        instance.dispose(onBeforeDispose)
      })
      return null
    }

    const nextInstances = instances ?? []

    definitions.forEach((definition, index) => {
      const instance = nextInstances[index]

      if (instance) {
        instance.updateDefinition(definition)
      } else {
        nextInstances[index] = new ValidatorInstance<TScope>({
          definition,
          owner,
          scope,
          index,
        })
      }
    })

    return nextInstances
  }

  /** The validation boundary that owns this source. */
  readonly owner: unknown
  /** Numeric priority used to order errors across validation scopes. */
  readonly scope: (typeof validationSourceScopes)[TScope]
  /** Targets currently receiving errors routed from this source. */
  errorTargets: Set<ValidationErrorTarget> | null = null
  lastAppliedEvent: ValidatorEvents | null = null
  /** Whether this source has been permanently disposed. */
  disposed = false
  /** Creates the runtime state for one installed validator occurrence. */
  constructor({
    definition,
    owner,
    scope,
    index = 0,
  }: ValidatorInstanceOptions<TScope>) {
    super({ definition, validatorScope: scope, index })
    this.owner = owner
    this.scope = validationSourceScopes[scope]
  }

  /**
   * Replaces the definition while preserving this instance and its runtime state.
   *
   * The operation is ignored after disposal.
   */
  updateDefinition(definition: GetDefinition<TScope>): void {
    if (this.disposed) return

    this.definition = definition
  }

  /**
   * Clears transient execution and error-target state.
   *
   * The definition, owner, and scope are preserved.
   * The operation is ignored after disposal.
   */
  resetRuntime(): void {
    if (this.disposed) return

    this._resetRuntime()
    removeSourceErrors(this)
  }

  /** Permanently disposes this source and releases its transient state. */
  dispose(onBeforeDispose?: (instance: this) => void): void {
    if (this.disposed) return

    onBeforeDispose?.(this)
    this._disposeRuntime()
    removeSourceErrors(this)
    this.disposed = true
  }

  /** Releases validator-specific runtime state during reset or disposal. */
  protected _resetRuntime(): void {
    this._cancelExecution()
  }

  /** Releases validator-only collections and mount state during disposal. */
  protected _disposeRuntime(): void {
    this._resetRuntime()
  }

  /** Cancels and releases execution resources without checking disposal state. */
  private _cancelExecution(): void {
    this.cancelCurrentExecution?.()
  }
}

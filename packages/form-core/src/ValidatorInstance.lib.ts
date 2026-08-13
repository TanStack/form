import { LiteDebouncer } from '@tanstack/pacer-lite'
import { InternalValidationSourceInstance } from './ValidationSourceInstance.lib'
import type { StandardSchemaV1 } from './standardSchema.public'
import type {
  BaseValidator,
  ValidatorFn,
  ValidatorScope,
} from './validation.public'

export type InternalValidatorDefinition = BaseValidator<
  StandardSchemaV1 | ValidatorFn<any, any>
>

export type ValidatorInstanceDebouncedFn = (...args: Array<any>) => any

export type AnyInternalValidatorInstance<
  TDebouncedFn extends ValidatorInstanceDebouncedFn =
    ValidatorInstanceDebouncedFn,
> = InternalValidatorInstance<any, any, any, any, any, TDebouncedFn>

export interface InternalValidatorInstanceOptions<
  out TDefinition extends InternalValidatorDefinition,
  out TOwner,
> {
  definition: TDefinition
  owner: TOwner
  scope: ValidatorScope
  index?: number
}

/** Stable runtime instances correlated with validator definitions by slot. */
export type InternalValidatorInstances<
  TDefinition extends InternalValidatorDefinition,
  TOwner,
  TErrorTarget = unknown,
  TWatchedField = unknown,
  TSchemaOutput = unknown,
> = Array<
  InternalValidatorInstance<
    TDefinition,
    TOwner,
    TErrorTarget,
    TWatchedField,
    TSchemaOutput
  >
> | null

export interface ReconcileValidatorInstancesOptions<
  TDefinition extends InternalValidatorDefinition,
  TOwner,
  TErrorTarget = unknown,
  TWatchedField = unknown,
  TSchemaOutput = unknown,
> {
  /** The latest validator definitions installed on the owner. */
  definitions: ReadonlyArray<TDefinition> | null | undefined
  /**
   * The definitions installed before an update.
   *
   * Omit during initialization. Pass `null` when updating an owner that
   * previously had no validators.
   */
  previousDefinitions?: ReadonlyArray<TDefinition> | null
  /** The owner's currently installed instances, if it has any. */
  instances: InternalValidatorInstances<
    TDefinition,
    TOwner,
    TErrorTarget,
    TWatchedField,
    TSchemaOutput
  >
  /** The validation boundary that owns every reconciled instance. */
  owner: TOwner
  /** The form, group, or field scope shared by the reconciled instances. */
  scope: ValidatorScope
  /** Cleans owner-specific state before an instance is permanently disposed. */
  onBeforeDispose?: (
    instance: InternalValidatorInstance<
      TDefinition,
      TOwner,
      TErrorTarget,
      TWatchedField,
      TSchemaOutput
    >,
  ) => void
}

/**
 * Runtime state owned by one installed validator occurrence.
 */
export class InternalValidatorInstance<
  TDefinition extends InternalValidatorDefinition,
  TOwner,
  TErrorTarget = unknown,
  TWatchedField = unknown,
  TSchemaOutput = unknown,
  TDebouncedFn extends ValidatorInstanceDebouncedFn =
    ValidatorInstanceDebouncedFn,
> extends InternalValidationSourceInstance<TOwner, TErrorTarget> {
  /** The current validator definition associated with this stable instance. */
  definition: TDefinition
  /** The controller for the active execution, or `null` when none is active. */
  abortController: AbortController | null = null
  /** The lazily created debouncer for this validator's pending execution. */
  debouncer: LiteDebouncer<TDebouncedFn> | null = null
  /**
   * The Standard Schema output assigned by the latest form or group submit.
   *
   * Submit pipelines cancel prior executions and clear this before evaluating
   * their validators. Field and non-submit pipelines do not assign it. Consult
   * `hasSchemaOutput` because `undefined` can itself be a stored output.
   */
  schemaOutput: TSchemaOutput | undefined
  /** Whether the current submit pipeline assigned `schemaOutput`. */
  hasSchemaOutput = false
  /**
   * Resolved fields referenced by this validator's `watchFields` definition.
   *
   * The map is allocated on first use and returns to `null` when empty.
   */
  resolvedWatchFields: Map<string, TWatchedField> | null = null
  /** Whether this occurrence has already run its mount validation. */
  didRunOnMount = false
  /**
   * Number of definition updates applied while preserving this instance.
   *
   * Assigning the same definition again still advances the revision.
   */
  revision = 0
  /** Creates the runtime state for one installed validator occurrence. */
  constructor({
    definition,
    owner,
    scope,
    index,
  }: InternalValidatorInstanceOptions<TDefinition, TOwner>) {
    super({ owner, scope, index })
    this.definition = definition
  }

  /**
   * Replaces the definition while preserving this instance and its runtime state.
   *
   * Every update advances `revision`, including assignment of the same object.
   * The operation is ignored after disposal.
   */
  updateDefinition(definition: TDefinition): void {
    if (this.disposed) return

    this.definition = definition
    this.revision++
  }

  /**
   * Installs the controller for the next active execution.
   *
   * A different previously installed controller is aborted before replacement.
   * Reinstalling the same controller or calling this after disposal has no effect.
   */
  setAbortController(abortController: AbortController): void {
    if (this.disposed) return
    if (this.abortController === abortController) return

    this.abortController?.abort()
    this.abortController = abortController
  }

  /**
   * Clears an active controller only if it is still the installed controller.
   *
   * The identity check prevents completion of an older execution from clearing
   * the controller of a newer one. This method does not abort the controller.
   */
  clearAbortController(abortController: AbortController): void {
    if (this.disposed) return
    if (this.abortController !== abortController) return

    this.abortController = null
  }

  /**
   * Returns this validator's debouncer, creating it on first use.
   *
   * An existing debouncer is reused with its callback and wait duration updated.
   * Returns `null` after disposal.
   */
  getOrCreateDebouncer(
    fn: TDebouncedFn,
    wait: number,
  ): LiteDebouncer<TDebouncedFn> | null {
    if (this.disposed) return null

    let debouncer = this.debouncer
    if (!debouncer) {
      debouncer = new LiteDebouncer(fn, { wait })
      this.debouncer = debouncer
    } else {
      debouncer.fn = fn
      debouncer.options.wait = wait
    }

    return debouncer
  }

  /**
   * Stores a submit pipeline's Standard Schema output when its result has one.
   *
   * A result without a schema output leaves the current state unchanged. An
   * explicit `undefined` is still considered a stored output. The operation is
   * ignored after disposal.
   *
   * @param result - The accepted result produced by the validator pipeline.
   */
  setSchemaOutput(result: {
    schemaResult: TSchemaOutput | null
    hasSchemaResult: boolean
  }): void {
    if (this.disposed || !result.hasSchemaResult) return

    this.schemaOutput = result.schemaResult as TSchemaOutput
    this.hasSchemaOutput = true
  }

  /** Clears the stored schema output and its presence marker. */
  clearSchemaOutput(): void {
    if (this.disposed) return

    this._clearSchemaOutput()
  }

  /**
   * Associates a configured watched-field name with its resolved field.
   *
   * The backing map is allocated lazily, and an existing entry for `name` is
   * replaced. The operation is ignored after disposal.
   */
  setResolvedWatchField(name: string, field: TWatchedField): void {
    if (this.disposed) return

    if (!this.resolvedWatchFields) {
      this.resolvedWatchFields = new Map()
    }
    this.resolvedWatchFields.set(name, field)
  }

  /**
   * Removes a resolved watched field.
   */
  deleteResolvedWatchField(name: string): void {
    if (this.disposed) return

    this.resolvedWatchFields?.delete(name)
    if (this.resolvedWatchFields?.size === 0) {
      this.resolvedWatchFields = null
    }
  }

  /** Marks mount validation as completed for this occurrence. */
  markMountValidationRan(): void {
    if (this.disposed) return

    this.didRunOnMount = true
  }

  /** Allows a lifecycle owner to run mount validation again after remounting. */
  resetMountValidation(): void {
    if (this.disposed) return

    this.didRunOnMount = false
  }

  /**
   * Aborts the active execution and cancels any pending debounced execution.
   *
   * Both execution resources are released. The operation is ignored after
   * disposal.
   */
  cancelExecution(): void {
    if (this.disposed) return

    this._cancelExecution()
  }

  /**
   * Clears transient execution, schema-output, and error-target state.
   *
   * The definition, owner, scope, watched fields, mount marker, and revision are
   * preserved. The operation is ignored after disposal.
   */
  resetRuntime(): void {
    super.resetRuntime()
  }

  /** Releases validator-specific runtime state during reset or disposal. */
  protected override _resetRuntime(): void {
    this._cancelExecution()
    this._clearSchemaOutput()
  }

  /** Releases validator-only collections and mount state during disposal. */
  protected override _disposeRuntime(): void {
    this._resetRuntime()
    this.resolvedWatchFields = null
    this.didRunOnMount = false
  }

  /** Cancels and releases execution resources without checking disposal state. */
  private _cancelExecution(): void {
    this.abortController?.abort()
    this.abortController = null
    this.debouncer?.cancel()
    this.debouncer = null
  }

  /** Clears the schema-output value and presence marker as one operation. */
  private _clearSchemaOutput(): void {
    this.schemaOutput = undefined
    this.hasSchemaOutput = false
  }
}

/**
 * Correlates validator definitions with their stable runtime instances by slot.
 *
 * Retained slots preserve their instance and receive the latest definition.
 * Added slots create instances, while removed slots are permanently disposed.
 * Missing and empty definition collections are normalized to `null`.
 * Updates with a different definition count emit the shared invariant warning.
 */
export function reconcileValidatorInstances<
  TDefinition extends InternalValidatorDefinition,
  TOwner,
  TErrorTarget = unknown,
  TWatchedField = unknown,
  TSchemaOutput = unknown,
>({
  definitions,
  previousDefinitions,
  instances,
  owner,
  scope,
  onBeforeDispose,
}: ReconcileValidatorInstancesOptions<
  TDefinition,
  TOwner,
  TErrorTarget,
  TWatchedField,
  TSchemaOutput
>): InternalValidatorInstances<
  TDefinition,
  TOwner,
  TErrorTarget,
  TWatchedField,
  TSchemaOutput
> {
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
      nextInstances[index] = new InternalValidatorInstance<
        TDefinition,
        TOwner,
        TErrorTarget,
        TWatchedField,
        TSchemaOutput
      >({ definition, owner, scope, index })
    }
  })

  for (let index = definitions.length; index < nextInstances.length; index++) {
    const instance = nextInstances[index]
    if (!instance) continue

    instance.dispose(onBeforeDispose)
  }
  nextInstances.length = definitions.length

  return nextInstances
}

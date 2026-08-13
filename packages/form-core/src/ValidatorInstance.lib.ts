import { LiteDebouncer } from '@tanstack/pacer-lite'
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

export interface InternalValidatorInstanceOptions<
  out TDefinition extends InternalValidatorDefinition,
  out TOwner,
> {
  definition: TDefinition
  owner: TOwner
  scope: ValidatorScope
}

/** Stable runtime instances correlated with validator definitions by slot. */
export type InternalValidatorInstances<
  TDefinition extends InternalValidatorDefinition,
  TOwner,
> = Array<InternalValidatorInstance<TDefinition, TOwner>> | null

export interface ReconcileValidatorInstancesOptions<
  TDefinition extends InternalValidatorDefinition,
  TOwner,
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
  instances: InternalValidatorInstances<TDefinition, TOwner>
  /** The validation boundary that owns every reconciled instance. */
  owner: TOwner
  /** The form, group, or field scope shared by the reconciled instances. */
  scope: ValidatorScope
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
> {
  /** The validation boundary that owns this installed validator occurrence. */
  readonly owner: TOwner
  /** The form, group, or field scope in which the validator executes. */
  readonly scope: ValidatorScope

  /** The current validator definition associated with this stable instance. */
  definition: TDefinition
  /** The controller for the active execution, or `null` when none is active. */
  abortController: AbortController | null = null
  /** The lazily created debouncer for this validator's pending execution. */
  debouncer: LiteDebouncer<TDebouncedFn> | null = null
  /**
   * The most recently stored Standard Schema output.
   *
   * Consult `hasSchemaOutput` because `undefined` can itself be a stored output.
   */
  schemaOutput: TSchemaOutput | undefined
  /** Whether `schemaOutput` has been assigned, including to `undefined`. */
  hasSchemaOutput = false
  /**
   * Targets currently receiving errors routed from this validator.
   *
   * The set is allocated on first use and returns to `null` when empty.
   */
  errorTargets: Set<TErrorTarget> | null = null
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
  /**
   * Whether this instance has been permanently disposed.
   *
   * Mutation helpers become no-ops after disposal.
   */
  disposed = false

  /** Creates the runtime state for one installed validator occurrence. */
  constructor({
    definition,
    owner,
    scope,
  }: InternalValidatorInstanceOptions<TDefinition, TOwner>) {
    this.definition = definition
    this.owner = owner
    this.scope = scope
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
   * Stores the latest Standard Schema output and marks it as present.
   *
   * An explicit `undefined` is still considered a stored output. The operation
   * is ignored after disposal.
   *
   * @param schemaOutput - The output produced by the validator's schema.
   */
  setSchemaOutput(schemaOutput: TSchemaOutput): void {
    if (this.disposed) return

    this.schemaOutput = schemaOutput
    this.hasSchemaOutput = true
  }

  /** Clears the stored schema output and its presence marker. */
  clearSchemaOutput(): void {
    if (this.disposed) return

    this._clearSchemaOutput()
  }

  /**
   * Records a target receiving errors from this validator.
   *
   * The backing set is allocated lazily. The operation is ignored after disposal.
   *
   * @param errorTarget - The target receiving routed validation errors.
   */
  addErrorTarget(errorTarget: TErrorTarget): void {
    if (this.disposed) return

    if (!this.errorTargets) {
      this.errorTargets = new Set()
    }
    this.errorTargets.add(errorTarget)
  }

  /**
   * Stops tracking an error target.
   *
   * @param errorTarget - The target whose routed-error association is removed.
   */
  deleteErrorTarget(errorTarget: TErrorTarget): void {
    if (this.disposed) return

    this.errorTargets?.delete(errorTarget)
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
  }

  /** Marks mount validation as completed for this occurrence. */
  markMountValidationRan(): void {
    if (this.disposed) return

    this.didRunOnMount = true
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
    if (this.disposed) return

    this._cancelExecution()
    this._clearSchemaOutput()
    this.errorTargets = null
  }

  /**
   * Permanently disposes this validator occurrence and its runtime resources.
   *
   * Disposal cancels execution, releases outputs and collections, clears the
   * mount marker, and is idempotent. Mutation helpers subsequently become no-ops.
   */
  dispose(): void {
    if (this.disposed) return

    this._cancelExecution()
    this._clearSchemaOutput()
    this.errorTargets = null
    this.resolvedWatchFields = null
    this.didRunOnMount = false
    this.disposed = true
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
>({
  definitions,
  previousDefinitions,
  instances,
  owner,
  scope,
}: ReconcileValidatorInstancesOptions<
  TDefinition,
  TOwner
>): InternalValidatorInstances<TDefinition, TOwner> {
  if (
    previousDefinitions !== undefined &&
    (previousDefinitions?.length ?? 0) !== (definitions?.length ?? 0)
  ) {
    console.warn(
      'TanStack Form: The length of the validator array should not change after initialization',
    )
  }

  if (!definitions || definitions.length === 0) {
    instances?.forEach((instance) => instance.dispose())
    return null
  }

  const nextInstances = instances ?? []

  definitions.forEach((definition, index) => {
    const instance = nextInstances[index]

    if (instance) {
      instance.updateDefinition(definition)
    } else {
      nextInstances[index] = new InternalValidatorInstance({
        definition,
        owner,
        scope,
      })
    }
  })

  for (let index = definitions.length; index < nextInstances.length; index++) {
    nextInstances[index]?.dispose()
  }
  nextInstances.length = definitions.length

  return nextInstances
}

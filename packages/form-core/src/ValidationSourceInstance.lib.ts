import type { ValidatorScope } from './validation.public'

/** Internal validation sources ordered by their contribution to derived errors. */
export const validationSourceScopes = {
  field: 0,
  group: 1,
  form: 2,
  onSubmit: 3,
} as const

export type InternalValidationSourceScope = ValidatorScope | 'onSubmit'

export type InternalValidationSourceScopePriority =
  (typeof validationSourceScopes)[InternalValidationSourceScope]

export interface InternalValidationSourceInstanceOptions<out TOwner> {
  owner: TOwner
  scope: InternalValidationSourceScope
  index?: number
}

export type AnyInternalValidationSourceInstance =
  InternalValidationSourceInstance<any, any>

/** Stable identity and ordering metadata for one internal validation source. */
export class InternalValidationSourceInstance<TOwner, TErrorTarget = unknown> {
  /** The validation boundary that owns this source. */
  readonly owner: TOwner
  /** Numeric priority used to order errors across validation scopes. */
  readonly scope: InternalValidationSourceScopePriority
  /** This source's position within its scope's validation pipeline. */
  readonly index: number
  /** Targets currently receiving errors routed from this source. */
  errorTargets: Set<TErrorTarget> | null = null
  /** Whether this source has been permanently disposed. */
  disposed = false

  /** Creates a stable source with fixed ownership and ordering metadata. */
  constructor({
    owner,
    scope,
    index = 0,
  }: InternalValidationSourceInstanceOptions<TOwner>) {
    this.owner = owner
    this.scope = validationSourceScopes[scope]
    this.index = index
  }

  /** Records a target receiving errors from this source. */
  addErrorTarget(errorTarget: TErrorTarget): void {
    if (this.disposed) return

    if (!this.errorTargets) {
      this.errorTargets = new Set()
    }
    this.errorTargets.add(errorTarget)
  }

  /** Stops tracking a target that no longer receives errors from this source. */
  deleteErrorTarget(errorTarget: TErrorTarget): void {
    if (this.disposed) return

    this.errorTargets?.delete(errorTarget)
    if (this.errorTargets?.size === 0) {
      this.errorTargets = null
    }
  }

  /** Clears transient state while preserving this source's stable identity. */
  resetRuntime(): void {
    if (this.disposed) return

    this._resetRuntime()
    this.errorTargets = null
  }

  /** Permanently disposes this source and releases its transient state. */
  dispose(onBeforeDispose?: (instance: this) => void): void {
    if (this.disposed) return

    onBeforeDispose?.(this)
    this._disposeRuntime()
    this.errorTargets = null
    this.disposed = true
  }

  /** Releases source-specific transient state before common state is cleared. */
  protected _resetRuntime(): void {}

  /** Releases source-specific permanent state during disposal. */
  protected _disposeRuntime(): void {
    this._resetRuntime()
  }
}

/** Orders sources first by scope priority and then by pipeline position. */
export function compareValidationSources(
  left: AnyInternalValidationSourceInstance,
  right: AnyInternalValidationSourceInstance,
): number {
  if (left.scope === right.scope) {
    return left.index - right.index
  }
  return left.scope - right.scope
}

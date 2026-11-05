/** Error ordering priority: field, group, form, then onSubmit. */
export type ValidationInstanceScopePriority = 0 | 1 | 2 | 3

/** Shared contract for executing and non-executing validation sources. */
export interface ValidationInstance<TOwner, TErrorTarget = unknown> {
  /** The field, group, or form that owns this source. */
  readonly owner: TOwner
  /** Numeric priority used to order errors across validation scopes. */
  readonly scope: ValidationInstanceScopePriority
  /** Original position within the owning scope, used to order its errors. */
  readonly index: number
  /** Targets currently storing this source's errors, or `null` when empty. */
  errorTargets: Set<TErrorTarget> | null
  /** Whether this source has been permanently disposed. */
  disposed: boolean
  /** Records a target receiving errors from this source. */
  addErrorTarget(errorTarget: TErrorTarget): void
  /** Removes a target reference once it no longer stores this source's errors. */
  deleteErrorTarget(errorTarget: TErrorTarget): void
  /** Releases transient state and target references while preserving identity. */
  resetRuntime(): void
  /** Permanently releases source state, calling `onBeforeDispose` before cleanup. */
  dispose(onBeforeDispose?: (instance: this) => void): void
}

/** Records an error target unless the validation instance has been disposed. */
export function addValidationErrorTarget<TErrorTarget>(
  instance: ValidationInstance<unknown, TErrorTarget>,
  errorTarget: TErrorTarget,
): void {
  if (instance.disposed) return

  if (!instance.errorTargets) {
    instance.errorTargets = new Set()
  }
  instance.errorTargets.add(errorTarget)
}

/** Removes a target unless disposed and resets an empty target set to `null`. */
export function deleteValidationErrorTarget<TErrorTarget>(
  instance: ValidationInstance<unknown, TErrorTarget>,
  errorTarget: TErrorTarget,
): void {
  if (instance.disposed) return

  instance.errorTargets?.delete(errorTarget)
  if (instance.errorTargets?.size === 0) {
    instance.errorTargets = null
  }
}

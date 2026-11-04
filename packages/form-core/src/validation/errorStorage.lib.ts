import { batch, createAtom } from '@tanstack/store'
import { evaluate } from '../utils.lib'
import { sortValidationSources } from '../pipeline/utils.lib'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type { ValidatorEvents } from '../events.public'
import type { InternalValidationSourceScopePriority } from '../ValidationSourceInstance.lib'
import type { ValidationIssue } from './state.public'

/** Storage and ordering state shared by executing and non-executing sources. */
export interface ValidationErrorSource {
  readonly scope: InternalValidationSourceScopePriority
  readonly index: number
  lastAppliedEvent: ValidatorEvents | null
  errorTargets: Set<ValidationErrorTarget> | null
}

/** A stable field or form-root identity, independent of its current path. */
export interface ValidationErrorTarget {
  readonly _errorStore: ValidationErrorStore
}

type SourceErrorMap = Map<ValidationErrorSource, ReadonlyArray<ValidationIssue>>

/**
 * Takes a target off the source's list once the source has no errors there.
 * Otherwise, replacing or clearing its errors would keep checking that target
 * for no reason. Leaves the source's last applied event unchanged.
 */
function unlinkErrorTarget(
  source: ValidationErrorSource,
  target: ValidationErrorTarget,
): void {
  source.errorTargets?.delete(target)
  if (source.errorTargets?.size === 0) {
    source.errorTargets = null
  }
}

/**
 * Clear the errors at this target.
 * @returns `true` if the target's map changed.
 */
function clearSourceErrorsAtTarget(
  target: ValidationErrorTarget,
  source: ValidationErrorSource,
): boolean {
  return setSourceErrors(target, source, null)
}

/** Owns the local error state independently of field metadata. */
export class ValidationErrorStore {
  readonly _target: ValidationErrorTarget
  _cachedErrors: Array<ValidationIssue> | null = null

  readonly atom: ReadonlyAtom<ReadonlyMap<
    ValidationErrorSource,
    ReadonlyArray<ValidationIssue>
  > | null>

  constructor(target: ValidationErrorTarget) {
    this._target = target
    this.atom = createAtom<SourceErrorMap | null>(null)
  }

  /** Publishes a map prepared by the source operations in this module. */
  _setErrorMap(sourceErrors: SourceErrorMap | null): void {
    this._cachedErrors = null
    // We know the atom is mutable, but users shouldn't do that externally.
    const writableAtom = this.atom as Atom<SourceErrorMap | null>
    writableAtom.set(sourceErrors)
  }

  get errors(): Array<ValidationIssue> {
    // Read even when cached so computed consumers retain their dependency.
    const sourceErrors = this.atom.get()

    if (this._cachedErrors === null) {
      this._cachedErrors = sourceErrors
        ? sortValidationSources(sourceErrors.keys()).flatMap((source) =>
            sourceErrors.get(source)!,
          )
        : []
    }
    return this._cachedErrors
  }

  get hasErrors(): boolean {
    return this.atom.get() !== null
  }

  /**
   * Removes mount, server, and submit contributions permitted by the caller.
   * Callers choose when to run cleanup and which sources can be cleared.
   */
  clearStaleErrors(
    canClearSource: (source: ValidationErrorSource) => boolean,
  ): Set<ValidationErrorTarget> {
    const errorMap = this.atom.get()
    const affectedTargets = new Set<ValidationErrorTarget>()
    if (!errorMap) return affectedTargets

    let next: SourceErrorMap | null = null
    for (const source of errorMap.keys()) {
      const event = source.lastAppliedEvent
      if (
        (event !== 'mount' && event !== 'server' && event !== 'submit') ||
        !canClearSource(source)
      ) {
        continue
      }

      next ??= new Map(errorMap)
      next.delete(source)
    }
    if (!next) return affectedTargets

    batch(() => {
      for (const source of errorMap.keys()) {
        if (!next.has(source)) {
          unlinkErrorTarget(source, this._target)
        }
      }
      this._setErrorMap(next.size > 0 ? next : null)
      affectedTargets.add(this._target)
    })
    return affectedTargets
  }

  /** Clears this target without changing contributions at other targets. */
  clearTargetErrors(): Set<ValidationErrorTarget> {
    const errorMap = this.atom.get()
    const affectedTargets = new Set<ValidationErrorTarget>()
    if (!errorMap) return affectedTargets

    batch(() => {
      for (const source of errorMap.keys()) {
        unlinkErrorTarget(source, this._target)
      }
      this._setErrorMap(null)
      affectedTargets.add(this._target)
    })
    return affectedTargets
  }
}

/**
 * Updates one map entry; callers maintain reverse links inside the same batch.
 *
 * @returns `true` if the target's map changed.
 */
function setSourceErrors(
  target: ValidationErrorTarget,
  source: ValidationErrorSource,
  errors: Array<ValidationIssue> | null,
): boolean {
  const errorMap = target._errorStore.atom.get()
  const previous = errorMap?.get(source)
  if (errors ? previous && evaluate(previous, errors) : !previous) {
    return false
  }

  const next = new Map(errorMap)
  if (errors) {
    next.set(source, errors)
  } else {
    next.delete(source)
  }
  target._errorStore._setErrorMap(next.size > 0 ? next : null)
  return true
}

/** Replaces a source's complete contribution, including omitted old targets. */
export function replaceSourceErrors(
  source: ValidationErrorSource,
  event: ValidatorEvents,
  contributions: Iterable<
    readonly [ValidationErrorTarget, ReadonlyArray<ValidationIssue>]
  >,
): Set<ValidationErrorTarget> {
  const nextContributions = new Map<
    ValidationErrorTarget,
    Array<ValidationIssue>
  >()
  for (const [target, errors] of contributions) {
    if (errors.length === 0) continue

    const previous = nextContributions.get(target)
    nextContributions.set(
      target,
      previous ? previous.concat(errors) : errors.slice(),
    )
  }

  const affectedTargets = new Set<ValidationErrorTarget>()
  batch(() => {
    for (const target of source.errorTargets ?? []) {
      if (!nextContributions.has(target)) {
        const wasChanged = clearSourceErrorsAtTarget(target, source)
        if (wasChanged) {
          affectedTargets.add(target)
        }
      }
    }
    for (const [target, errors] of nextContributions) {
      const wasChanged = setSourceErrors(target, source, errors)
      if (wasChanged) {
        affectedTargets.add(target)
      }
    }

    source.lastAppliedEvent = event
    if (nextContributions.size > 0) {
      source.errorTargets = new Set(nextContributions.keys())
    } else {
      source.errorTargets = null
    }
  })
  return affectedTargets
}

/** Clears every contribution of a removed source. */
export function removeSourceErrors(
  source: ValidationErrorSource,
): Set<ValidationErrorTarget> {
  const affectedTargets = new Set<ValidationErrorTarget>()
  batch(() => {
    for (const target of source.errorTargets ?? []) {
      const wasChanged = clearSourceErrorsAtTarget(target, source)
      if (wasChanged) {
        affectedTargets.add(target)
      }
    }
    source.errorTargets = null
    source.lastAppliedEvent = null
  })
  return affectedTargets
}

import { batch, createAtom } from '@tanstack/store'
import { evaluate } from '../utils.lib'
import type { ValidatorEvents } from '../pipeline/events.public'
import type { ValidatorInstance } from '../pipeline/validation/ValidatorInstance.lib'
import type { ValidationIssue } from './results/results.public'
import type { Atom, ReadonlyAtom } from '@tanstack/store'

/** Validation sources ordered by their contribution to derived errors. */
export const validationSourceScopes = {
  field: 0,
  group: 1,
  form: 2,
  onSubmit: 3,
} as const

export type ValidationErrorSourceScope = keyof typeof validationSourceScopes

export type ValidationErrorSourceScopePriority =
  (typeof validationSourceScopes)[ValidationErrorSourceScope]

/** Storage and ordering state shared by executing and non-executing sources. */
export interface ValidationErrorSourceState {
  readonly scope: ValidationErrorSourceScopePriority
  readonly index: number
  lastAppliedEvent: ValidatorEvents | null
  errorTargets: Set<ValidationErrorTarget> | null
}

/** Error sources narrowed by their numeric scope. */
export type ValidationErrorSource =
  | ValidatorInstance<'field'>
  | ValidatorInstance<'group'>
  | ValidatorInstance<'form'>
  | OnSubmitErrorSource

/** Stable source for errors returned directly by the form's `onSubmit`. */
export class OnSubmitErrorSource implements ValidationErrorSourceState {
  readonly scope = validationSourceScopes.onSubmit
  readonly index = 0
  errorTargets: Set<ValidationErrorTarget> | null = null
  lastAppliedEvent: ValidatorEvents | null = null

  /** Clears stored errors while preserving this source's identity. */
  resetRuntime(): void {
    removeSourceErrors(this)
  }
}

/** A stable field or form-root identity, independent of its current path. */
export interface ValidationErrorTarget {
  readonly _errorStore: ValidationErrorStore
}

type SourceErrorMap = Map<ValidationErrorSource, ReadonlyArray<ValidationIssue>>

export type ValidationErrorStoreState = ReadonlyMap<
  ValidationErrorSource,
  ReadonlyArray<ValidationIssue>
> | null

interface ValidationErrorStoreOptions {
  target: ValidationErrorTarget
  onChange?: (hadErrors: boolean, hasErrors: boolean) => void
}

/** Returns a copy ordered by numeric scope priority, then original index. */
export function sortValidationSources<
  TSource extends Pick<ValidationErrorSource, 'scope' | 'index'>,
>(sources: Iterable<TSource>): Array<TSource> {
  return Array.from(sources).sort((left, right) => {
    if (left.scope === right.scope) {
      return left.index - right.index
    }
    return left.scope - right.scope
  })
}

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
  source: ValidationErrorSourceState,
): boolean {
  const errorMap = target._errorStore.atom.get()
  if (!errorMap) return false

  const next = new Map(errorMap)
  // Removal only needs source identity; stored keys retain their scope types.
  const sources: Map<
    ValidationErrorSourceState,
    ReadonlyArray<ValidationIssue>
  > = next
  if (!sources.delete(source)) return false

  target._errorStore._setErrorMap(next.size > 0 ? next : null)
  return true
}

/** Owns the local error state independently of field metadata. */
export class ValidationErrorStore {
  readonly _target: ValidationErrorTarget
  _cachedErrors: Array<ValidationIssue> | null = null
  private readonly onChange: ValidationErrorStoreOptions['onChange']

  readonly atom: ReadonlyAtom<ValidationErrorStoreState>

  constructor({ target, onChange }: ValidationErrorStoreOptions) {
    this._target = target
    this.onChange = onChange
    this.atom = createAtom<SourceErrorMap | null>(null)
  }

  /** Publishes a map prepared by the source operations in this module. */
  _setErrorMap(sourceErrors: SourceErrorMap | null): void {
    const hadErrors = this.hasErrors
    this._cachedErrors = null
    // We know the atom is mutable, but users shouldn't do that externally.
    const writableAtom = this.atom as Atom<SourceErrorMap | null>
    batch(() => {
      writableAtom.set(sourceErrors)
      this._notifyChange(hadErrors)
    })
  }

  _notifyChange(hadErrors = this.hasErrors): void {
    this.onChange?.(hadErrors, this.hasErrors)
  }

  get errors(): Array<ValidationIssue> {
    // Read even when cached so computed consumers retain their dependency.
    const sourceErrors = this.atom.get()

    if (this._cachedErrors === null) {
      if (sourceErrors) {
        this._cachedErrors = sortValidationSources(sourceErrors.keys()).flatMap(
          (source) => sourceErrors.get(source)!,
        )
      } else {
        this._cachedErrors = []
      }
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
  ): void {
    const errorMap = this.atom.get()
    if (!errorMap) return

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
    if (!next) return

    batch(() => {
      for (const source of errorMap.keys()) {
        if (!next.has(source)) {
          unlinkErrorTarget(source, this._target)
        }
      }
      this._setErrorMap(next.size > 0 ? next : null)
    })
  }

  /** Clears this target without changing contributions at other targets. */
  clearTargetErrors(): void {
    const errorMap = this.atom.get()
    if (!errorMap) return

    batch(() => {
      for (const source of errorMap.keys()) {
        unlinkErrorTarget(source, this._target)
      }
      this._setErrorMap(null)
    })
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
  const eventChanged = source.lastAppliedEvent !== event
  batch(() => {
    source.lastAppliedEvent = event
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
      } else if (eventChanged) {
        target._errorStore._notifyChange()
      }
    }

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
  source: ValidationErrorSourceState,
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

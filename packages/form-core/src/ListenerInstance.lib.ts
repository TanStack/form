import { LiteDebouncer } from '@tanstack/pacer-lite'
import type { AnyFieldListener, AnyFormListener } from './listeners.public'

export type InternalListenerDefinition = AnyFormListener | AnyFieldListener

export type ListenerInstanceDebouncedFn = (...args: Array<any>) => any

export type AnyInternalListenerInstance<
  TDebouncedFn extends ListenerInstanceDebouncedFn =
    ListenerInstanceDebouncedFn,
> = InternalListenerInstance<any, any, any, TDebouncedFn>

export type InternalListenerInstances<
  TDefinition extends InternalListenerDefinition,
  TOwner,
  TWatchedField = unknown,
> = Array<InternalListenerInstance<TDefinition, TOwner, TWatchedField>> | null

export interface ReconcileListenerInstancesOptions<
  TDefinition extends InternalListenerDefinition,
  TOwner,
  TWatchedField = unknown,
> {
  definitions: ReadonlyArray<TDefinition> | null | undefined
  previousDefinitions?: ReadonlyArray<TDefinition> | null
  instances: InternalListenerInstances<TDefinition, TOwner, TWatchedField>
  owner: TOwner
  onBeforeDispose?: (
    instance: InternalListenerInstance<TDefinition, TOwner, TWatchedField>,
  ) => void
}

/** Runtime state owned by one installed listener occurrence. */
export class InternalListenerInstance<
  TDefinition extends InternalListenerDefinition,
  TOwner,
  TWatchedField = unknown,
  TDebouncedFn extends ListenerInstanceDebouncedFn =
    ListenerInstanceDebouncedFn,
> {
  /** The boundary that owns this listener. */
  readonly owner: TOwner
  /** This listener's stable position within its owner's listener pipeline. */
  readonly index: number
  /** The current listener definition associated with this stable instance. */
  definition: TDefinition
  /** The lazily created debouncer for this listener's pending execution. */
  debouncer: LiteDebouncer<TDebouncedFn> | null = null
  /** Resolved fields referenced by this listener's `watchFields` definition. */
  resolvedWatchFields: Map<string, TWatchedField> | null = null
  /** Number of definition updates applied while preserving this instance. */
  revision = 0
  /** Whether this listener has been permanently disposed. */
  disposed = false

  constructor({
    definition,
    owner,
    index = 0,
  }: {
    definition: TDefinition
    owner: TOwner
    index?: number
  }) {
    this.definition = definition
    this.owner = owner
    this.index = index
  }

  /** Replaces the definition while preserving this instance and runtime state. */
  updateDefinition(definition: TDefinition): void {
    if (this.disposed) return

    this.definition = definition
    this.revision++
  }

  /** Returns this listener's debouncer, creating it on first use. */
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

  /** Associates a configured watched-field name with its resolved field. */
  setResolvedWatchField(name: string, field: TWatchedField): void {
    if (this.disposed) return

    if (!this.resolvedWatchFields) {
      this.resolvedWatchFields = new Map()
    }
    this.resolvedWatchFields.set(name, field)
  }

  /** Removes a resolved watched field. */
  deleteResolvedWatchField(name: string): void {
    if (this.disposed) return

    this.resolvedWatchFields?.delete(name)
    if (this.resolvedWatchFields?.size === 0) {
      this.resolvedWatchFields = null
    }
  }

  /** Cancels transient execution while preserving identity and dependencies. */
  resetRuntime(): void {
    if (this.disposed) return

    this.debouncer?.cancel()
    this.debouncer = null
  }

  /** Permanently disposes this listener and releases its runtime state. */
  dispose(onBeforeDispose?: (instance: this) => void): void {
    if (this.disposed) return

    onBeforeDispose?.(this)
    this.resetRuntime()
    this.resolvedWatchFields = null
    this.disposed = true
  }
}

/** Correlates listener definitions with stable runtime instances by slot. */
export function reconcileListenerInstances<
  TDefinition extends InternalListenerDefinition,
  TOwner,
  TWatchedField = unknown,
>({
  definitions,
  previousDefinitions,
  instances,
  owner,
  onBeforeDispose,
}: ReconcileListenerInstancesOptions<
  TDefinition,
  TOwner,
  TWatchedField
>): InternalListenerInstances<TDefinition, TOwner, TWatchedField> {
  if (
    previousDefinitions !== undefined &&
    (previousDefinitions?.length ?? 0) !== (definitions?.length ?? 0)
  ) {
    console.warn(
      'TanStack Form: The length of the listener array should not change after initialization',
    )
  }

  if (!definitions || definitions.length === 0) {
    instances?.forEach((instance) => instance.dispose(onBeforeDispose))
    return null
  }

  const nextInstances = instances ?? []

  definitions.forEach((definition, index) => {
    const instance = nextInstances[index]

    if (instance) {
      instance.updateDefinition(definition)
    } else {
      nextInstances[index] = new InternalListenerInstance({
        definition,
        owner,
        index,
      })
    }
  })

  for (let index = definitions.length; index < nextInstances.length; index++) {
    nextInstances[index]?.dispose(onBeforeDispose)
  }
  nextInstances.length = definitions.length

  return nextInstances
}

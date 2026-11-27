import { PipelineInstance } from '../pipelineInstance.lib'
import type { AnyFormListener } from './formListeners.public'
import type { AnyFieldListener } from './listeners.public'
import type { ListenerContext } from './listenerContext.lib'
import type { Awaitable } from '../../types.public'

export type ListenerDefinition = AnyFormListener | AnyFieldListener

type ListenerScope = 'form' | 'field'

type GetDefinition<TScope extends ListenerScope> = {
  form: AnyFormListener
  field: AnyFieldListener
}[TScope]

interface ListenerRunInput {
  createContext: (signal: AbortSignal) => ListenerContext
}

export type AnyListenerInstance = ListenerInstance<any>

export type ListenerInstances<TScope extends ListenerScope> = Array<
  ListenerInstance<TScope>
> | null

export interface UpdateListenerInstancesOptions<TScope extends ListenerScope> {
  definitions: ReadonlyArray<GetDefinition<TScope>> | null | undefined
  previousDefinitions?: ReadonlyArray<GetDefinition<TScope>> | null
  instances: ListenerInstances<TScope>
  scope: TScope
  onBeforeDispose?: (instance: ListenerInstance<TScope>) => void
}

/** Runtime state owned by one installed listener occurrence. */
export class ListenerInstance<
  TScope extends ListenerScope,
> extends PipelineInstance<ListenerRunInput, void> {
  /** Updates installed listener instances by slot. */
  static update<TScope extends ListenerScope>({
    definitions,
    previousDefinitions,
    instances,
    scope,
    onBeforeDispose,
  }: UpdateListenerInstancesOptions<TScope>): ListenerInstances<TScope> {
    if (
      previousDefinitions &&
      previousDefinitions.length !== (definitions?.length ?? 0)
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
        nextInstances[index] = new ListenerInstance<TScope>({
          definition,
          scope,
        })
      }
    })

    return nextInstances
  }

  /** The current listener definition associated with this stable instance. */
  definition: GetDefinition<TScope>
  /** Whether this listener has been permanently disposed. */
  disposed = false

  constructor({
    definition,
  }: {
    definition: GetDefinition<TScope>
    scope: TScope
  }) {
    super()
    this.definition = definition
  }

  /** Replaces the definition while preserving this instance and runtime state. */
  updateDefinition(definition: GetDefinition<TScope>): void {
    if (this.disposed) return

    this.definition = definition
  }

  execute(input: ListenerRunInput, signal: AbortSignal): Awaitable<void> {
    if (this.disposed || signal.aborted) return

    const definition = this.definition
    const context = input.createContext(signal)
    return definition.run(context as never)
  }

  /** Cancels transient execution while preserving identity and dependencies. */
  resetRuntime(): void {
    if (this.disposed) return

    this.cancelCurrentExecution?.()
  }

  /** Permanently disposes this listener and releases its runtime state. */
  dispose(onBeforeDispose?: (instance: this) => void): void {
    if (this.disposed) return

    onBeforeDispose?.(this)
    this.resetRuntime()
    this.disposed = true
  }
}

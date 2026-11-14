import type { PipelineInstance } from './pipelineInstance.lib'
import type { Awaitable } from '../types.public'

type InputOf<TInstance extends PipelineInstance> =
  TInstance extends PipelineInstance<infer TInput, any> ? TInput : never

type ResultOf<TInstance extends PipelineInstance> =
  TInstance extends PipelineInstance<any, infer TResult> ? TResult : never

type TryGetFunctionType<TInstance extends PipelineInstance> =
  TInstance extends unknown ? (input: InputOf<TInstance>) => void : never

// A shared input must satisfy every instance; one instance may accept a union.
export type PipelineInput<TInstance extends PipelineInstance> =
  TryGetFunctionType<TInstance> extends (input: infer TInput) => void
    ? TInput
    : never

export type PipelineOutput<TInstance extends PipelineInstance> =
  ResultOf<TInstance>

export interface PipelineEntry<TInstance extends PipelineInstance> {
  // this intersection might not be needed. Doesn't hurt, so oh well.
  instance: TInstance &
    PipelineInstance<PipelineInput<TInstance>, PipelineOutput<TInstance>>
  /** Delay in milliseconds before execution; omitted means no delay. */
  debounceMs?: number
  /** Wait for earlier tasks, then skip this entry if the run is invalid. */
  bailIfInvalid?: boolean
  /** Preparation errored. settle at this position without starting a task. */
  preparationFailure?: { error: unknown }
}

export interface PipelineResult<TInstance extends PipelineInstance> {
  /** Instance that produced this result, retaining its concrete type. */
  instance: TInstance
  /** Normalized value returned by the instance's execute method. */
  value: PipelineOutput<TInstance>
}

export interface PipelineOptions<TInstance extends PipelineInstance> {
  /** Whether tasks replace the instance's current execution.
   * @default true
   */
  supersede?: boolean
  /**
   * - It was cancelled
   * - A new task superceded it
   *
   * this does NOT include failure cleanup.
   */
  onCancel?: () => void
  /** Provides run and instance cancellation before dependencies or entries execute. */
  onStart?: (
    cancel: () => void,
    cancelInstances: (instances: ReadonlySet<PipelineInstance>) => void,
  ) => void
  /** Input passed to every instance when its task executes. */
  input: PipelineInput<TInstance>
  /** Ordered entries to process, including their debounce and bail settings. */
  entries: ReadonlyArray<PipelineEntry<TInstance>>
  /** Earlier validation's invalidity; awaited only at bail boundaries. */
  upstreamInvalid?: Awaitable<boolean>
  /**
   * Classifies results for subsequent `bailIfInvalid` checks.
   *
   * @returns `true` when this result is invalid and later flagged entries should
   * be skipped; `false` when it adds no invalidity to the run.
   */
  isInvalid?: (result: PipelineOutput<TInstance>) => boolean
  /** Receives result batches after the initial entry loop yields. */
  onDeferredResults?: (results: Array<PipelineResult<TInstance>>) => void
  /** Called synchronously when a bail decision skips an entry. */
  onSkip?: (instance: TInstance) => void
}

export interface PipelineRun<TInstance extends PipelineInstance> {
  /** Results collected before runPipeline returns; later results use onDeferredResults. */
  syncResults: Array<PipelineResult<TInstance>>
  /**
   * Pending work for deferred stuff or failures if present. Otherwise `null`.
   */
  pending: Promise<void> | null
  /** Whether work is unfinished when the starter returns, independent of failure. */
  hasPendingWork: boolean
  /** Cancels this run and suppresses results from its unfinished tasks. */
  cancel: () => void
  /** Cancels only these instances' queued and unfinished tasks in this run. */
  cancelInstances: (instances: ReadonlySet<PipelineInstance>) => void
}

export interface PipelineState<
  TInstance extends PipelineInstance,
> extends PipelineOptions<TInstance> {
  /** Initial synchronous batch; resumed loops publish separate batches. */
  syncResults: Array<PipelineResult<TInstance>>
  /** This run's unfinished or debounced tasks. */
  pendingTasks: Set<TaskState<TInstance>>
  cancelledInstances: Set<PipelineInstance> | null
  /** Index of the next entry, held in place while a bail check waits. */
  nextEntryIndex: number
  /** Whether this run may still start tasks or accept results. */
  active: boolean
  /** True while the entry loop runs; defers progress checks until it finishes. */
  processingEntries: boolean
  /** True until an upstream promise settles; separate from local tasks. */
  hasPendingUpstream: boolean
  /** True after upstream invalidity, an invalid result, or occurrence failure. */
  hasInvalidResult: boolean
  /** Original exceptions from active occurrences, without successful results. */
  errors: Array<unknown>
  /** Completion promise, created when work is deferred or an occurrence fails. */
  pending: Promise<void> | null
  /** Resolves the wrapper promise; `undefined` until that promise is created. */
  resolvePending: (() => void) | undefined
  /** Rejects pending with an error; `undefined` until the promise is created. */
  rejectPending: ((error: unknown) => void) | undefined
}

export interface TaskState<TInstance extends PipelineInstance> {
  /** Execution bookkeeping for the run that owns this task. */
  pipeline: PipelineState<TInstance>
  /** Instance executing this task; other runs can replace its current task. */
  instance: PipelineEntry<TInstance>['instance']
  /** Abort controller for this task; its signal is passed to execute. */
  controller: AbortController
  /** True after a result, failure, or cancellation has ended this task. */
  settled: boolean
  /** Cancels this exact task, leaving newer tasks on the same instance alone. */
  cancel: () => void
}

/**
 * Initializes run bookkeeping without executing any entries.
 *
 * @returns A new active run state with no collected results, no pending tasks,
 * and no pending promise.
 */
export function createPipelineState<TInstance extends PipelineInstance>(
  options: PipelineOptions<TInstance>,
): PipelineState<TInstance> {
  return {
    ...options,
    syncResults: [],
    pendingTasks: new Set<TaskState<TInstance>>(),
    cancelledInstances: null,
    nextEntryIndex: 0,
    active: true,
    processingEntries: false,
    hasPendingUpstream: false,
    hasInvalidResult: options.upstreamInvalid === true,
    errors: [],
    pending: null,
    resolvePending: undefined,
    rejectPending: undefined,
  }
}

/**
 * Creates task bookkeeping without registering or starting execution.
 *
 * @returns An unsettled task with a fresh abort controller and a cancellation
 * handle bound to `onCancel` for this task.
 */
export function createTaskState<TInstance extends PipelineInstance>(
  pipeline: PipelineState<TInstance>,
  entry: PipelineEntry<TInstance>,
  onCancel: (task: TaskState<TInstance>) => void,
): TaskState<TInstance> {
  const task: TaskState<TInstance> = {
    pipeline,
    instance: entry.instance,
    controller: new AbortController(),
    settled: false,
    cancel: () => onCancel(task),
  }
  return task
}

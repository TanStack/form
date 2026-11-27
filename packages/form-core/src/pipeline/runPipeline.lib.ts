import { isPromiseLike } from '../utils.lib'
import { createPipelineState, createTaskState } from './state.lib'
import { sleep } from './utils.lib'
import type { PipelineInstance } from './pipelineInstance.lib'
import type {
  PipelineEntry,
  PipelineOptions,
  PipelineOutput,
  PipelineResult,
  PipelineRun,
  PipelineState,
  TaskState,
} from './state.lib'
import type { Awaitable } from '../types.public'

function ensurePending<TInstance extends PipelineInstance>(
  state: PipelineState<TInstance>,
): void {
  if (!state.pending) {
    state.pending = new Promise<void>((res, rej) => {
      state.resolvePending = res
      state.rejectPending = rej
    })
  }
}

/**
 * Stop an active run and cancel pending tasks.
 * `true` if this call stopped the run, or `false` if it was already
 * inactive.
 *
 * This function does NOT settle `pending`.
 */
function stopPipeline<TInstance extends PipelineInstance>(
  state: PipelineState<TInstance>,
  cancelled = false,
): boolean {
  if (!state.active) return false

  state.active = false
  if (cancelled) state.onCancel?.()
  state.pendingTasks.forEach((task) => task.cancel())
  return true
}

function cancelPipeline<TInstance extends PipelineInstance>(
  state: PipelineState<TInstance>,
  notify = true,
): void {
  const wasRunning = stopPipeline(state, notify)
  if (wasRunning) {
    state.resolvePending?.()
  }
}

function failPipeline<TInstance extends PipelineInstance>(
  state: PipelineState<TInstance>,
  error: unknown,
): void {
  const wasRunning = stopPipeline(state)
  if (wasRunning) {
    state.rejectPending?.(error)
  }
}

function cancelPipelineInstances<TInstance extends PipelineInstance>(
  state: PipelineState<TInstance>,
  instances: ReadonlySet<PipelineInstance>,
): void {
  if (!state.active) return

  const tasks = Array.from(state.pendingTasks).filter((task) =>
    instances.has(task.instance),
  )
  let hasQueued = false
  for (
    let index = state.nextEntryIndex;
    index < state.entries.length;
    index++
  ) {
    const instance = state.entries[index]!.instance
    if (instances.has(instance) && !state.cancelledInstances?.has(instance)) {
      state.cancelledInstances ??= new Set()
      state.cancelledInstances.add(instance)
      hasQueued = true
    }
  }
  if (!hasQueued && tasks.length === 0) return

  // Mark all queued entries before task cancellation can resume traversal.
  state.onCancel?.()
  for (const task of tasks) cancelTask(task, false)
  if (state.processingEntries) return
  try {
    walkPipeline(state, [], true)
  } catch (error) {
    failPipeline(state, error)
  }
}

function progressPipeline<TInstance extends PipelineInstance>(
  state: PipelineState<TInstance>,
): void {
  if (!state.active) return
  if (state.processingEntries) return
  if (state.pendingTasks.size > 0) return

  if (state.nextEntryIndex === state.entries.length) {
    state.active = false
    if (state.errors.length > 0) {
      state.rejectPending?.(
        new AggregateError(state.errors, 'Pipeline execution failed'),
      )
    } else {
      state.resolvePending?.()
    }
    return
  }

  if (state.hasPendingUpstream) return

  try {
    walkPipeline(state, [], true)
  } catch (error) {
    failPipeline(state, error)
  }
}

function isTaskPending<TInstance extends PipelineInstance>(
  task: TaskState<TInstance>,
): boolean {
  return !task.settled && task.pipeline.active
}

/**
 * Releases a task's pending registration and current cancellation handle.
 *
 * @returns `true` if this call settled and released the task, or `false` if the
 * task was already settled.
 */
function releaseTask<TInstance extends PipelineInstance>(
  task: TaskState<TInstance>,
): boolean {
  if (task.settled) return false
  task.settled = true

  task.pipeline.pendingTasks.delete(task)
  if (task.instance.cancelCurrentExecution === task.cancel) {
    task.instance.cancelCurrentExecution = null
  }
  return true
}

function cancelTask<TInstance extends PipelineInstance>(
  task: TaskState<TInstance>,
  notify = true,
): void {
  if (!releaseTask(task)) return
  if (notify && task.pipeline.active) task.pipeline.onCancel?.()
  task.controller.abort()
  progressPipeline(task.pipeline)
}

function collectFailure<TInstance extends PipelineInstance>(
  state: PipelineState<TInstance>,
  error: unknown,
): void {
  ensurePending(state)
  state.errors.push(error)
  state.hasInvalidResult = true
}

function failTask<TInstance extends PipelineInstance>(
  task: TaskState<TInstance>,
  error: unknown,
): void {
  if (!isTaskPending(task)) return

  const state = task.pipeline
  collectFailure(state, error)
  releaseTask(task)
  progressPipeline(state)
}

function acceptResult<TInstance extends PipelineInstance>(
  task: TaskState<TInstance>,
  value: PipelineOutput<TInstance>,
  syncBatch?: Array<PipelineResult<TInstance>>,
): void {
  if (!isTaskPending(task)) return

  const state = task.pipeline
  let invalid: boolean
  try {
    invalid = state.isInvalid?.(value) ?? false
  } catch (error) {
    failTask(task, error)
    return
  }
  if (!isTaskPending(task)) return

  state.hasInvalidResult ||= invalid
  releaseTask(task)

  const pipelineResult: PipelineResult<TInstance> = {
    instance: task.instance,
    value,
  }

  if (syncBatch) {
    syncBatch.push(pipelineResult)
  } else {
    state.onDeferredResults?.([pipelineResult])
  }
  progressPipeline(state)
}

function executeTask<TInstance extends PipelineInstance>(
  task: TaskState<TInstance>,
  syncBatch?: Array<PipelineResult<TInstance>>,
): void {
  if (!isTaskPending(task)) return

  const state = task.pipeline
  const instance = task.instance
  let result: Awaitable<PipelineOutput<TInstance>>
  let promised: boolean
  try {
    result = instance.execute(state.input, task.controller.signal)
    promised = isPromiseLike(result)
  } catch (error) {
    failTask(task, error)
    return
  }
  if (!promised) {
    acceptResult(task, result as PipelineOutput<TInstance>, syncBatch)
    return
  }

  if (isTaskPending(task)) ensurePending(state)

  // We don't need to care about cancellation here. The handlers check for it.
  void Promise.resolve(result).then(
    (value) => {
      try {
        acceptResult(task, value)
      } catch (error) {
        failPipeline(state, error)
      }
    },
    (error: unknown) => {
      try {
        failTask(task, error)
      } catch (progressError) {
        failPipeline(state, progressError)
      }
    },
  )
}

function startTask<TInstance extends PipelineInstance>(
  state: PipelineState<TInstance>,
  entry: PipelineEntry<TInstance>,
  batch: Array<PipelineResult<TInstance>>,
): void {
  const task = createTaskState(state, entry, cancelTask)
  const { instance, cancel } = task

  const previousCancel =
    state.supersede === false ? null : instance.cancelCurrentExecution
  if (state.supersede !== false) instance.cancelCurrentExecution = cancel

  state.pendingTasks.add(task)
  previousCancel?.()

  if (!isTaskPending(task)) return

  if (entry.debounceMs && entry.debounceMs > 0) {
    ensurePending(state)
    void sleep(entry.debounceMs, task.controller.signal)
      .then(() => executeTask(task))
      .catch((error: unknown) => failPipeline(state, error))
  } else {
    executeTask(task, batch)
  }
}

function walkPipeline<TInstance extends PipelineInstance>(
  state: PipelineState<TInstance>,
  batch: Array<PipelineResult<TInstance>>,
  publish: boolean,
): void {
  state.processingEntries = true
  try {
    while (state.active && state.nextEntryIndex < state.entries.length) {
      const entry = state.entries[state.nextEntryIndex]!

      if (state.cancelledInstances?.has(entry.instance)) {
        state.nextEntryIndex++
        continue
      }

      if (entry.bailIfInvalid) {
        if (state.hasPendingUpstream || state.pendingTasks.size > 0) {
          ensurePending(state)
          break
        }
        if (state.hasInvalidResult && !entry.preparationFailure) {
          state.nextEntryIndex++
          state.onSkip?.(entry.instance)
          continue
        }
      }

      state.nextEntryIndex++
      if (entry.preparationFailure) {
        // Preparation has already thrown, even if bail would skip the callback.
        // Do not start a task or supersede older work for this occurrence.
        collectFailure(state, entry.preparationFailure.error)
      } else {
        startTask(state, entry, batch)
      }
    }
  } finally {
    state.processingEntries = false
  }

  if (state.active && publish && batch.length > 0)
    state.onDeferredResults?.(batch)
  progressPipeline(state)
}

/**
 * Starts the supplied entries while preserving synchronous result delivery.
 *
 * @returns A run handle containing the initial `syncResults` batch, a `pending`
 * completion promise for deferred work or occurrence failures, and cancellation
 * handles. Later batches go to `onDeferredResults` before completion settles.
 * Occurrence failures reject completion with an aggregate after eligible peers
 * finish. Cancellation resolves completion without delivering cancelled results.
 *
 * @throws Synchronous orchestration errors after cancelling work already started.
 */
export function runPipeline<TInstance extends PipelineInstance>(
  options: PipelineOptions<TInstance>,
): PipelineRun<TInstance> {
  const state = createPipelineState<TInstance>(options)
  const cancel = () => cancelPipeline(state)
  const cancelInstances = (instances: ReadonlySet<PipelineInstance>) =>
    cancelPipelineInstances(state, instances)
  try {
    state.processingEntries = true
    options.onStart?.(cancel, cancelInstances)
    if (isPromiseLike(state.upstreamInvalid)) {
      state.hasPendingUpstream = true
      void Promise.resolve(state.upstreamInvalid).then(
        (invalid) => {
          if (!state.active) return
          state.hasPendingUpstream = false
          state.hasInvalidResult ||= invalid
          progressPipeline(state)
        },
        (error: unknown) => failPipeline(state, error),
      )
    }
    state.processingEntries = false
    walkPipeline(state, state.syncResults, false)
  } catch (error) {
    // The caller has not received the handle: resolve any internal pending promise
    // during cleanup, then propagate the exception synchronously.
    state.processingEntries = false
    cancelPipeline(state, false)
    throw error
  }

  return {
    syncResults: state.syncResults,
    pending: state.pending,
    hasPendingWork: state.active && state.pending !== null,
    cancel,
    cancelInstances,
  }
}

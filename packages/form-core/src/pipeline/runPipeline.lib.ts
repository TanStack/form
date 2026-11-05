import { isPromiseLike } from '../utils.lib'
import { createPipelineState, createTaskState } from './state.lib'
import { sleep } from './utils.lib'
import type {
  PipelineEntry,
  PipelineInstance,
  PipelineOptions,
  PipelineOutput,
  PipelineResult,
  PipelineRun,
  PipelineState,
  TaskState,
} from './state.lib'

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
): boolean {
  if (!state.active) return false

  state.active = false
  state.pendingTasks.forEach((cancel) => cancel())
  return true
}

function cancelPipeline<TInstance extends PipelineInstance>(
  state: PipelineState<TInstance>,
): void {
  const wasRunning = stopPipeline(state)
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

function progressPipeline<TInstance extends PipelineInstance>(
  state: PipelineState<TInstance>,
): void {
  if (!state.active) return
  if (state.processingEntries) return
  if (state.pendingTasks.size > 0) return

  if (state.nextEntryIndex === state.entries.length) {
    state.active = false
    state.resolvePending?.()
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

  task.pipeline.pendingTasks.delete(task.cancel)
  if (task.instance.cancelCurrentExecution === task.cancel) {
    task.instance.cancelCurrentExecution = null
  }
  return true
}

function cancelTask<TInstance extends PipelineInstance>(
  task: TaskState<TInstance>,
): void {
  if (!releaseTask(task)) return
  task.controller.abort()
  progressPipeline(task.pipeline)
}

function acceptResult<TInstance extends PipelineInstance>(
  task: TaskState<TInstance>,
  value: PipelineOutput<TInstance>,
  syncBatch?: Array<PipelineResult<TInstance>>,
): void {
  if (!isTaskPending(task)) return

  const state = task.pipeline
  const invalid = state.isInvalid?.(value) ?? false
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
  const result = instance.execute(state.input, task.controller.signal)
  if (!isPromiseLike(result)) {
    acceptResult(task, result, syncBatch)
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
      if (isTaskPending(task)) {
        failPipeline(state, error)
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

  const previousCancel = instance.cancelCurrentExecution
  instance.cancelCurrentExecution = cancel

  previousCancel?.()
  state.pendingTasks.add(cancel)

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

      if (entry.bailIfInvalid) {
        if (state.hasPendingUpstream || state.pendingTasks.size > 0) {
          ensurePending(state)
          break
        }
        if (state.hasInvalidResult) {
          state.nextEntryIndex++
          state.onSkip?.(entry.instance)
          continue
        }
      }

      state.nextEntryIndex++
      startTask(state, entry, batch)
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
 * promise for deferred work (`null` for an entirely synchronous run), and a
 * `cancel` function. Later batches go to `onDeferredResults` before `pending` resolves.
 * Cancellation resolves `pending` without delivering cancelled results. A
 * deferred failure rejects it after cancelling the remaining tasks.
 *
 * @throws Synchronous execution errors after cancelling work already started.
 */
export function runPipeline<TInstance extends PipelineInstance>(
  options: PipelineOptions<TInstance>,
): PipelineRun<TInstance> {
  const state = createPipelineState<TInstance>(options)

  try {
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
    walkPipeline(state, state.syncResults, false)
  } catch (error) {
    // The caller has not received the handle: resolve any internal pending promise
    // during cleanup, then propagate the exception synchronously.
    cancelPipeline(state)
    throw error
  }

  return {
    syncResults: state.syncResults,
    pending: state.pending,
    cancel: () => cancelPipeline(state),
  }
}

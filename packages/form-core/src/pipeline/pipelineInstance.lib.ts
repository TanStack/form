import type { Awaitable } from '../types.public'

export abstract class PipelineInstance<TInput = any, TResult = any> {
  /**
   * Cancel this instance's current task, if present.
   */
  cancelCurrentExecution: (() => void) | null = null

  /**
   * Builds the run context, executes this instance, and normalizes its result.
   *
   * @returns This instance's normalized result directly for synchronous work,
   * or a promise of that result for asynchronous work. The manager attaches
   * instance identity when collecting results.
   */
  abstract execute(input: TInput, signal: AbortSignal): Awaitable<TResult>
}

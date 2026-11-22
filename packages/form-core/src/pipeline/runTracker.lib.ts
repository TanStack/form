import type { PipelineInstance } from './pipelineInstance.lib'
import type { PipelineRun } from './state.lib'

type ValidationRun = Pick<PipelineRun<PipelineInstance>, 'cancel'> &
  Partial<Pick<PipelineRun<PipelineInstance>, 'cancelInstances'>>

/** Registers cancellation handles owned by one validation scope. */
export class ValidationRunTracker {
  private readonly runs = new Set<ValidationRun>()

  register = (run: ValidationRun): (() => void) => {
    this.runs.add(run)
    return () => {
      this.runs.delete(run)
    }
  }

  cancelInstances = (instances: ReadonlySet<PipelineInstance>): void => {
    for (const run of Array.from(this.runs)) run.cancelInstances?.(instances)
  }

  cancelAll = (): void => {
    const runs = Array.from(this.runs)
    this.runs.clear()

    for (const run of runs) {
      run.cancel()
    }
  }
}

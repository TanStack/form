import {
  getValidationErrors,
  isErrorResult,
} from '../../validation/results/errors.lib'
import type { ValidatorExecutor } from './ValidatorInstance.lib'
import type { PipelineResult } from '../state.lib'
import type { FormattedValidationError } from '../../validation/results/results.public'

/** Collects one run's accepted results in original validator-list order. */
export class ValidationResultCollector<
  TInstance extends ValidatorExecutor = ValidatorExecutor,
> {
  private readonly accepted = new Map<TInstance, PipelineResult<TInstance>>()

  collect = (results: ReadonlyArray<PipelineResult<TInstance>>): void => {
    for (const result of results) {
      this.accepted.set(result.instance, result)
    }
  }

  getResults = (): Array<PipelineResult<TInstance>> => {
    return Array.from(this.accepted.values()).sort(
      (left, right) => left.instance.index - right.instance.index,
    )
  }

  getErrors = <TValue>(): Array<FormattedValidationError<TValue>> => {
    return this.getResults().flatMap(({ value }) =>
      getValidationErrors<TValue>(value.result),
    )
  }

  /** Checks whether this run's currently accepted results contain validation errors. */
  hasErrors = (): boolean => {
    for (const { value } of this.accepted.values()) {
      if (isErrorResult(value.result)) return true
    }

    return false
  }

  /**
   * Returns outputs at their original indexes, leaving missing outputs `undefined`.
   *
   * @param validatorCount - Full validator-list length, including skipped validators.
   */
  getOutputs = (validatorCount: number): Array<any> => {
    const outputs = new Array<any>(validatorCount).fill(undefined)

    for (const { instance, value } of this.accepted.values()) {
      if (value.hasOutput) {
        outputs[instance.index] = value.output
      }
    }

    return outputs
  }
}

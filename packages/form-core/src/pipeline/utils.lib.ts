import { isPromiseLike } from '../utils.lib'
import { isErrorResult } from '../validation/errors.lib'
import type { Awaitable } from '../types.public'
import type { ValidatorEvents, ValidatorTriggers } from '../events.public'
import type { PipelineResult } from './state.lib'
import type { ValidatorExecutor } from './validatorExecutor.lib'

// Both submit and validators have these, but it'd be silly to invent a
// class they inherit from instead of just asserting this.
interface ValidationSourceOrder {
  readonly scope: number
  readonly index: number
}

/** Returns a copy ordered by numeric scope priority, then original index. */
export function sortValidationSources<TSource extends ValidationSourceOrder>(
  sources: Iterable<TSource>,
): Array<TSource> {
  return Array.from(sources).sort((left, right) => {
    if (left.scope === right.scope) {
      return left.index - right.index
    }
    return left.scope - right.scope
  })
}

type ValidatorCondition = boolean | ((context: any) => boolean)

export type ValidatorTrigger =
  ValidatorTriggers | { trigger: ValidatorTriggers; when?: ValidatorCondition }

interface ValidatorSelectionContext {
  event: ValidatorEvents
  createPredicateContext?: () => any
}

export interface SelectableValidator {
  triggers?: ReadonlyArray<ValidatorTrigger>
  skipOnSubmit?: ValidatorCondition
}

function isConditionEnabled(
  condition: ValidatorCondition,
  context: ValidatorSelectionContext,
): boolean {
  if (typeof condition === 'boolean') return condition
  if (context.event === 'server' || !context.createPredicateContext) {
    return false
  }

  return condition(context.createPredicateContext())
}

export function isValidationTriggerEnabled(
  trigger: ValidatorTrigger,
  context: ValidatorSelectionContext,
): boolean {
  if (typeof trigger === 'string') return trigger === context.event
  if (trigger.trigger !== context.event) return false

  const { when = true } = trigger
  return isConditionEnabled(when, context)
}

export function shouldRunValidator(
  validator: SelectableValidator,
  context: ValidatorSelectionContext,
): boolean {
  if (context.event === 'submit') {
    const { skipOnSubmit = false } = validator
    return !isConditionEnabled(skipOnSubmit, context)
  }

  return (
    validator.triggers?.some((trigger) =>
      isValidationTriggerEnabled(trigger, context),
    ) ?? false
  )
}

/**
 * Normalizes a direct value immediately, or a promised value when it resolves.
 *
 * @returns The direct normalization result for a synchronous input, or a promise
 * of the normalized result for a promised input.
 */
export function mapResult<TValue, TResult>(
  value: TValue | PromiseLike<TValue>,
  normalize: (value: TValue) => TResult,
): Awaitable<TResult> {
  return isPromiseLike(value)
    ? Promise.resolve(value).then(normalize)
    : normalize(value)
}

export function sleep(
  milliseconds: number,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise<void>((resolve) => {
    if (signal?.aborted) {
      resolve()
      return
    }

    const finish = () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', finish)
      resolve()
    }

    const timer = setTimeout(finish, milliseconds)
    signal?.addEventListener('abort', finish, { once: true })
  })
}

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

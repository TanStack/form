import { isPromiseLike } from '../utils.lib'
import type { Awaitable } from '../types.public'
import type { ValidatorEvents, ValidatorTriggers } from '../events.public'

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

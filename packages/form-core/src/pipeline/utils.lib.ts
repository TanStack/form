import { isPromiseLike } from '../utils.lib'
import type { Awaitable } from '../types.public'

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

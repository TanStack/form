import { useEffect, useLayoutEffect } from 'react'

export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Adds a getter to the class prototype. When called, it initializes and caches it on the instance
 * for quick reuse.
 */
export function defineLazyInstanceProp<TClass extends object, TValue>(
  classPrototype: TClass,
  name: PropertyKey,
  initialize: (instance: TClass) => TValue,
) {
  Object.defineProperty(classPrototype, name, {
    configurable: true,
    enumerable: true,
    get(this: TClass) {
      const value = initialize(this)

      Object.defineProperty(this, name, {
        configurable: true,
        enumerable: true,
        writable: true,
        value,
      })
      return value
    },
  })
}

/**
 * Similar to `Omit`, but preserves union props.
 */
export type OmitProps<TProps, TKey extends PropertyKey> = TProps extends unknown
  ? Omit<TProps, TKey>
  : never

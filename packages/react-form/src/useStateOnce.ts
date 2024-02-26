import { useState } from 'rehackt'
import { useIsomorphicEffectOnce } from './useIsomorphicEffectOnce'

const ComponentMap = new Map<string, any>()

function isInitialStateAFn<S>(fn: any): fn is () => S {
  return typeof fn === 'function'
}

/**
 * `id` here must be unique for each component and manually passed to the hook, rather than using `useId`.
 * This is because useId does not guarantee uniqueness across different renders in StrictMode.
 */
export const useStateOnce = <S>(id: string, initialState: S | (() => S)) => {
  const arr = useState(() => {
    if (ComponentMap.has(id)) {
      return ComponentMap.get(id) as S
    }
    let val!: S
    if (isInitialStateAFn(initialState)) {
      val = initialState()
    } else {
      val = initialState
    }
    ComponentMap.set(id, val)
    return val
  })

  useIsomorphicEffectOnce(() => {
    return () => {
      ComponentMap.delete(id)
    }
  })

  return arr
}

import { useReducer, useRef } from 'rehackt'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import type { EffectCallback } from 'rehackt'

/**
 * This hook handles StrictMode and prod mode
 */
export const useIsomorphicEffectOnce = (effect: EffectCallback) => {
  const destroyFunc = useRef<void | (() => void)>()
  const effectCalled = useRef(false)
  const renderAfterCalled = useRef(false)
  const [_, rerender] = useReducer(() => ({}), {})

  if (effectCalled.current) {
    renderAfterCalled.current = true
  }

  useIsomorphicLayoutEffect(() => {
    // only execute the effect first time around
    if (!effectCalled.current) {
      destroyFunc.current = effect()
      effectCalled.current = true
    }

    // this forces one render after the effect is run
    rerender()

    return () => {
      // if the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!renderAfterCalled.current) {
        return
      }
      if (destroyFunc.current) {
        destroyFunc.current()
      }
    }
  }, [])
}

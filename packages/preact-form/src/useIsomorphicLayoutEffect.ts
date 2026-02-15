import { useEffect, useLayoutEffect } from 'preact/compat'

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

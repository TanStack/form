import { useEffect, useLayoutEffect } from 'rehackt'

export const useIsomorphicLayoutEffect =
  // @ts-ignore
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

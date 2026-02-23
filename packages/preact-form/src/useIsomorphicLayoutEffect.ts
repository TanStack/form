import { useEffect, useLayoutEffect } from 'preact/hooks'

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

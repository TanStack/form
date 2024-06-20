import { useEffect, useLayoutEffect } from 'react'

export const useIsomorphicLayoutEffect =
  // @ts-ignore
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

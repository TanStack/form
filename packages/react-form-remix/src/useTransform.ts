import { useCallback } from 'react'
import type { AnyFormApi } from '@tanstack/react-form'

export const useTransform: (
  fn: (formBase: AnyFormApi) => AnyFormApi,
  deps?: unknown[],
) => unknown = useCallback as never

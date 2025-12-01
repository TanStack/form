import type { AnyFormApi, FormTransform } from '@tanstack/react-form'

export function useTransform(
  fn: (formBase: AnyFormApi) => AnyFormApi,
  _deps?: unknown[],
): FormTransform<any, any, any, any, any, any, any, any, any, any, any, any> {
  return {
    fn,
  }
}

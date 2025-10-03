import type { AnyFormApi, FormTransform } from '@tanstack/form-core'

export function useTransform(
  fn: (formBase: AnyFormApi) => AnyFormApi,
  deps: unknown[],
): FormTransform<any, any, any, any, any, any, any, any, any, any, any, any> {
  return {
    fn,
    deps,
  }
}

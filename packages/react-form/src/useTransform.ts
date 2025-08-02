import type {
  AnyFormApi,
  FormApi,
  FormAsyncValidateOrFn,
  FormTransform,
  FormValidateOrFn,
} from '@tanstack/form-core'

export function useTransform(
  fn: (formBase: AnyFormApi) => AnyFormApi,
  deps: unknown[],
): FormTransform<any, any, any, any, any, any, any, any, any, any, any, any> {
  return {
    fn,
    deps,
  }
}

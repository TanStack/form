import type { FormApi, FormTransform, Validator } from '@tanstack/form-core'

export function useTransform<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
  TFormSubmitMeta = never,
>(
  fn: (
    formBase: FormApi<any, any, TFormSubmitMeta>,
  ) => FormApi<TFormData, TFormValidator, TFormSubmitMeta>,
  deps: unknown[],
): FormTransform<TFormData, TFormValidator, TFormSubmitMeta> {
  return {
    fn,
    deps,
  }
}

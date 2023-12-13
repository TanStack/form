import { FormApi, type Validator } from '@tanstack/form-core'

export function useTransform<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(
  fn: (
    formBase: FormApi<TFormData, TFormValidator>,
  ) => FormApi<TFormData, TFormValidator>,
  deps: unknown[],
) {
  return {
    fn,
    deps,
  }
}

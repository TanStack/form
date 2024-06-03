import type { FormOptions, Validator } from '@tanstack/form-core'

export function formOptions<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(
  defaultOpts?: FormOptions<TFormData, TFormValidator>,
) {
  return defaultOpts;
}

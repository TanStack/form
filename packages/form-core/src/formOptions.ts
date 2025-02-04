import type { Validator } from './types'
import type { FormOptions } from './FormApi'

export function formOptions<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
  TFormSubmitMeta = never,
>(defaultOpts?: FormOptions<TFormData, TFormValidator, TFormSubmitMeta>) {
  return defaultOpts
}

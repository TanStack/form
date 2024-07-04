import type { Validator } from './types'
import type { FormOptions } from './FormApi'

export function formOptions<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(defaultOpts?: FormOptions<TFormData, TFormValidator>) {
  return defaultOpts
}

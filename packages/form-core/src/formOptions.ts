import type { Validator } from './types'
import type { FormOptions } from './FormApi'
import type { StandardSchemaValidator } from './standardSchemaValidator'

export function formOptions<
  TFormData,
  TFormValidator extends Validator<
    TFormData,
    unknown
  > = StandardSchemaValidator,
>(defaultOpts?: FormOptions<TFormData, TFormValidator>) {
  return defaultOpts
}

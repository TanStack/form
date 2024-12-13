import type { Validator } from './types'
import type { FormOptions } from './FormApi'
import type { StandardSchemaV1 } from '@standard-schema/spec'

export function formOptions<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> = Validator<
    TFormData,
    StandardSchemaV1<TFormData>
  >,
>(defaultOpts?: FormOptions<TFormData, TFormValidator>) {
  return defaultOpts
}

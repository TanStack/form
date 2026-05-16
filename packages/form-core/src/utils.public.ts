import type { FormOptions } from './FormApi.public'
import type { FormValidators } from './validation.public'

export function formOptions<
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
>(
  options: FormOptions<TFormData, TFormValidators>,
): FormOptions<TFormData, TFormValidators> {
  return options
}

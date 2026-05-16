import type { FormOptions } from './FormApi.public'
import type { FormValidators } from './validation.public'

export function formOptions<
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
): FormOptions<TFormData, TFormValidators, TSubmitReturn> {
  return options
}

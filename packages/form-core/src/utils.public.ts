import type { FormOptions } from './FormApi.public'
import type { FormValidator } from './validation.public'

export function formOptions<
  TFormData,
  const TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
>(
  options: FormOptions<TFormData, TFormValidators>,
): FormOptions<TFormData, TFormValidators> {
  return options
}

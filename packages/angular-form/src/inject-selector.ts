import { injectSelector as injectAngularSelector } from '@tanstack/angular-store'
import type { Signal } from '@angular/core'
import type { FormApi, FormErrorTypes, FormState } from '@tanstack/form-core'
import type { InjectSelectorOptions } from '@tanstack/angular-store'

/** Selects form state as an Angular signal. */
export function injectSelector<
  TFormData,
  TFormErrorTypes extends FormErrorTypes,
  TSelected = NoInfer<FormState<TFormData, TFormErrorTypes>>,
>(
  form: FormApi<TFormData, TFormErrorTypes>,
  selector: (
    state: NoInfer<FormState<TFormData, TFormErrorTypes>>,
  ) => TSelected = (state) => state as unknown as TSelected,
  options?: InjectSelectorOptions<TSelected>,
): Signal<TSelected> {
  return injectAngularSelector(form.atom, selector, options)
}

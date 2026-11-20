import { injectSelector as injectAngularSelector } from '@tanstack/angular-store'
import type { Signal } from '@angular/core'
import type { FormApi, FormState, ScopedErrorTypes } from '@tanstack/form-core'
import type { InjectSelectorOptions } from '@tanstack/angular-store'

/** Selects form state as an Angular signal. */
export function injectSelector<
  TFormData,
  TFormError extends ScopedErrorTypes,
  const TSelected = NoInfer<FormState<TFormData, TFormError>>,
>(
  form: FormApi<TFormData, TFormError>,
  selector: (state: NoInfer<FormState<TFormData, TFormError>>) => TSelected = (
    state,
  ) => state as never,
  options?: InjectSelectorOptions<TSelected>,
): Signal<TSelected> {
  return injectAngularSelector(form.atom, selector, options)
}

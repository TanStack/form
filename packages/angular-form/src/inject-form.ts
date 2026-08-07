import { ChangeDetectorRef, DestroyRef, effect, inject } from '@angular/core'
import { injectSelector } from '@tanstack/angular-store'
import { InternalFormApi } from '@tanstack/form-core/internals'
import type { FormOptions, FormValidators } from '@tanstack/form-core'

/**
 * Creates and mounts a v2 form in the current Angular injection context.
 */
export function injectForm<
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(options: FormOptions<TFormData, TFormValidators, TSubmitReturn>) {
  const form = new InternalFormApi<TFormData, TFormValidators, TSubmitReturn>(
    options,
  )
  const destroyRef = inject(DestroyRef)
  const changeDetector = inject(ChangeDetectorRef, { optional: true })
  const state = injectSelector(form.atom)

  const unmount = form.mount()
  destroyRef.onDestroy(unmount)

  // Form state is exposed as plain getters by form-core. Bridge its atom to
  // Angular change detection so reads such as `form.state.canSubmit` update in
  // OnPush templates without requiring a separate selector.
  effect(() => {
    state()
    changeDetector?.markForCheck()
  })

  return form
}

import { ChangeDetectorRef, DestroyRef, effect, inject } from '@angular/core'
import { injectSelector } from '@tanstack/angular-store'
import { InternalFormApi } from '@tanstack/form-core/internals'
import type { FormOptions, FormValidators } from '@tanstack/form-core'

/**
 * Creates and mounts a form in the current Angular injection context.
 *
 * `defaultValues` establish the initial state and inferred form value type.
 * Form state changes notify Angular change detection, including OnPush
 * components, and the form is cleaned up when the injection context is
 * destroyed.
 *
 * Call this in a component field initializer, constructor, provider factory,
 * or another active injection context.
 *
 * @example
 * ```ts
 * @Component({
 *   selector: 'app-profile-form',
 *   template: `<form></form>`,
 * })
 * class ProfileFormComponent {
 *   form = injectForm({
 *     defaultValues: { name: '' },
 *     onSubmit: ({ value }) => saveProfile(value),
 *   })
 * }
 * ```
 *
 * @param options - The initial form options. `defaultValues` drive form value
 * inference.
 * @returns The mounted form API registered for injection-context cleanup.
 * @typeParam TFormData - Library-managed. Do not specify explicitly.
 * @typeParam TFormValidators - Library-managed. Do not specify explicitly.
 * @typeParam TSubmitReturn - Library-managed. Do not specify explicitly.
 */
export function injectForm<
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(options: FormOptions<TFormData, TFormValidators, TSubmitReturn, unknown>) {
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

import type {
  AnyFormOptions,
  FormOptions,
  GetFormErrorTypes,
  GetSharedFormErrorTypes,
} from '@tanstack/form-core'
import type { TanStackFormController } from './tanstack-form-controller.js'

/**
 * A Lit form controller whose form data, validator, and submit types are
 * erased.
 *
 * Use it for reusable render helpers that only need controller operations
 * common to every form. Field paths and values are not checked against a
 * particular form shape; use `LitFormType` when a helper depends on one known
 * form.
 *
 * @example
 * ```ts
 * function formSubmitButton(form: AnyLitFormApi) {
 *   return form.subscribe(
 *     (state) => state.isSubmitting,
 *     (isSubmitting) => html`
 *       <button type="submit" ?disabled=${isSubmitting}>
 *         ${isSubmitting ? 'Saving...' : 'Save'}
 *       </button>
 *     `,
 *   )
 * }
 * ```
 */
export type AnyLitFormApi = TanStackFormController<any, any, any, any, any>

/**
 * Derives the Lit form controller type represented by a reusable options
 * object.
 *
 * Use it to type child element properties and render helpers that belong to one
 * known form shape. Options such as `onSubmit` can be defined either in the
 * shared options or when the form is created in the component.
 *
 * @example
 * ```ts
 * const profileOptions = formOptions({
 *   defaultValues: { name: '' },
 * })
 *
 * type ProfileForm = LitFormType<typeof profileOptions>
 *
 * function nameField(form: ProfileForm) {
 *   return form.field({ name: 'name' }, (field) => html`
 *     <input .value=${field.value} />
 *   `)
 * }
 * ```
 *
 * @typeParam TOptions - The reusable form options from which the controller derives its form data, validator, and submit-result types.
 */
export type LitFormType<TOptions extends AnyFormOptions> =
  TOptions extends FormOptions<
    infer TFormData,
    any,
    infer TValidators,
    infer TSubmitReturn,
    any
  >
    ? // Keep option-only generics erased so component-level submit handlers remain
      // assignable through update(), while preserving the derived public errors.
      TanStackFormController<
        TFormData,
        any,
        any,
        any,
        GetSharedFormErrorTypes<TValidators, TSubmitReturn>
      >
    : never

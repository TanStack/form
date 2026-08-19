import type { AnyFormOptions, FormOptions } from '@tanstack/form-core'
import type { TanStackFormController } from './tanstack-form-controller.js'

type LitFormTypeSubmitReturn<TSubmitReturn> = unknown extends TSubmitReturn
  ? any
  : TSubmitReturn

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
export type AnyLitFormApi = TanStackFormController<any, any, any>

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
    infer TFormValidators,
    infer TSubmitReturn,
    unknown
  >
    ? TanStackFormController<
        TFormData,
        TFormValidators,
        LitFormTypeSubmitReturn<TSubmitReturn>
      >
    : never

/**
 * Type-only helper for declaring a child element's form property from shared
 * `formOptions`. It intentionally has no runtime value.
 */
export function getFormType<TOptions extends AnyFormOptions>(
  _formOptions: TOptions,
): LitFormType<TOptions> {
  return undefined as never
}

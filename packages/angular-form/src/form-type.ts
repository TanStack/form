import type { AnyFormOptions, FormOptions } from '@tanstack/form-core'
import type {
  AnyInternalFormApi,
  InternalFormApi,
} from '@tanstack/form-core/internals'

// Reusable formOptions often omit onSubmit so a component can provide it later.
// Keep that unresolved submit return flexible when the form is passed to a child.
type AngularFormTypeSubmitReturn<TSubmitReturn> = unknown extends TSubmitReturn
  ? any
  : TSubmitReturn

/**
 * An Angular form API whose form data, validator, and submit types are erased.
 *
 * Use it for reusable Angular components that only need form operations common
 * to every form. Field paths and values are not checked against a particular
 * form shape; use `AngularFormType` when a component depends on one known form.
 *
 * @example
 * ```ts
 * @Component({
 *   selector: 'app-reset-button',
 *   template: `
 *     <button type="button" (click)="form().reset()">Reset</button>
 *   `,
 * })
 * export class ResetButtonComponent {
 *   form = input.required<AnyAngularFormApi>()
 * }
 * ```
 */
export type AnyAngularFormApi = AnyInternalFormApi

/**
 * Derives the Angular form API type represented by a reusable options object.
 *
 * Use it to type inputs for components that belong to one known form shape.
 * Options such as `onSubmit` can be defined either in the shared options or
 * when the form is created in the component.
 *
 * @example
 * ```ts
 * const profileOptions = formOptions({
 *   defaultValues: { name: '' },
 * })
 *
 * type ProfileForm = AngularFormType<typeof profileOptions>
 *
 * export class NameFieldComponent {
 *   form = input.required<ProfileForm>()
 * }
 * ```
 *
 * @typeParam TOptions - The reusable form options from which the API derives its form data, validator, and submit-result types.
 */
export type AngularFormType<TOptions extends AnyFormOptions> =
  TOptions extends FormOptions<
    infer TFormData,
    infer TFormValidators,
    infer TSubmitReturn,
    unknown
  >
    ? InternalFormApi<
        TFormData,
        TFormValidators,
        AngularFormTypeSubmitReturn<TSubmitReturn>
      >
    : never

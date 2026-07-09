import type {
  FormAsyncValidateOrFn,
  FormOptions,
  FormValidateOrFn,
} from '@tanstack/form-core'
import type { TanStackFormController } from './tanstack-form-controller.js'

/**
 * A type-only helper that returns a value whose type matches the
 * `TanStackFormController` instance that would be produced for the given
 * `FormOptions`. It does not run any logic at runtime.
 *
 * Use this together with shared `formOptions` to derive the expected
 * controller type for a `form` property on a child Lit element, without
 * having to spell out all of `TanStackFormController`'s generics by hand.
 *
 * @example
 * ```ts
 * import { formOptions, getFormType } from '@tanstack/lit-form'
 *
 * export const peopleFormOpts = formOptions({
 *   defaultValues: { firstName: '', lastName: '' },
 * })
 *
 * // In a child element:
 * class ChildForm extends LitElement {
 *   @property({ attribute: false })
 *   form!: ReturnType<typeof getFormType<typeof peopleFormOpts.defaultValues, ...>>
 * }
 * ```
 *
 * Most users will pass `formOptions` directly:
 *
 * ```ts
 * const formType = getFormType(peopleFormOpts)
 *
 * class ChildForm extends LitElement {
 *   @property({ attribute: false })
 *   form!: typeof formType
 * }
 * ```
 */
export function getFormType<
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnDynamic extends undefined | FormValidateOrFn<TFormData>,
  TOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
  TSubmitMeta,
>(
  _formOptions: FormOptions<
    TFormData,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnDynamic,
    TOnDynamicAsync,
    TOnServer,
    TSubmitMeta
  >,
): TanStackFormController<
  TFormData,
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnDynamic,
  TOnDynamicAsync,
  TOnServer,
  TSubmitMeta
> {
  return undefined as never
}

import type {
  AnyFormOptions,
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type { AppFormOptions } from './AppForm/appFormOptions.public'
import type {
  AnySolidFormComponentMap,
  DefaultSolidFormComponentMap,
} from './AppForm/componentMap.public'
import type { SolidFormApi } from './formApiTypes.public'

type SolidFormTypeErrorTypes<
  TFormValidators extends FormValidators<any>,
  TSubmitReturn,
> = unknown extends TSubmitReturn
  ? any
  : ToFormErrorTypes<TFormValidators, TSubmitReturn>

/**
 * Derives the Solid form API type represented by a reusable options object.
 *
 * Use it to type props for components that belong to one known form shape. It
 * preserves the inferred form data and any components registered through
 * `appFormOptions`. Options such as `onSubmit` can be defined either in the
 * shared options or when the form is created in the component.
 *
 * @example
 * ```tsx
 * const profileOptions = formOptions({
 *   defaultValues: { name: '' },
 * })
 *
 * type ProfileForm = SolidFormType<typeof profileOptions>
 *
 * function NameField(props: {
 *   form: ProfileForm
 * }) {
 *   return (
 *     <props.form.Field name="name">
 *       {(field) => <input value={field().value} />}
 *     </props.form.Field>
 *   )
 * }
 * ```
 *
 * @typeParam TOptions - The reusable form or app-form options from which the API derives its form data, error, and registered-component types.
 */
export type SolidFormType<
  TOptions extends
    AnyFormOptions | AppFormOptions<any, any, any, AnySolidFormComponentMap>,
> =
  TOptions extends AppFormOptions<
    infer TFormData,
    infer TFormValidators,
    infer TSubmitReturn,
    infer TComponents
  >
    ? SolidFormApi<
        TFormData,
        SolidFormTypeErrorTypes<TFormValidators, TSubmitReturn>,
        TComponents
      >
    : TOptions extends FormOptions<
          infer TFormData,
          infer TFormValidators,
          infer TSubmitReturn
        >
      ? SolidFormApi<
          TFormData,
          SolidFormTypeErrorTypes<TFormValidators, TSubmitReturn>,
          DefaultSolidFormComponentMap
        >
      : never

import type {
  AnyFormOptions,
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type { AppFormOptions } from '../AppForm/appFormOptions.public'
import type {
  AnyReactFormComponentMap,
  DefaultReactFormComponentMap,
} from '../AppForm/componentMap.public'
import type { ReactFormApi } from './formApiTypes.public'

// When defining formOptions, `onSubmit` is most likely not going to be present in it. Users
// prefer to define them in components.
// That's an issue for us because the inferred form error types are covariant, so resolving them
// early can break passing forms as props to child components.
// This must remain `any` so that `form={form}` remains working. There are type tests for it, so feel
// free to tinker.
type ReactFormTypeErrorTypes<
  TFormValidators extends FormValidators<any>,
  TSubmitReturn,
> = unknown extends TSubmitReturn
  ? any
  : ToFormErrorTypes<TFormValidators, TSubmitReturn>

/**
 * Derives the React form API type represented by a reusable options object.
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
 * type ProfileForm = ReactFormType<typeof profileOptions>
 *
 * function NameField(props: {
 *   form: ProfileForm
 * }) {
 *   return (
 *     <props.form.Field name="name">
 *       {(field) => <input value={field.value} />}
 *     </props.form.Field>
 *   )
 * }
 * ```
 *
 * @typeParam TOptions - The reusable form or app-form options from which the API derives its form data, error, and registered-component types.
 */
export type ReactFormType<
  TOptions extends
    AnyFormOptions | AppFormOptions<any, any, any, AnyReactFormComponentMap>,
> =
  TOptions extends AppFormOptions<
    infer TFormData,
    infer TFormValidators,
    infer TSubmitReturn,
    infer TComponents
  >
    ? ReactFormApi<
        TFormData,
        ReactFormTypeErrorTypes<TFormValidators, TSubmitReturn>,
        TComponents
      >
    : TOptions extends FormOptions<
          infer TFormData,
          infer TFormValidators,
          infer TSubmitReturn
        >
      ? ReactFormApi<
          TFormData,
          ReactFormTypeErrorTypes<TFormValidators, TSubmitReturn>,
          DefaultReactFormComponentMap
        >
      : never

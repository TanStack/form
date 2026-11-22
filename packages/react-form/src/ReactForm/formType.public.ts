import type {
  AnyFormOptions,
  FormOptions,
  FormOptionsApi,
  GetSharedFormErrorTypes,
} from '@tanstack/form-core'
import type {
  AnyReactFormComponentMap,
  DefaultReactFormComponentMap,
} from '../AppForm/componentMap.public'
import type { ReactFormApi } from './formApiTypes.public'

type ComponentOrDefault<TComponents> =
  TComponents extends AnyReactFormComponentMap
    ? TComponents
    : DefaultReactFormComponentMap

type OptionsInferredForm<TOptions extends AnyFormOptions> =
  TOptions extends FormOptions<
    infer TFormData,
    any,
    infer TFormValidators,
    infer TSubmitReturn,
    infer TComponents
  >
    ? ReactFormApi<
        TFormData,
        GetSharedFormErrorTypes<TFormValidators, TSubmitReturn>,
        ComponentOrDefault<TComponents>
      >
    : never

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
  TOptions extends AnyFormOptions | FormOptionsApi<unknown>,
> = TOptions extends AnyFormOptions
  ? OptionsInferredForm<TOptions>
  : TOptions extends FormOptionsApi<infer TComponents>
    ? ReactFormApi<any, any, ComponentOrDefault<TComponents>>
    : never

import type {
  AnyFormOptions,
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type { AppFormOptions } from '../AppForm/appFormOptions.public'
import type {
  AnyVueFormComponentMap,
  DefaultVueFormComponentMap,
} from '../AppForm/componentMap.public'
import type { VueFormApi } from './formApiTypes.public'

type VueFormTypeErrorTypes<
  TFormValidators extends FormValidators<any>,
  TSubmitReturn,
> = unknown extends TSubmitReturn
  ? any
  : ToFormErrorTypes<TFormValidators, TSubmitReturn>

/**
 * Derives the Vue form API type represented by a reusable options object.
 *
 * Use it to type props for components that belong to one known form shape. It
 * preserves the inferred form data and any components registered through
 * `appFormOptions`. Options such as `onSubmit` can be defined either in the
 * shared options or when the form is created in the component.
 *
 * @example
 * ```ts
 * const profileOptions = formOptions({
 *   defaultValues: { name: '' },
 * })
 *
 * type ProfileForm = VueFormType<typeof profileOptions>
 *
 * const props = defineProps<{
 *   form: ProfileForm
 * }>()
 * ```
 *
 * @typeParam TOptions - The reusable form or app-form options from which the API derives its form data, error, and registered-component types.
 */
export type VueFormType<
  TOptions extends
    AnyFormOptions | AppFormOptions<any, any, any, AnyVueFormComponentMap>,
> =
  TOptions extends AppFormOptions<
    infer TFormData,
    infer TFormValidators,
    infer TSubmitReturn,
    infer TComponents
  >
    ? VueFormApi<
        TFormData,
        VueFormTypeErrorTypes<TFormValidators, TSubmitReturn>,
        TComponents
      >
    : TOptions extends FormOptions<
          infer TFormData,
          infer TFormValidators,
          infer TSubmitReturn
        >
      ? VueFormApi<
          TFormData,
          VueFormTypeErrorTypes<TFormValidators, TSubmitReturn>,
          DefaultVueFormComponentMap
        >
      : never

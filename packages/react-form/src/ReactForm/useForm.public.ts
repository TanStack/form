import { initializeForm, useInternalForm } from './ReactFormApi.lib'
import type {
  AnyFormOptions,
  FormOptions,
  GetFormErrorTypes,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type {
  AnyReactFormComponentMap,
  DefaultReactFormComponentMap,
} from '../AppForm/componentMap.public'
import type { ReactFormApi } from './formApiTypes.public'

export type UseFormHook<in out TComponents extends AnyReactFormComponentMap> = <
  TFormData,
  const TValidatorConfig extends unknown[],
  TValidators,
  TSubmitReturn,
>(
  options: FormOptions<
    TFormData,
    TValidatorConfig,
    TValidators,
    TSubmitReturn,
    unknown
  >,
) => ReactFormApi<
  TFormData,
  GetFormErrorTypes<TValidators, TSubmitReturn>,
  TComponents
>

function useFormHook(options: AnyFormOptions) {
  const form = useInternalForm(options, initializeForm)
  return form
}

/**
 * Creates a React form whose instance and lifecycle are owned by the current
 * component.
 *
 * `defaultValues` establish the initial state and inferred form value type.
 * Later renders apply changed options to the same form instance, and unmounting
 * the component cleans it up.
 *
 * Call this hook at the top level of a React component or custom hook.
 *
 * @example
 * ```tsx
 * function ProfileForm() {
 *   const form = useForm({
 *     defaultValues: { name: '' },
 *     onSubmit: ({ value }) => saveProfile(value),
 *   })
 *
 *   return (
 *     <form
 *       onSubmit={(event) => {
 *         event.preventDefault()
 *         void form.handleSubmit()
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @returns The React form API with typed field, subscription, and form-group
 * components attached.
 */
const useForm =
  useFormHook as never as UseFormHook<DefaultReactFormComponentMap>

export { useForm }

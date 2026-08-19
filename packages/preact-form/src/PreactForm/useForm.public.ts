import { initializeForm, useInternalForm } from './PreactFormApi.lib'
import type {
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type {
  AnyPreactFormComponentMap,
  DefaultPreactFormComponentMap,
} from '../AppForm/componentMap.public'
import type { PreactFormApi } from './formApiTypes.public'

export type UseFormHook<in out TComponents extends AnyPreactFormComponentMap> =
  <
    TFormData,
    const TFormValidators extends FormValidators<TFormData>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn, unknown>,
  ) => PreactFormApi<
    TFormData,
    ToFormErrorTypes<TFormValidators, TSubmitReturn>,
    TComponents
  >

function useFormHook(options: FormOptions<any, any, any, unknown>) {
  const form = useInternalForm(options, initializeForm)
  return form
}

/**
 * Creates a Preact form whose instance and lifecycle are owned by the current
 * component.
 *
 * `defaultValues` establish the initial state and inferred form value type.
 * Later renders apply changed options to the same form instance, and unmounting
 * the component cleans it up.
 *
 * Call this hook at the top level of a Preact component or custom hook.
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
 * @returns The Preact form API with typed field, subscription, and form-group
 * components attached.
 */
const useForm =
  useFormHook as never as UseFormHook<DefaultPreactFormComponentMap>

export { useForm }

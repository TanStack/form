import { initializeForm, useInternalForm } from './VueFormApi.lib'
import type {
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type {
  AnyVueFormComponentMap,
  DefaultVueFormComponentMap,
} from '../AppForm/componentMap.public'
import type { VueFormApi } from './formApiTypes.public'

export type UseFormHook<in out TComponents extends AnyVueFormComponentMap> = <
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => VueFormApi<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>,
  TComponents
>

function useFormHook(options: FormOptions<any, any, any>) {
  return useInternalForm(options, initializeForm)
}

/**
 * Creates a Vue form whose instance and lifecycle are owned by the current
 * component.
 *
 * `defaultValues` establish the initial state and inferred form value type. To
 * update the existing form after creation, pass a reactive options object;
 * tracked changes are applied without replacing the form instance.
 *
 * Call this during the component's setup phase. The form mounts with the
 * component and is cleaned up when the component unmounts.
 *
 * @example
 * ```ts
 * const form = useForm({
 *   defaultValues: { name: '' },
 *   onSubmit: ({ value }) => saveProfile(value),
 * })
 * ```
 *
 * @returns The Vue form API with typed field, subscription, and form-group
 * components attached.
 */
export const useForm =
  useFormHook as never as UseFormHook<DefaultVueFormComponentMap>

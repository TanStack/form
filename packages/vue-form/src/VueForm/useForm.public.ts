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

export const useForm =
  useFormHook as never as UseFormHook<DefaultVueFormComponentMap>

import { initializeForm, useInternalForm } from './ReactFormApi.lib'
import type {
  FormOptions,
  FormValidators,
  ToFormValidatorMetas,
  ToSubmitMeta,
} from '@tanstack/form-core'
import type {
  AnyReactFormComponentMap,
  DefaultReactFormComponentMap,
} from '../AppForm/componentMap.public'
import type { ReactFormApi } from './formApiTypes.public'

export type UseFormHook<in out TComponents extends AnyReactFormComponentMap> = <
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactFormApi<
  TFormData,
  ToFormValidatorMetas<TFormValidators>,
  ToSubmitMeta<TSubmitReturn>,
  TComponents
>

function useFormHook(options: FormOptions<any, any, any>) {
  const form = useInternalForm(options, initializeForm)
  return form
}

const useForm =
  useFormHook as never as UseFormHook<DefaultReactFormComponentMap>

export { useForm }

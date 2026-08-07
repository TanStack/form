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
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ) => PreactFormApi<
    TFormData,
    ToFormErrorTypes<TFormValidators, TSubmitReturn>,
    TComponents
  >

function useFormHook(options: FormOptions<any, any, any>) {
  const form = useInternalForm(options, initializeForm)
  return form
}

const useForm =
  useFormHook as never as UseFormHook<DefaultPreactFormComponentMap>

export { useForm }
